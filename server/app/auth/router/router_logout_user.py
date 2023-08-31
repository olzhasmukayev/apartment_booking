from fastapi import Cookie, Depends, Request, Response
from ..service import Service, get_service
from . import router


@router.post("/user/logout")
def Logout_User(
    response: Response
) -> None:
    response.delete_cookie("refresh_token")
    return {"message": "Cookie deleted"}
