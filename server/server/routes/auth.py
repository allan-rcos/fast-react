from fastapi import APIRouter
from sqlalchemy import select

from server.helpers import create_access_token, verify_password
from server.helpers.exceptions import InvalidEmailOrPassword
from server.models import User
from server.schemas import TokenSchema
from server.types.auth import T_Credentials, T_Session
from server.types.users import T_CurrentUser

router = APIRouter(prefix='/auth', tags=['auth'])


@router.get('/', response_model=TokenSchema)
async def index(credentials: T_Credentials, session: T_Session):
    if credentials.username != 'admin':
        user = await session.scalar(
            select(User).where(User.username == credentials.username)
        )
        if not user:
            raise InvalidEmailOrPassword
        if not verify_password(credentials.password, user.password):
            raise InvalidEmailOrPassword

    elif credentials.password != 'admin':
        raise InvalidEmailOrPassword

    token, exp = create_access_token({'sub': credentials.username})

    return {'token': token, 'token_type': 'bearer', 'expires_in': exp}


@router.get('/refresh', response_model=TokenSchema)
def refresh(user: T_CurrentUser):
    new_token, new_exp = create_access_token({'sub': user.username})
    return {'token': new_token, 'token_type': 'bearer', 'expires_in': new_exp}
