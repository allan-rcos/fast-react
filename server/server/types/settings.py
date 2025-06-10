from typing import Annotated

from fastapi import Depends

from server.helpers import Settings, settings

T_Settings = Annotated[Settings, Depends(settings)]
