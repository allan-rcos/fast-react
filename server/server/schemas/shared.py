from pydantic import BaseModel


class CountSchema(BaseModel):
    count: int
    pages: int
