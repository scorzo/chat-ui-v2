import os
import json
import logging
from langchain.pydantic_v1 import BaseModel, Field
from langchain.tools import BaseTool
from typing import Optional, Type, Dict, Any
from langchain.callbacks.manager import CallbackManagerForToolRun, AsyncCallbackManagerForToolRun
import asyncio

from termcolor import colored

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

    def load_nodes(self) -> str:
        nodes_file_path = os.path.join(os.path.dirname(__file__), '../../../nodes', 'nodes.json')
        try:
            logging.debug("Checking if the nodes file exists.")
            if not os.path.exists(nodes_file_path):
                logging.error("File not found: %s", nodes_file_path)
                return json.dumps({"error": "File not found"})

            logging.debug("Reading the nodes file.")
            with open(nodes_file_path, 'r') as f:
                return json.dumps(json.load(f))

        except Exception as e:
            logging.exception("Exception occurred while loading nodes.")
            return json.dumps({"error": str(e)})

    def get_all_nodes(self) -> str:
        logging.info("Received request for all nodes.")
        nodes_data = self.load_nodes()
        try:
            nodes_dict = json.loads(nodes_data)
            if "error" in nodes_dict:
                logging.error("Error loading nodes: %s", nodes_dict["error"])
            else:
                logging.debug("Nodes loaded successfully.")
        except json.JSONDecodeError:
            logging.error("Error decoding nodes data.")
        return nodes_data


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

    def load_nodes(self) -> str:
        nodes_file_path = os.path.join(os.path.dirname(__file__), '../../../nodes', 'nodes.json')
        try:
            logging.debug("Checking if the nodes file exists.")
            if not os.path.exists(nodes_file_path):
                logging.error("File not found: %s", nodes_file_path)
                return json.dumps({"error": "File not found"})

            logging.debug("Reading the nodes file.")
            with open(nodes_file_path, 'r') as f:
                return json.dumps(json.load(f))

        except Exception as e:
            logging.exception("Exception occurred while loading nodes.")
            return json.dumps({"error": str(e)})

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
        nodes_data = self.load_nodes()
        try:
            nodes_dict = json.loads(nodes_data)
            if "error" in nodes_dict:
                logging.error("Error loading nodes: %s", nodes_dict["error"])
                return nodes_data

            node = self.find_node_by_id(nodes_dict, node_id)
            if node:
                logging.debug("Node found successfully.")
                return json.dumps(node)
            else:
                logging.error(f"Node ID not found: {node_id}")
                return json.dumps({"error": "Node ID not found"})
        except json.JSONDecodeError:
            logging.error("Error decoding nodes data.")
            return json.dumps({"error": "Error decoding nodes data"})
