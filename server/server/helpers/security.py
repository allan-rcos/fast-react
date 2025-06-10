from datetime import UTC, datetime, timedelta
from string import punctuation

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from jwt import DecodeError, ExpiredSignatureError, decode, encode
from sqlalchemy import select

from server.helpers.exceptions import (
    CredentialsException,
    TooWeakPasswordException,
)
from server.helpers.settings import settings
from server.models import User
from server.types.auth import T_Session, T_Token

settings = settings()
pwd_context = PasswordHasher()


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(tz=UTC) + timedelta(minutes=settings.EXPIRE_MINUTES)
    to_encode.update({'exp': expire})
    return (
        encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM),
        expire,
    )


def decode_token(token):
    return decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])


def get_password_hash(password):
    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):
    try:
        return pwd_context.verify(hashed_password, plain_password)
    except VerifyMismatchError:
        return False


def password_validate(
    password: str, raise_exception: bool = True, **kwargs
) -> bool:
    """
    Validates the password with the settings config, to determine if it is a
    strong password.

    :param password: The password to validate.
    :param raise_exception: Raise an exception if password is invalid.
    :param kwargs: Params to subscribe the settings config: `min_length`,
        `min_digits`, `min_special`, `min_upper` and `min_lower`.
    :raise TooWeakPasswordException: If password is invalid.
    :return: If the password is valid
    """
    min_length = (
        settings.PASSWORD_MIN_LENGTH
        if 'min_length' not in kwargs
        else kwargs['min_length']
    )
    min_digits = (
        settings.PASSWORD_MIN_DIGITS
        if 'min_digits' not in kwargs
        else kwargs['min_digits']
    )
    min_special = (
        settings.PASSWORD_MIN_SPECIAL
        if 'min_special' not in kwargs
        else kwargs['min_special']
    )
    min_upper = (
        settings.PASSWORD_MIN_UPPER
        if 'min_upper' not in kwargs
        else kwargs['min_upper']
    )
    min_lower = (
        settings.PASSWORD_MIN_LOWER
        if 'min_lower' not in kwargs
        else kwargs['min_lower']
    )
    digits = 0
    uppercase = 0
    lowercase = 0
    special = 0
    for char in password:
        if char.isdigit():
            digits += 1
        elif char.isupper():
            uppercase += 1
        elif char.islower():
            lowercase += 1
        elif char in punctuation:
            special += 1
    if (
        min_digits > digits
        or min_special > special
        or min_lower > lowercase
        or min_upper > uppercase
        or min_length > len(password)
    ):
        if raise_exception:
            raise TooWeakPasswordException
        return False
    return True


async def token_user(token: T_Token, session: T_Session):
    try:
        payload = decode_token(token)
        subject = payload.get('sub')
        if not subject:
            raise CredentialsException
    except (DecodeError, ExpiredSignatureError):
        raise CredentialsException

    if subject == 'admin':
        return User(username='admin', email='admin@ad.min', password='admin')

    user = await session.scalar(select(User).where(User.username == subject))

    if not user:
        raise CredentialsException

    return user
