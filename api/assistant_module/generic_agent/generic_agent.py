import json
import logging
import sys
from termcolor import colored
from langchain.agents import AgentExecutor
from langchain.agents.format_scratchpad import format_to_openai_function_messages
from langchain_core.agents import AgentActionMessageLog, AgentFinish
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_openai import ChatOpenAI

class GenericAgent:
    def __init__(self, model_name="gpt-4o", pydantic_model=None, tools=None):
        self.model_name = model_name
        self.pydantic_model = pydantic_model
        self.tools = tools or []
        self._validate_tools()

    def _validate_tools(self):
        for tool in self.tools:
            if not hasattr(tool, 'name') or not hasattr(tool, 'description') or not hasattr(tool, 'args'):
                raise ValueError(f"Invalid tool: {tool}. Each tool must have 'name', 'description', and 'args' attributes.")

    def create_agent(self, system_instructions="You are a helpful assistant"):
        agent_prompt = ChatPromptTemplate.from_messages(
            [
                ("system", system_instructions),
                ("user", "{input}"),
                MessagesPlaceholder(variable_name="agent_scratchpad"),
            ]
        )

        llm = ChatOpenAI(model=self.model_name, temperature=0)
        tools_and_model = self.tools + [self.pydantic_model]
        llm_with_tools = llm.bind_functions(tools_and_model)

        agent = (
                {
                    "input": lambda x: x["input"],
                    # Format agent scratchpad from intermediate steps
                    "agent_scratchpad": lambda x: format_to_openai_function_messages(
                        x["intermediate_steps"]
                    ),
                }
                | agent_prompt
                | llm_with_tools
                | self.parse
        )

        return agent

    def generate_response(self, prompt, system_instructions="You are a helpful assistant"):
        # Create and use the agent
        agent = self.create_agent(system_instructions)
        agent_executor = AgentExecutor(tools=self.tools, agent=agent)

        response = agent_executor.invoke(
            {"input": prompt},
            return_only_outputs=True,
        )

        return response

    def parse(self, output):
        log_data = {
            "status": "parsing_output",
            "output_content": output.content[:25] + "..." if len(output.content) > 25 else output.content,
        }

        if "function_call" not in output.additional_kwargs:
            log_data["function_call_detected"] = False
            logging.info(json.dumps(log_data))

            try:
                output_dict = json.loads(output.content)
                log_data["status"] = "parsed_json"
                log_data["parsed_content"] = output_dict
                logging.info(json.dumps(log_data))
                return AgentFinish(return_values=output_dict, log=output.content)
            except json.JSONDecodeError as e:
                log_data["status"] = "json_decode_error"
                log_data["error"] = f"{e.msg} at line {e.lineno} column {e.colno} (char {e.pos})"
                logging.error(json.dumps(log_data))
                return AgentFinish(return_values={"content": output.content}, log=output.content)
        else:
            log_data["function_call_detected"] = True
            logging.info(json.dumps(log_data))

            function_call = output.additional_kwargs["function_call"]
            name = function_call["name"]
            try:
                inputs = json.loads(function_call["arguments"])
            except json.JSONDecodeError as e:
                log_data["status"] = "json_decode_error"
                log_data["error"] = f"{e.msg} at line {e.lineno} column {e.colno} (char {e.pos})"
                logging.error(json.dumps(log_data))
                inputs = {}

            log_data["function_name"] = name
            log_data["function_inputs"] = str(inputs)[:25] + "..." if len(str(inputs)) > 25 else str(inputs)
            logging.info(json.dumps(log_data))

            if name != self.pydantic_model.__name__:
                log_data["status"] = "returning_agent_action"
                logging.info(json.dumps(log_data))
                return AgentActionMessageLog(
                    tool=name, tool_input=inputs, log="", message_log=[output]
                )
            else:
                log_data["status"] = "returning_function_inputs"
                logging.info(json.dumps(log_data))
                return AgentFinish(return_values=inputs, log=str(function_call))
