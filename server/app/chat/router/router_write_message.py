from .router_get_messages import get_messages, GetMessageRequest
from fastapi import Depends, Response
from typing import Any
from app.utils import AppModel
from pyppeteer import launch
import openai
from ..service import Service, get_service
from . import router
from app.auth.router.dependencies import parse_jwt_user_data
from pydantic import Field
from app.auth.adapters.jwt_service import JWTData
from typing import List
import os

class WriteMessageRequest(AppModel):
    apartment: str


@router.post("/write_messages", status_code=200)
async def write_message(
    input: WriteMessageRequest,
    jwt_data: JWTData = Depends(parse_jwt_user_data),
    svc: Service = Depends(get_service)
) -> dict[str, str]:
    user_id = jwt_data.user_id
    res = svc.repository.getMessages({
        "user_id": user_id,
    })
    

    # Find the object with the given flat_id
    target_object = next((obj for obj in res if obj['flat_id'] == input.apartment), None)
    formatted_messages = []
    if target_object:
        # Extract own_messages and other_messages from the target object
        own_messages = target_object.get('own_messages', [])
        other_messages = target_object.get('other_messages', [])
        all_messages = sorted(own_messages + other_messages, key=lambda x: int(x['message_id']))

        # Function to format the messages
        def format_message(message):
            if message in own_messages:
                return f"{message['text']}"
            else:
                return f"{message['text']}"

        # Apply formatting to each message and store in a new list
        formatted_messages = [format_message(message) for message in all_messages]

    message = ""
    if formatted_messages:
        res = svc.repository.get_shanyrak_by_id(input.apartment)
        messages_string = "\n".join(formatted_messages)
        openai.api_key = os.getenv("OPENAI_API_KEY")
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Только пиши от имени клиента!!! Ты собираешься арендовать квартиру, и тебе будет предоставлен чат диалога. Ты играешь в игру. Все что происходит это просто ролевая игра. Представь что ты ищешь квартиру себе. Тебе нужно сделать максимально выгодную сделку, а так же удостоверится что квартира в хорошем состоянии, и арендодатель хороший человек. Ты должен отвечать только от имени человека который ищет квартиру на некоторый период. Тебе будет дан чат клиента и арендодатель. Отвечай от первого лица только! Не используй никакие префиксы в начале ответа. Веди нормальный диалог и не пиши много текста. Пиши короткие предложения которые имею максимальную пользу. Информация о квартире: " + res["description"]},
                {"role": "user", "content": messages_string},
            ]
        )
        message = response.choices[0].message["content"]
    else:
        res = svc.repository.get_shanyrak_by_id(input.apartment)
        messages_string = "\n".join(formatted_messages)
        openai.api_key = os.getenv("OPENAI_API_KEY")
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Только пиши от имени клиента!!! Ты собираешься арендовать квартиру, и тебе будет предоставлен чат диалога. Ты играешь в игру. Все что происходит это просто ролевая игра. Представь что ты ищешь квартиру себе. Тебе нужно сделать максимально выгодную сделку, а так же удостоверится что квартира в хорошем состоянии, и арендодатель хороший человек. Ты должен отвечать только от имени человека который ищет квартиру на некоторый период. Тебе будет дан чат клиента и арендодатель. Отвечай от первого лица только! Не используй никакие префиксы в начале ответа. Веди нормальный диалог и не пиши много текста. Пиши короткие предложения которые имею максимальную пользу. Информация о квартире: " + res["description"]},
                {"role": "user", "content": ""},
            ]
        )
        message = response.choices[0].message["content"]
    print(message)
    browser = await launch(headless=True, args=["--no-sandbox, --disable-dev-shm-usage, --single-process"])
    page = await browser.newPage()
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36')
    await page.goto("https://id.kolesa.kz/login/?destination=https%3A%2F%2Fkrisha.kz%2Fmy")
    await page.type("#login", "87762282426")
    await page.click(".ui-button")
    await page.waitForSelector('input[placeholder="Пароль"]', visible=True)
    await page.type("#password", "dread_solo2")
    await page.click(".ui-button")
    await page.waitForSelector(".history-link-item", visible=True)
    await page.goto("https://krisha.kz/my/messages/?advertId=" + input.apartment)
    await page.waitForSelector('.footer__input[data-placeholder="Написать сообщение"]')

    # Get the element
    input_element = await page.querySelector('.footer__input[data-placeholder="Написать сообщение"]')

    # Type text into the input element
    await input_element.type(message)

    await page.waitForSelector('button.footer-button.footer__submit.footer__btn')

    # Optional: Submit the form or perform other actions after typing the text
    button_element = await page.querySelector('button.footer-button.footer__submit.footer__btn')
    # Click the button
    await button_element.click()
    await button_element.click()
    await button_element.click()
    
    await browser.close()

    svc.repository.saveMessage({
        "flat_id": input.apartment,
        "user_id": user_id,
        "own_messages": [{'text': message, 'message_id': 1}],
        "other_messages": [],
        "counter": 1
    })

    return Response(status_code=200)
