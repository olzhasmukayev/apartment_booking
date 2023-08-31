from fastapi import Depends, Response
from typing import Any, List
from app.utils import AppModel
from pyppeteer import launch

from ..service import Service, get_service
from . import router
from app.auth.router.dependencies import parse_jwt_user_data
from pydantic import Field
from app.auth.adapters.jwt_service import JWTData
from typing import List


class DeleteShanyrakRequest(AppModel):
    id: str


@router.delete("/delete/{id}", status_code=200)
async def get_all(
    id: str,
    jwt_data: JWTData = Depends(parse_jwt_user_data),
    svc: Service = Depends(get_service),
) -> dict[str, str]:
    user_id = jwt_data.user_id
    res = svc.repository.deleteMessage({
        "user_id": user_id,
        "flat_id": id
    })

    if res is False:
        return Response(status_code=404)

    return Response(status_code=200)
