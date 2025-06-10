from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, constr

from server.helpers import settings


class UserSchema(BaseModel):
    username: constr(strip_whitespace=True, min_length=3)
    password: constr(
        strip_whitespace=True, min_length=settings().PASSWORD_MIN_LENGTH
    )
    email: EmailStr


class UserPatchSchema(BaseModel):
    username: Optional[constr(strip_whitespace=True)] = None
    password: Optional[constr(strip_whitespace=True)] = None
    email: Optional[EmailStr] = None


class PublicUserSchema(BaseModel):
    id: int
    username: str
    email: EmailStr
    created_at: datetime
    updated_at: datetime
