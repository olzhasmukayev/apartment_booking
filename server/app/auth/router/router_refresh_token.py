from fastapi import Depends, Request, Response
from pydantic import BaseModel

from ..service import Service, get_service
from . import router
from .dependencies import parse_jwt_user_data


class AuthorizeUserResponse(BaseModel):
    access_token: str
    refresh_token: str


@router.post("/user/refresh")
def Refresh_User_Token(
    response: Response,
    request: Request,
    svc: Service = Depends(get_service),
) -> AuthorizeUserResponse:
    refresh_token = request.cookies.get("refresh_token")
    parsed = svc.jwt_svc.parse_jwt_user_data(refresh_token)
    if parsed is None:
        return Response(status_code=403)
    if not parsed.user_id:
        return Response(status_code=403)

    user = svc.repository.get_user_by_id(parsed.user_id)

    if user is None:
        return Response(status_code=404)

    refresh_token = svc.jwt_svc.create_refresh_token(user=user)
    response.set_cookie(key="refresh_token", value=refresh_token)

    return AuthorizeUserResponse(
        access_token=svc.jwt_svc.create_access_token(user=user),
        refresh_token=refresh_token,
    )
