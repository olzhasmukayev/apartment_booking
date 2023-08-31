from fastapi import Depends, Response

from app.auth.adapters.jwt_service import JWTData
from app.auth.router.dependencies import parse_jwt_user_data
from app.utils import AppModel

from ..service import Service, get_service
from . import router


@router.delete("/delete/{id}")
def delete_favorite(
    id: str,
    jwt_data: JWTData = Depends(parse_jwt_user_data),
    svc: Service = Depends(get_service),
) -> dict[str, str]:
    user_id = jwt_data.user_id
    response = svc.repository.delete_favorite(id, user_id)

    if response is False:
        return Response(status_code=400)

    return Response(status_code=200)
