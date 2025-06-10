from typing import Literal

from pydantic import BaseModel


class FilterBaseSchema(BaseModel):
    page: int = 1
    limit: int = 10
    order: Literal['desc', 'asc'] = 'asc'
    order_by: str = 'id'
