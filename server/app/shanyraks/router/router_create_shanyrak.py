from fastapi import Depends

from typing import List
from app.auth.adapters.jwt_service import JWTData
from app.auth.router.dependencies import parse_jwt_user_data
from app.utils import AppModel

from ..service import Service, get_service
from . import router


class CreateShanyrakRequest(AppModel):
    flat_id: str
    price: int
    address: str
    title: float
    description: str
    images: List[str]


class CreateShanyrakResponse(AppModel):
    id: str


@router.post("/", response_model=CreateShanyrakResponse, status_code=200)
def create_shanyrak(
    input: CreateShanyrakRequest,
    jwt_data: JWTData = Depends(),
    svc: Service = Depends(get_service),
) -> dict[str, str]:
    user_id = jwt_data.user_id
    print(input)
    shanyrak_id = svc.repository.create_shanyrak(
        {
            "user_id": user_id,
            "flat_id": input["flat_id"],
            "price": input["price"],
            "address": input["address"],
            "title": input["title"],
            "description": input["description"],
            "images": input["images"]
        }
    )

    return CreateShanyrakResponse(id=shanyrak_id)
