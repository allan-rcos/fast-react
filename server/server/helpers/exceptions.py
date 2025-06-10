from http import HTTPStatus

from fastapi import HTTPException

InvalidEmailOrPassword = HTTPException(
    status_code=HTTPStatus.UNAUTHORIZED, detail='Incorrect email or password'
)

CredentialsException = HTTPException(
    status_code=HTTPStatus.UNAUTHORIZED,
    detail='Could not validate credentials',
    headers={'WWW-Authenticate': 'Bearer'},
)

UserNotFoundException = HTTPException(
    status_code=HTTPStatus.NOT_FOUND, detail='User not found'
)

TooWeakPasswordException = HTTPException(
    status_code=HTTPStatus.BAD_REQUEST,
    detail='Too weak password',
)

UsernameAlreadyRegisteredException = HTTPException(
    status_code=HTTPStatus.BAD_REQUEST,
    detail='Username already registered',
)

UsernameTooShortException = HTTPException(
    status_code=HTTPStatus.BAD_REQUEST,
    detail={'msg': 'Username too short'},
)

EmailAlreadyRegisteredException = HTTPException(
    status_code=HTTPStatus.BAD_REQUEST,
    detail='Email already registered',
)

OnlyOwnerException = HTTPException(
    status_code=HTTPStatus.FORBIDDEN,
    detail='Only owner can perform this action',
)

BadFilterException = HTTPException(
    status_code=HTTPStatus.BAD_REQUEST,
    detail={'msg': 'Bad filter'},
)
