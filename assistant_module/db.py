from pymongo import MongoClient
import os

def get_db():
    mongo_uri = os.getenv('MONGO_URI')
    mongo_db = os.getenv('MONGO_DB')

    client = MongoClient(mongo_uri)
    return client.get_database(mongo_db)

# Collections can also be directly accessed if needed
def get_users_collection():
    db = get_db()
    return db.users

def get_families_collection():
    db = get_db()
    return db.families
