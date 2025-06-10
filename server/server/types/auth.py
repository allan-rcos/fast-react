from typing import Annotated

from fastapi import Depends
from fastapi.security import (
    HTTPBasic,
    HTTPBasicCredentials,
    OAuth2PasswordBearer,
)

from server.helpers.database import get_session
from server.types.database import T_AsyncSession

T_Credentials = Annotated[HTTPBasicCredentials, Depends(HTTPBasic())]
T_Session = Annotated[T_AsyncSession, Depends(get_session)]
T_Token = Annotated[str, Depends(OAuth2PasswordBearer(tokenUrl='auth'))]
