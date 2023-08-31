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


class Item(AppModel):
    text: str
    message_id: str


class MessageItem(AppModel):
    flat_id: str
    user_id: str
    own_messages: List[Item]
    other_messages: List[Item]


# Define the Pydantic model for the whole response
class ResponseModel(AppModel):
    messages: List[MessageItem]


@router.post("/get_all", response_model=ResponseModel, status_code=200)
async def get_all(
    jwt_data: JWTData = Depends(parse_jwt_user_data),
    svc: Service = Depends(get_service),
) -> dict[str, str]:
    user_id = jwt_data.user_id
    res = svc.repository.getMessages({
        "user_id": user_id,
    })

    print(res)

    messages = []
    for el in res:
        messages.append(MessageItem(**el))

    return ResponseModel(messages=messages)
