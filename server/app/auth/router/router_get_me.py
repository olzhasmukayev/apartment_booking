from typing import Any, List

from fastapi import Depends, HTTPException
from pydantic import Field
from app.auth.adapters.jwt_service import JWTData
from app.auth.router.dependencies import parse_jwt_user_data
from app.utils import AppModel

from ..service import Service, get_service
from . import router


class GetAccountResponse(AppModel):
    id: Any = Field(alias="_id")
    email: str


@router.post("/user/me")
def get_me(
    jwt_data: JWTData = Depends(parse_jwt_user_data),
    svc: Service = Depends(get_service),
) -> dict[str, str]:
    user_id = jwt_data.user_id
    user = svc.repository.get_user_by_id(user_id)
    return GetAccountResponse(id=str(user['_id']), email=user['email'])
