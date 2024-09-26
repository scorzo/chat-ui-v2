import logging
from quart import jsonify
from api.assistant_module.db import get_users_collection, get_families_collection
import api.assistant_module.config as config

def load_nodes():
    try:
        logging.debug("Fetching nodes data from MongoDB.")

        user = config.user
        if not user:
            return jsonify({"error": "User not authenticated"}), 401

        # Access the database collections
        users_collection = get_users_collection()
        families_collection = get_families_collection()

        # Look up the family_id in the users collection
        user_data = users_collection.find_one({"email": user["email"]}, {"family_id": 1})

        if not user_data or "family_id" not in user_data:
            logging.error("No family_id found for the email: %s", user["email"])
            return {"error": "family_id not found"}, 404

        family_id = user_data["family_id"]

        # Query the families collection using the family_id
        family_data = families_collection.find_one({"_id": family_id}, {"nodes": 1})

        if not family_data:
            logging.error("No nodes data found for the family_id: %s", family_id)
            return {"error": "Nodes data not found"}, 404

        logging.debug("Nodes data successfully retrieved from MongoDB.")
        return family_data.get("nodes", {}), 200

    except Exception as e:
        logging.exception("Exception occurred while loading nodes from MongoDB.")
        return {"error": str(e)}, 500

def save_nodes(nodes):
    try:
        logging.debug("Saving nodes data to MongoDB.")

        user = config.user
        if not user:
            return jsonify({"error": "User not authenticated"}), 401

        # Look up the family_id in the users collection
        users_collection = get_users_collection()
        families_collection = get_families_collection()

        user_data = users_collection.find_one({"email": user["email"]}, {"family_id": 1})

        if not user_data or "family_id" not in user_data:
            logging.error("No family_id found for the email: %s", user["email"])
            return {"error": "family_id not found"}, 404

        family_id = user_data["family_id"]

        # Update only the 'nodes' field in the families collection
        result = families_collection.update_one(
            {"_id": family_id},
            {"$set": {"nodes": nodes}},
            upsert=True  # Create the document if it doesn't exist
        )

        if result.matched_count == 0 and result.upserted_id is None:
            logging.error("Failed to update nodes data for family_id: %s", family_id)
            return {"error": "Failed to save nodes"}, 500

        logging.debug("Nodes data successfully saved to MongoDB.")
        return {"message": "Nodes data saved successfully"}, 200

    except Exception as e:
        logging.exception("Exception occurred while saving nodes to MongoDB.")
        return {"error": str(e)}, 500


