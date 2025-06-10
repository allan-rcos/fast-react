from http import HTTPStatus

from fastapi import APIRouter

from server.schemas import MessageSchema
from server.types.settings import T_Settings

router = APIRouter(tags=['default'])


@router.get('/info')
def info(settings: T_Settings):
    return {
        'app_name': settings.APP_NAME,
        'password_min_length': settings.PASSWORD_MIN_LENGTH,
        'password_min_digits': settings.PASSWORD_MIN_DIGITS,
        'password_min_special': settings.PASSWORD_MIN_SPECIAL,
        'password_min_uppercase': settings.PASSWORD_MIN_UPPER,
        'password_min_lowercase': settings.PASSWORD_MIN_LOWER,
        'token_expire_minutes': settings.EXPIRE_MINUTES,
    }


@router.get('/', status_code=HTTPStatus.OK, response_model=MessageSchema)
def read_root():
    return {'message': 'Hello world!'}
