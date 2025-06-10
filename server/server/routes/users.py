import math

from fastapi import APIRouter, HTTPException, Response
from sqlalchemy import func, select

from server.helpers import (
    create_access_token,
    get_password_hash,
    get_users_from_db,
    password_validate,
    user_not_exists_validate,
)
from server.helpers.exceptions import (
    EmailAlreadyRegisteredException,
    OnlyOwnerException,
    UsernameAlreadyRegisteredException,
    UsernameTooShortException,
    UserNotFoundException,
)
from server.models import User
from server.schemas import PublicUserSchema, UserPatchSchema, UserSchema
from server.schemas.shared import CountSchema
from server.types.auth import T_Session
from server.types.filters import T_Filter
from server.types.users import T_CurrentUser

router = APIRouter(prefix='/users', tags=['users'])


@router.get('/count', response_model=CountSchema)
async def get_users_count(
    user: T_CurrentUser, session: T_Session, filters: T_Filter
):
    count = await session.scalar(func.count(User.id))
    return {'count': count, 'pages': math.ceil(count / filters.limit) or 1}


@router.get('/', response_model=list[PublicUserSchema])
async def get_users(
    user: T_CurrentUser,
    session: T_Session,
    filters: T_Filter,
):
    return await get_users_from_db(session, filters)


@router.get('/{username}', response_model=PublicUserSchema)
async def get_user(username: str, user: T_CurrentUser, session: T_Session):
    user = await session.scalar(select(User).where(User.username == username))

    if not user:
        raise UserNotFoundException

    return user


@router.post('/', response_model=list[PublicUserSchema])
async def post_user(
    new_user: UserSchema,
    user: T_CurrentUser,
    session: T_Session,
    filters: T_Filter,
):
    password_validate(new_user.password)

    await user_not_exists_validate(session, new_user)

    session.add(
        User(
            username=new_user.username,
            email=new_user.email,
            password=get_password_hash(new_user.password),
        )
    )
    await session.commit()

    return await get_users_from_db(session, filters)


@router.patch('/{username}', response_model=list[PublicUserSchema])
async def patch_user(
    username: str,
    user2update: UserPatchSchema,
    user: T_CurrentUser,
    session: T_Session,
    response: Response,
    filters: T_Filter,
):
    if username != user.username:
        raise OnlyOwnerException

    username_changed = (
        user2update.username and user2update.username != user.username
    )
    email_changed = user2update.email and user2update.email != user.email
    password_changed = bool(user2update.password)
    min_username_length = 3
    if password_changed:
        password_validate(user2update.password)
    if username_changed and len(user2update.username) < min_username_length:
        exception = UsernameTooShortException
        exception.detail['input'] = user2update.username
        raise exception
    if username_changed or email_changed:
        try:
            await user_not_exists_validate(session, user2update)
        except HTTPException as e:
            if (
                e.detail == UsernameAlreadyRegisteredException.detail
                and username_changed
            ):
                raise e
            if (
                e.detail == EmailAlreadyRegisteredException.detail
                and email_changed
            ):
                raise e

    if email_changed:
        user.email = user2update.email
    if username_changed:
        user.username = user2update.username
    if password_changed:
        user.password = get_password_hash(user2update.password)

    await session.commit()
    users = await get_users_from_db(session, filters)
    if username_changed:
        new_token, exp = create_access_token({'sub': user2update.username})
        response.headers['x-new-token'] = new_token
        response.headers['x-new-token-expires-in'] = str(int(exp.timestamp()))

    return users


@router.delete('/{username}', response_model=list[PublicUserSchema])
async def delete_user(
    username: str, user: T_CurrentUser, session: T_Session, filters: T_Filter
):
    if username != user.username:
        raise OnlyOwnerException

    await session.delete(user)
    await session.commit()

    return await get_users_from_db(session, filters)
