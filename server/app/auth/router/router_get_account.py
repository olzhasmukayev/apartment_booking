from typing import Any, List

from fastapi import Depends, HTTPException
from pydantic import Field

from app.utils import AppModel

from ..adapters.jwt_service import JWTData
from ..service import Service, get_service
from . import router
from .dependencies import parse_jwt_user_data


class Problem(AppModel):
    id: Any = Field(alias="_id")
    title: str


class GetAccountResponse(AppModel):
    firstname: str
    lastname: str


@router.get(
    "/user/{email}", summary="User Information", response_model=GetAccountResponse
)
def get_my_account(
    email: str,
    svc: Service = Depends(get_service),
) -> dict[str, str]:
    user = svc.repository.get_user_by_email(email)

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return user
