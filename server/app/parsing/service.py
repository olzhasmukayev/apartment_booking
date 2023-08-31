from app.config import database

from .repository.repository import ParseRepository


class Service:
    def __init__(
        self,
        repository: ParseRepository,
    ):
        self.repository = repository


def get_service():
    repository = ParseRepository(database)

    svc = Service(repository)
    return svc
