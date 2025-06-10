from typing import Annotated

from fastapi.params import Query

from server.schemas import FilterBaseSchema

T_Filter = Annotated[FilterBaseSchema, Query()]
