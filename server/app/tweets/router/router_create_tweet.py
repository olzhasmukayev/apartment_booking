from fastapi import Depends, Response

from app.auth.adapters.jwt_service import JWTData
from app.auth.router.dependencies import parse_jwt_user_data
from app.utils import AppModel

from ..service import Service, get_service
from . import router


class CreateTweetRequest(AppModel):
    flat_id: str


@router.post("/")
def create_favorite(
    input: CreateTweetRequest,
    jwt_data: JWTData = Depends(parse_jwt_user_data),
    svc: Service = Depends(get_service),
) -> dict[str, str]:
    user_id = jwt_data.user_id
    svc.repository.create_favorite({"user_id": user_id, "flat_id": input.flat_id})

    return Response(status_code=200)
