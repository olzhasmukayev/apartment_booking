from fastapi import Depends, Response
from typing import Any
from app.utils import AppModel
from pyppeteer import launch

from ..service import Service, get_service
from . import router
from app.auth.router.dependencies import parse_jwt_user_data
from pydantic import Field
from app.auth.adapters.jwt_service import JWTData
from typing import List


class GetMessageRequest(AppModel):
    appartment: str


class Item(AppModel):
    text: str
    message_id: str


class GetMessageResponse(AppModel):
    own_messages: List[Item]
    other_messages: List[Item]


@router.post("/get_messages", response_model=GetMessageResponse, status_code=200)
async def get_messages(
    input: GetMessageRequest,
    jwt_data: JWTData = Depends(parse_jwt_user_data),
    svc: Service = Depends(get_service),
) -> dict[str, str]:
    browser = await launch(headless=True, args=["--no-sandbox, --disable-dev-shm-usage, --single-process"])
    page = await browser.newPage()

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36')

    await page.goto("https://id.kolesa.kz/login/?destination=https%3A%2F%2Fkrisha.kz%2Fmy")
    await page.type("#login", "87751846008")
    await page.click(".ui-button")
    await page.waitForSelector('input[placeholder="Пароль"]', visible=True)
    await page.type("#password", "Dread_solo2")
    await page.click(".ui-button")
    await page.waitForSelector(".history-link-item", visible=True)
    await page.goto("https://krisha.kz/my/messages/?advertId=" + input.appartment)

    await page.waitForSelector('.text.message__item.message__text')

    # Execute JavaScript expression to get the elements
    divs = await page.querySelectorAll('.text.message__item.message__text')

    result_with_attribute = []
    result_without_attribute = []

    # Extract text content and message-id for each div
    for div in divs:
        text_content = await page.evaluate('(element) => element.textContent', div)
        message_id = await page.evaluate('(element) => element.getAttribute("message-id")', div)

        # Check if the div has the 'is-own' attribute
        has_attribute = await page.evaluate('(element) => element.hasAttribute("is-own")', div)

        # Append to the appropriate list based on the presence of 'is-own' attribute
        if has_attribute:
            result_with_attribute.append({'text': text_content, 'message_id': message_id})
        else:
            result_without_attribute.append({'text': text_content, 'message_id': message_id})

    await browser.close()

    user_id = jwt_data.user_id
    svc.repository.saveMessage({
        "flat_id": input.appartment,
        "user_id": user_id,
        "own_messages": result_with_attribute,
        "other_messages": result_without_attribute,
        "counter": len(result_with_attribute) + len(result_without_attribute)
    })

    return GetMessageResponse(own_messages=result_with_attribute, other_messages=result_without_attribute)
