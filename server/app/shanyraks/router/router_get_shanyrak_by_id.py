from fastapi import Depends, Response
from typing import Any
from app.utils import AppModel

from typing import List
from ..service import Service, get_service
from . import router
from pydantic import Field


class GetMyShanyrakResponse(AppModel):
    id: Any = Field(alias="_id")
    user_id: Any = Field(alias="user_id")
    flat_id: str
    price: int
    address: str
    title: str
    description: str
    images: List[str]


@router.get("/shanyraks/{id}", response_model=GetMyShanyrakResponse, status_code=200)
def get_shanyrak(
    id: str,
    svc: Service = Depends(get_service),
) -> dict[str, str]:
    shanyrak = svc.repository.get_shanyrak_by_id(id)

    if shanyrak is None:
        return Response(status_code=404)

    return GetMyShanyrakResponse(**shanyrak)
