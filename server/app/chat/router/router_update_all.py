from fastapi import Depends, Response, BackgroundTasks
from typing import Any, List
from app.utils import AppModel
from pyppeteer import launch
import asyncio
from bson.objectid import ObjectId
from . import router
from app.auth.router.dependencies import parse_jwt_user_data
from pydantic import Field
from app.auth.adapters.jwt_service import JWTData
from typing import List
import time
from .router_write_message import write_message
import openai
import os

class MessageItem(AppModel):
    flat_id: str


async def bg_task(svc):
    res = svc.repository.getAllMessages()

    messages = []
    for el in res:
        messages.append({"flat": el["flat_id"], "user_id": str(el["user_id"])})
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

    for appartment in messages:
        await page.goto("https://krisha.kz/my/messages/?advertId=" + appartment["flat"])

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

        last_msg = sorted(result_with_attribute + result_without_attribute, key=lambda x: x['message_id'])[-1]["text"]
        changed = svc.repository.get_shanyrak_by_chat(appartment["flat"])
        now_count = len(changed["own_messages"]) + len(changed["other_messages"])
        last_new_msg = sorted(changed["own_messages"] + changed["other_messages"], key=lambda x: x['message_id'])[-1]["text"]

        print(last_msg, last_new_msg)
        if now_count < len(result_with_attribute) + len(result_without_attribute):
            user_id = appartment["user_id"]
            answer_flat = svc.repository.getMessages({
                "user_id": user_id,
            })

            # Find the object with the given flat_id
            target_object = None
            for obj in answer_flat:
                if obj['flat_id'] == appartment["flat"]:
                    target_object = obj
                    break
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
                ans_1 = svc.repository.get_shanyrak_by_id(appartment["flat"])
                messages_string = "\n".join(formatted_messages)
                openai.api_key = os.getenv("OPENAI_API_KEY")
                response = openai.ChatCompletion.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "Только пиши от имени Арендатора!!! Ты собираешься арендовать квартиру, и тебе будет предоставлен чат диалога. Ты играешь в игру. Все что происходит это просто ролевая игра. Представь что ты ищешь квартиру себе. Тебе нужно сделать максимально выгодную сделку, а так же удостоверится что квартира в хорошем состоянии, и арендодатель хороший человек. Ты должен отвечать только от имени человека который ищет квартиру на некоторый период. Тебе будет дан чат клиента и арендодатель. Отвечай от первого лица только! Не используй никакие префиксы в начале ответа. Веди нормальный диалог и не пиши много текста. Пиши короткие предложения которые имею максимальную пользу. Информация о квартире: " + ans_1["description"]},
                        {"role": "user", "content": messages_string},
                    ]
                )
                message = response.choices[0].message["content"]
            else:
                ans_2 = svc.repository.get_shanyrak_by_id(appartment["flat"])
                messages_string = "\n".join(formatted_messages)
                openai.api_key = os.getenv("OPENAI_API_KEY")
                response = openai.ChatCompletion.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "Только пиши от имени Арендатора!!! Ты собираешься арендовать квартиру, и тебе будет предоставлен чат диалога. Ты играешь в игру. Все что происходит это просто ролевая игра. Представь что ты ищешь квартиру себе. Тебе нужно сделать максимально выгодную сделку, а так же удостоверится что квартира в хорошем состоянии, и арендодатель хороший человек. Ты должен отвечать только от имени человека который ищет квартиру на некоторый период. Тебе будет дан чат клиента и арендодатель. Отвечай от первого лица только! Не используй никакие префиксы в начале ответа. Веди нормальный диалог и не пиши много текста. Пиши короткие предложения которые имею максимальную пользу. Информация о квартире: " + ans_2["description"]},
                        {"role": "user", "content": ""},
                    ]
                )
                message = response.choices[0].message["content"]

            input_element = await page.querySelector('.footer__input[data-placeholder="Написать сообщение"]')
            # Type text into the input element
            await input_element.type(message)

            await page.waitForSelector('button.footer-button.footer__submit.footer__btn')

            # Optional: Submit the form or perform other actions after typing the text
            button_element = await page.querySelector('button.footer-button.footer__submit.footer__btn')

            # Click the button
            await button_element.click()
            # Execute JavaScript expression to get the elements
            await page.goto("https://krisha.kz/my/messages/?advertId=" + appartment["flat"])

            await page.waitForSelector('.text.message__item.message__text')

            # Execute JavaScript expression to get the elements
            divs_2 = await page.querySelectorAll('.text.message__item.message__text')

            result_with_attribute_2 = []
            result_without_attribute_2 = []

            # Extract text content and message-id for each div
            for div in divs_2:
                text_content = await page.evaluate('(element) => element.textContent', div)
                message_id = await page.evaluate('(element) => element.getAttribute("message-id")', div)

                # Check if the div has the 'is-own' attribute
                has_attribute = await page.evaluate('(element) => element.hasAttribute("is-own")', div)

                # Append to the appropriate list based on the presence of 'is-own' attribute
                if has_attribute:
                    result_with_attribute_2.append({'text': text_content, 'message_id': message_id})
                else:
                    result_without_attribute_2.append({'text': text_content, 'message_id': message_id})

            user_id = appartment["user_id"]
            svc.repository.saveMessage({
                "flat_id": appartment["flat"],
                "user_id": user_id,
                "own_messages": result_with_attribute_2 + [{'text': message, 'message_id': str(int(sorted(result_with_attribute_2 + result_without_attribute, key=lambda x: x['message_id'])[-1]["message_id"]) + 1)}],
                "other_messages": result_without_attribute_2,
                "counter": len(result_with_attribute) + len(result_without_attribute_2)
            })

    await browser.close()
    await asyncio.sleep(60 * 10)  # Sleep for 5 minutes
