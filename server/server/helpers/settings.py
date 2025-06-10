from functools import lru_cache

from pydantic import PositiveInt
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file='.env', env_file_encoding='utf-8', coerce_numbers_to_str=True
    )
    APP_NAME: str = 'FastServer'
    ROOT_PATH: str = '/'
    DATABASE_URL: str = 'sqlite:///:memory:'
    SECRET_KEY: str = 'secret-key'
    ALGORITHM: str = 'HS256'
    EXPIRE_MINUTES: int = 30
    PASSWORD_MIN_LENGTH: PositiveInt = 8
    PASSWORD_MIN_DIGITS: PositiveInt = 1
    PASSWORD_MIN_SPECIAL: PositiveInt = 1
    PASSWORD_MIN_LOWER: PositiveInt = 1
    PASSWORD_MIN_UPPER: PositiveInt = 1


@lru_cache
def settings() -> Settings:
    return Settings()
