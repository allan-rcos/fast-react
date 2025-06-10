from contextlib import asynccontextmanager
from datetime import datetime

import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from sqlalchemy import StaticPool, event
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine

from server.app import app
from server.helpers import Settings, get_password_hash, get_session
from server.models import User
from server.models.table_registry import table_registry
from server.schemas import UserSchema


@pytest.fixture
def client(session):
    def get_session_override():
        return session

    with TestClient(app) as client:
        app.dependency_overrides[get_session] = get_session_override
        yield client

    app.dependency_overrides = {}


@pytest_asyncio.fixture
async def session():
    engine = create_async_engine(
        'sqlite+aiosqlite:///:memory:',
        connect_args={'check_same_thread': False},
        poolclass=StaticPool,
    )
    async with engine.begin() as conn:
        await conn.run_sync(table_registry.metadata.create_all)

    async with AsyncSession(engine, expire_on_commit=False) as session:
        yield session

    async with engine.begin() as conn:
        await conn.run_sync(table_registry.metadata.drop_all)


@pytest_asyncio.fixture
async def user(client, session):
    ppwd = 'T3$tT3$t'
    user = User(
        username='test',
        email='test@test.io',
        password=get_password_hash(ppwd),
    )

    session.add(user)
    await session.commit()
    await session.refresh(user)

    user.plain_password = ppwd

    return user


@pytest.fixture
def unknown_user_schema():
    return UserSchema(
        username='unknown', email='unknown@what.io', password='sTr0nG_p@sW0Rd'
    )


@pytest_asyncio.fixture
async def unknown_user(client, session, unknown_user_schema):
    user = User(**unknown_user_schema.model_dump())

    session.add(user)
    await session.commit()
    await session.refresh(user)

    user.plain_password = unknown_user_schema.password

    return user


@pytest.fixture
def token(client, user):
    response = client.get(
        '/auth/', auth=(user.username, getattr(user, 'plain_password'))
    )
    data = response.json()
    data['headers'] = {'Authorization': f'Bearer {data["token"]}'}

    return data


@asynccontextmanager
async def _mock_db_created_at(model, time=datetime(2024, 1, 1)):
    def fake_time_hook(mapper, connection, target):
        if hasattr(target, 'created_at'):
            target.created_at = time
        if hasattr(target, 'updated_at'):
            target.updated_at = time

    event.listen(model, 'before_insert', fake_time_hook)

    yield time

    event.remove(model, 'before_insert', fake_time_hook)


@pytest.fixture
def settings():
    return Settings()


@pytest.fixture
def mock_db_created_at():
    return _mock_db_created_at
