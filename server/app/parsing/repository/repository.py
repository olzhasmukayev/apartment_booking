from datetime import datetime

from bson.objectid import ObjectId
from pymongo.database import Database


class ParseRepository:
    def __init__(self, database: Database):
        self.database = database

    def get_data(self):
        return self.database["shanyraks"].find()
