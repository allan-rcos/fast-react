from datetime import datetime

from pydantic import BaseModel


class TokenSchema(BaseModel):
    token: str
    token_type: str
    expires_in: datetime
