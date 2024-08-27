import json
import logging
from langchain.pydantic_v1 import BaseModel, Field
from langchain.tools import BaseTool
from typing import Optional, Type, Dict, Any
import asyncio

from termcolor import colored

from assistant_module.nodes import load_nodes, save_nodes

class GetAllNodesTool(BaseTool):
    name = "get_all_nodes"
    description = "Return a data structure containing comprehensive details related to the digital twin schedule, including life events, activities, dates, values, and associated information."

    def _run(
            self, **kwargs: Any
    ) -> str:
        """Use the tool."""
        return self.get_all_nodes()

    async def _arun(
            self, **kwargs: Any
    ) -> str:
        """Use the tool asynchronously."""
        return await asyncio.to_thread(self.get_all_nodes)



    def get_all_nodes(self) -> str:
        logging.info("Received request for all nodes.")

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

        # Convert the final dictionary back to a JSON string before returning
        return json.dumps(nodes_dict)



class NodeParams(BaseModel):
    node_id: str = Field(description="The ID of the node to retrieve.")

class GetNodeByIdTool(BaseTool):
    name = "get_node_by_id"
    description = "Retrieves a single node from the nodes.json file based on node_id."
    args_schema: Type[BaseModel] = NodeParams

    def _run(
            self, node_id: str, **kwargs: Any
    ) -> str:
        """Use the tool."""
        print(colored(f"get_node_by_id got node_id: {node_id}", "red"))
        return self.get_node_by_id(node_id)

    async def _arun(
            self, node_id: str, **kwargs: Any
    ) -> str:
        """Use the tool asynchronously."""
        return await asyncio.to_thread(self.get_node_by_id, node_id)

    def find_node_by_id(self, nodes_data: Dict[str, Any], node_id: str) -> Optional[Dict[str, Any]]:
        def recursive_find(node, target_id):
            if node['node_id'] == target_id:
                return node
            if 'children' in node:
                for child in node['children']:
                    result = recursive_find(child, target_id)
                    if result:
                        return result
            return None

        return recursive_find(nodes_data, node_id)

    def get_node_by_id(self, node_id: str) -> str:
        logging.info(f"Received request for node ID: {node_id}")
        logging.debug(f"Type of node_id: {type(node_id)}")

        # Expecting a tuple (nodes_data, status)
        nodes_data, status = load_nodes()
        logging.debug(f"Type of nodes_data: {type(nodes_data)}, status: {status}")

        if status != 200:
            logging.error(f"Error loading nodes: {nodes_data.get('error', 'Unknown error')}")
            logging.debug(f"Returning error response. Type of nodes_data: {type(nodes_data)}")
            return json.dumps(nodes_data)  # Convert the error dictionary to a JSON string

        try:
            # If nodes_data is already a dictionary, no need for json.loads
            if isinstance(nodes_data, dict):
                nodes_dict = nodes_data  # Already a dictionary, so no need to decode
                logging.debug("nodes_data is already a dictionary, no need for JSON parsing.")
            else:
                nodes_dict = json.loads(nodes_data)  # Handle any unexpected format
                logging.debug(f"JSON parsing completed. Type of nodes_dict: {type(nodes_dict)}")

            logging.debug("Nodes loaded successfully.")
            logging.debug(f"Type of nodes_dict after JSON parsing: {type(nodes_dict)}")

            logging.debug("Searching for node in nodes_dict.")
            node = self.find_node_by_id(nodes_dict, node_id)
            logging.debug(f"Type of node: {type(node)}")

            if node:
                logging.debug("Node found successfully. Returning node data.")
                return json.dumps(node)
            else:
                logging.error(f"Node ID not found: {node_id}")
                return json.dumps({"error": "Node ID not found"})
        except json.JSONDecodeError as e:
            logging.error(f"JSONDecodeError: {e.msg} at line {e.lineno} column {e.colno} (char {e.pos})")
            return json.dumps({"error": "Error decoding nodes data"})

