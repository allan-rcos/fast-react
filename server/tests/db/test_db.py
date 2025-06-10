import pytest
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from server.models import User


@pytest.mark.asyncio
async def test_create_user(session: AsyncSession, mock_db_created_at):
    expected = {
        'id': 1,
        'username': 'admin',
        'email': 'admin@admin.dev',
        'password': 'admin',
    }

    async with mock_db_created_at(model=User) as time:
        new_user: User = User(
            username=expected['username'],
            email=expected['email'],
            password=expected['password'],
        )
        session.add(new_user)
        await session.commit()

    expected['created_at'] = time
    expected['updated_at'] = time

    user = await session.scalar(
        select(User).where(User.username == expected['username'])
    )

    for key, value in expected.items():
        assert getattr(user, key) == value
