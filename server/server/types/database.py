from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession

T_AsyncSession = AsyncGenerator[AsyncSession, None]
