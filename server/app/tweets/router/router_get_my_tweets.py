from typing import Any, List

from fastapi import Depends
from pydantic import Field

from app.auth.adapters.jwt_service import JWTData
from app.auth.router.dependencies import parse_jwt_user_data
from app.utils import AppModel

from ..service import Service, get_service
from . import router


class GetMyFavorites(AppModel):
    id: Any = Field(alias="_id")
    flat_id: str


class GetMyFavoritesResponse(AppModel):
    likes: List[GetMyFavorites]


@router.get("/", response_model=GetMyFavoritesResponse)
def get_my_favorites(
    jwt_data: JWTData = Depends(parse_jwt_user_data),
    svc: Service = Depends(get_service),
) -> dict[str, str]:
    user_id = jwt_data.user_id
    favorites = svc.repository.get_my_favorites(user_id)

    resp = {"likes": favorites}

    return resp
