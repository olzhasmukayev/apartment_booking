from fastapi import Depends, Response
from typing import Any
from app.utils import AppModel

from app.parsing.adapters.parsing import ParseService
from app.parsing.repository.repository import ParseRepository
from . import router
from app.parsing.service import Service, get_service
from app.auth.router.dependencies import parse_jwt_user_data
from pydantic import Field
from app.auth.adapters.jwt_service import JWTData
from app.shanyraks.router.router_create_shanyrak import create_shanyrak


@router.get("/generate_txt", status_code=200)
def generate_txt(
    jwt_data: JWTData = Depends(parse_jwt_user_data),
    svc: Service = Depends(get_service),
) -> dict[str, str]:
    with open('app/docs/data.txt', 'w', encoding='utf-8') as file:
        ans = svc.repository.get_data()
        counter = 1
        for document in ans:
            flat_id = str(document.get('flat_id'))
            price = str(document.get('price'))
            address = str(document.get('address'))
            title = str(document.get('title'))
            description = str(document.get('description'))
            # Writing fields to the txt file
            file.write(f"Квартира {counter}\n")
            file.write(f"Номер: {flat_id}\n")
            file.write(f"Цена: {price} тенге\n")
            file.write(f"Адрес: {address}\n")
            file.write(f"Заголовок: {title}\n")
            file.write(f"Описание: {description}\n")
            file.write("\n")  # Add an empty line between documents
            counter += 1
    return Response(status_code=200)
