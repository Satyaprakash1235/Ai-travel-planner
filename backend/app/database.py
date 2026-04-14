import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
# Added serverSelectionTimeoutMS to prevent long hangs if MongoDB is not running
client = AsyncIOMotorClient(MONGO_URI, serverSelectionTimeoutMS=2000)
db = client.trip_planner

async def save_trip(trip_data: dict):
    collection = db.trips
    result = await collection.insert_one(trip_data)
    return str(result.inserted_id)

async def get_trip(trip_id: str):
    collection = db.trips
    from bson.objectid import ObjectId
    trip = await collection.find_one({"_id": ObjectId(trip_id)})
    if trip:
        trip["_id"] = str(trip["_id"])
    return trip
