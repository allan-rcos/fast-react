from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.helpers import settings as get_settings
from server.routes import AuthRouter, DefaultRouter, UsersRouter

settings = get_settings()

app = FastAPI(title=settings.APP_NAME, root_path=settings.ROOT_PATH)
app.include_router(DefaultRouter)
app.include_router(AuthRouter)
app.include_router(UsersRouter)

origins = ['http://localhost:3000', 'localhost:3000']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['Authorization', 'Content-Type'],
    expose_headers=['x-new-token', 'x-new-token-expires-in'],
)
