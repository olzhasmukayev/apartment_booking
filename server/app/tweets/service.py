from app.config import database

from .repository.repository import LikeRepository


class Service:
    def __init__(
        self,
        repository: LikeRepository,
    ):
        self.repository = repository


def get_service():
    repository = LikeRepository(database)

    svc = Service(repository)
    return svc
