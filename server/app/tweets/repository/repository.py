from datetime import datetime
from typing import List

from bson.objectid import ObjectId
from pymongo.database import Database


class LikeRepository:
    def __init__(self, database: Database):
        self.database = database

    def create_favorite(self, input: dict):
        payload = {
            "flat_id": input["flat_id"],
            "user_id": ObjectId(input["user_id"]),
            "created_at": datetime.utcnow(),
        }

        self.database["favorites"].insert_one(payload)

    def get_my_favorites(self, user_id: str) -> List[dict]:
        likes = self.database["favorites"].find(
            {
                "user_id": ObjectId(user_id),
            }
        )
        result = []
        for like in likes:
            result.append(like)

        return result

    def delete_favorite(self, id: str, user_id: str):
        found = self.database["favorites"].find_one(
            {
                "user_id": ObjectId(user_id),
                "flat_id": id,
            }
        )

        if found is None:
            return False

        result = self.database["favorites"].delete_one(
            filter={"flat_id": id},
        )

        return result.deleted_count == 1

    def is_favorite(self, id: str, user_id: str):
        found = self.database["favorites"].find_one(
            {
                "user_id": ObjectId(user_id),
                "flat_id": id,
            }
        )

        if found is None:
            return False

        return True
