from datetime import datetime

from bson.objectid import ObjectId
from pymongo.database import Database


class ChatRepository:
    def __init__(self, database: Database):
        self.database = database

    def saveMessage(self, input: dict):
        payload = {
            "flat_id": input["flat_id"],
            "user_id": ObjectId(input["user_id"]),
            "own_messages": input["own_messages"],
            "other_messages": input["other_messages"],
            "created_at": datetime.utcnow(),
            "counter": input["counter"]
        }

        filter_query = {"flat_id": input["flat_id"], "user_id": ObjectId(input["user_id"])}
        self.database["chats"].update_one(filter_query, {"$set": payload}, upsert=True)

    def getMessages(self, input: dict):
        filter_query = {"user_id": ObjectId(input["user_id"])}
        result = self.database["chats"].find(filter_query)

        messages = []
        for doc in result:
            doc["user_id"] = str(doc["user_id"])
            if doc["flat_id"] == "64bdfeccb45e2f6b6f1bdcbd":
                print(doc)
            messages.append(doc)

        return messages

    def getAllMessages(self):
        result = self.database["chats"].find()

        messages = []
        for doc in result:
            doc["flat_id"] = str(doc["flat_id"])
            messages.append(doc)

        return messages

    def deleteMessage(self, input: dict):
        found = self.database["chats"].find_one(
            {
                "flat_id": input["flat_id"],
                "user_id": ObjectId(input["user_id"]),
            }
        )

        if found is None:
            return False
        
        result = self.database["chats"].delete_one(
            filter={
                "flat_id": input["flat_id"],
                "user_id": ObjectId(input["user_id"]),
            },
        )

        return result.deleted_count == 1
    
    def get_shanyrak_by_id(self, id: str) -> dict | None:
        shanyrak = self.database["shanyraks"].find_one(
            {
                "flat_id": id,
            }
        )
        return shanyrak

    def get_shanyrak_by_chat(self, id: str) -> dict | None:
        shanyrak = self.database["chats"].find_one(
            {
                "flat_id": id,
            }
        )
        return shanyrak
