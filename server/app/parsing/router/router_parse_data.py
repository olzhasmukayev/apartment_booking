from fastapi import Depends, Response
from typing import Any
from app.utils import AppModel

from app.parsing.adapters.parsing import ParseService
from app.shanyraks.service import Service, get_service
from . import router
from app.auth.router.dependencies import parse_jwt_user_data
from pydantic import Field
from app.auth.adapters.jwt_service import JWTData
from app.shanyraks.router.router_create_shanyrak import create_shanyrak


@router.get("/parse", status_code=200)
def parse_shanyraks(
    jwt_data: JWTData = Depends(parse_jwt_user_data),
    svc: Service = Depends(get_service),
) -> dict[str, str]:
    for i in range(800):
        data = ParseService.parse_data(i + 1)
        for field in data:
            if field:
                print(field)
                create_shanyrak(field, jwt_data, svc)
    return Response(status_code=200)
