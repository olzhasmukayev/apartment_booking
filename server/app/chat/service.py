from app.config import database

from .repository.repository import ChatRepository


class Service:
    def __init__(
        self,
        repository: ChatRepository,
    ):
        self.repository = repository


def get_service():
    repository = ChatRepository(database)

    svc = Service(repository)
    return svc
