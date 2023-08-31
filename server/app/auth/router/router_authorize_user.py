from fastapi import Depends, Response
from fastapi.security import OAuth2PasswordRequestForm
from app.utils import AppModel
from pydantic import Field
from bson.objectid import ObjectId
from typing import Any
from ..service import Service, get_service
from ..utils.security import check_password
from . import router
from .errors import InvalidCredentialsException


class User(AppModel):
    id: str
    email: str


class AuthorizeUserResponse(AppModel):
    access_token: str
    refresh_token: str
    user: User


@router.post("/user/login", summary="User Login", response_model=AuthorizeUserResponse)
def authorize_user(
    response: Response,
    input: OAuth2PasswordRequestForm = Depends(),
    svc: Service = Depends(get_service),
) -> AuthorizeUserResponse:
    user = svc.repository.get_user_by_email(input.username)

    if not user:
        raise InvalidCredentialsException

    if not check_password(input.password, user["password"]):
        raise InvalidCredentialsException

    refresh_token = svc.jwt_svc.create_refresh_token(user=user)
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True)
    usermodel = User(id=str(ObjectId(user['_id'])), email=user['email'])

    return AuthorizeUserResponse(
        access_token=svc.jwt_svc.create_access_token(user=user),
        refresh_token=refresh_token,
        user=usermodel
    )
