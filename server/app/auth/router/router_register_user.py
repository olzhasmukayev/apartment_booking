from fastapi import Depends, HTTPException, status, Response
from bson.objectid import ObjectId
from typing import Optional
from pydantic import BaseModel, Field
from app.utils import AppModel
from ..service import Service, get_service
from . import router
from typing import Any


class RegisterUserRequest(AppModel):
    email: str
    password: str
    firstname: str
    lastname: str


class User(AppModel):
    id: Any = Field(alias="_id")
    email: str


class RegisterUserResponse(AppModel):
    access_token: str
    refresh_token: str
    user: User


@router.post(
    "/user/registration",
    status_code=status.HTTP_201_CREATED,
    response_model=RegisterUserResponse,
)
def register_user(
    response: Response,
    input: RegisterUserRequest,
    svc: Service = Depends(get_service),
) -> dict[str, str]:
    if svc.repository.get_user_by_email(input.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already taken.",
        )

    id = svc.repository.create_user(input.dict())
    user = svc.repository.get_user_by_id(id)
    usermodel = User(**user)
    refresh_token = svc.jwt_svc.create_refresh_token(user=user)
    response.set_cookie(key="refresh_token", value=refresh_token)
    return RegisterUserResponse(
        access_token=svc.jwt_svc.create_access_token(user=user),
        refresh_token=refresh_token,
        user=usermodel,
    )
