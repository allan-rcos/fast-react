from sqlalchemy import asc, desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from server.helpers.exceptions import (
    BadFilterException,
    EmailAlreadyRegisteredException,
    UsernameAlreadyRegisteredException,
)
from server.models import User
from server.schemas import (
    FilterBaseSchema,
    PublicUserSchema,
    UserPatchSchema,
    UserSchema,
)


async def get_users_from_db(session: AsyncSession, filters: FilterBaseSchema):
    if filters.order_by not in PublicUserSchema.model_fields:
        exception = BadFilterException
        exception.detail['input'] = filters.order_by
        raise exception

    order = desc if filters.order == 'desc' else asc

    return await session.scalars(
        select(User)
        .offset((filters.page - 1) * filters.limit)
        .limit(filters.limit)
        .order_by(order(filters.order_by))
    )


async def user_not_exists_validate(
        session: AsyncSession,
        user: UserSchema | UserPatchSchema,
        raise_exception: bool = True,
) -> bool:
    exists = await session.scalar(
        select(User).where(
            (User.username == user.username) | (User.email == user.email)
        )
    )

    if exists:
        if raise_exception:
            if exists.username == user.username:
                raise UsernameAlreadyRegisteredException
            if exists.email == user.email:
                raise EmailAlreadyRegisteredException
        return False

    return True
