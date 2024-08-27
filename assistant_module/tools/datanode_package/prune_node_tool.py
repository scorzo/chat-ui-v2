from langchain.pydantic_v1 import BaseModel, Field
from typing import List, Optional, Type
from langchain.tools import BaseTool
from assistant_module.generic_agent import GenericAgent
import asyncio
import json
from assistant_module.nodes import load_nodes
import logging

# Define the Node Pydantic model
class Node(BaseModel):
    name: str = Field(..., description="The name of the node")
    children: Optional[List['Node']] = Field(None, description="Optional list of child nodes")

    class Config:
        arbitrary_types_allowed = True

Node.update_forward_refs()

# The create_names_only_node_tree function
def create_names_only_node_tree(data):
    def prune_node(node):
        pruned = {"name": node["name"]}
        if "children" in node and "details" not in node:
            pruned["children"] = [prune_node(child) for child in node["children"]]
        return pruned

    return prune_node(data)

# Function to prune the original structure based on the pruned result from the LLM
def prune_original_structure(original_structure, pruned_result):
    def prune_node(original_node, pruned_node):
        # Start with the entire original node, preserving all metadata
        pruned = {k: v for k, v in original_node.items() if k != "children"}

        if "children" in pruned_node:
            pruned["children"] = []
            for child in original_node.get("children", []):
                # Find corresponding child in pruned node
                matching_pruned_child = next((p for p in pruned_node["children"] if p["name"] == child["name"]), None)
                if matching_pruned_child:
                    pruned["children"].append(prune_node(child, matching_pruned_child))
        return pruned

    return prune_node(original_structure, pruned_result)

# Tool's parameters
class PruneNodeToolParams(BaseModel):
    prompt: str = Field(description="The prompt to base the pruning of the JSON node structure upon.")

# Tool definition
class PruneNodeTool(BaseTool):
    name = "prune_node_tool"
    description = "Prunes a JSON node structure based on a user-provided prompt and returns the pruned structure in the provided Pydantic model format."
    args_schema: Type[BaseModel] = PruneNodeToolParams

    def prune_nodes(self, prompt: str) -> dict:
        """Core function to prune the node structure."""
        # Expecting a tuple (nodes_data, status)
        nodes_data, status = load_nodes()

        if status != 200:
            logging.error(f"Error loading nodes: {nodes_data.get('error')}")
            return json.dumps(nodes_data)  # Convert the error dictionary to a JSON string

        try:
            # If nodes_data is already a dictionary, no need for json.loads
            if isinstance(nodes_data, dict):
                nodes_dict = nodes_data  # Already a dictionary, so no need to decode
            else:
                nodes_dict = json.loads(nodes_data)  # Handle any unexpected format

            logging.debug("Nodes loaded successfully.")

        except json.JSONDecodeError as e:
            logging.error(f"JSONDecodeError: {e.msg} at line {e.lineno} column {e.colno} (char {e.pos})")
            return json.dumps({"error": "Error decoding nodes data"})

        # Print the size of the original data structure
        original_size = len(json.dumps(nodes_dict))
        print(f"Size of original data structure: {original_size} characters")

        # Step 1: Create a node tree of just names
        node_tree_of_names = create_names_only_node_tree(nodes_dict)

        # Step 2: Set up the GenericAgent
        pydantic_model = Node
        generic_agent = GenericAgent(model_name="gpt-4o", pydantic_model=pydantic_model)

        # Prepare the query to the LLM
        model_name_str = pydantic_model.__name__
        append_this = f"""Respond with the final answer using a single instance of the {model_name_str} output format and only the {model_name_str} output format.

        Respond with the data as a JSON object based on the {model_name_str} Pydantic model format.
        Do not enclose the JSON object in a string or any other text.
        Only provide the JSON object itself.
        """

        # Final prompt to the LLM
        full_prompt = f"""Based on the following prompt, prune the node tree below to only the relevant nodes and return it in the {model_name_str} Pydantic model format:

        {prompt}

        {json.dumps(node_tree_of_names)}

        {append_this}"""

        # Generate the response using the agent
        pruned_result = generic_agent.generate_response(full_prompt, system_instructions="")

        # Prune the original nodes data according to the pruned result
        pruned_structure = prune_original_structure(nodes_dict, pruned_result)

        # Convert the pruned structure to JSON
        pruned_json = json.dumps(pruned_structure, indent=4)

        # Print the size of the pruned data structure
        pruned_size = len(pruned_json)
        print(f"Size of pruned data structure: {pruned_size} characters")

        # Print the pruned JSON structure
        print("Pruned JSON structure:", pruned_json)

        # Return the pruned node structure
        return pruned_json

    def _run(self, prompt: str) -> dict:
        """Use the tool to prune the node structure."""
        return self.prune_nodes(prompt)

    async def _arun(self, prompt: str) -> dict:
        """Use the tool asynchronously to prune the node structure."""
        return await asyncio.to_thread(self.prune_nodes, prompt)

# Example usage
if __name__ == "__main__":
    tool = PruneNodeTool()
    result = tool._run(prompt="Keep only the Family and Members nodes")
    print("Pruned node structure:", result)
