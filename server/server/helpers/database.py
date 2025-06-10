from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine

from server.helpers.settings import settings
from server.types.database import T_AsyncSession

engine = create_async_engine(settings().DATABASE_URL)


async def get_session() -> T_AsyncSession:
    async with AsyncSession(engine, expire_on_commit=False) as session:
        yield session
