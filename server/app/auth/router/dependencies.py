from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

from ..adapters.jwt_service import JWTData
from ..service import Service, get_service
from .errors import AuthenticationRequiredException

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/user/login", auto_error=False)


def parse_jwt_user_data(
    token: str = Depends(oauth2_scheme),
    svc: Service = Depends(get_service),
) -> JWTData:
    try:
        token = svc.jwt_svc.parse_jwt_user_data(token)
    except Exception:
        raise AuthenticationRequiredException

    if not token:
        raise AuthenticationRequiredException

    return token
