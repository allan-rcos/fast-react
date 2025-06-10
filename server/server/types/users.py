from typing import Annotated

from fastapi import Depends

from server.helpers import token_user
from server.models import User

T_CurrentUser = Annotated[User, Depends(token_user)]
