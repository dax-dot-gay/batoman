from contextlib import asynccontextmanager
from datetime import datetime
from typing import AsyncGenerator
from litestar import Litestar, get
from litestar.datastructures import State
from litestar.di import Provide
from .models import initialize_db, MODELS, Session, AuthState
from .util import (
    Context,
    Config,
    CookieSessionManager,
    provide_session,
    provide_config,
    provide_context,
    provide_igdb,
)
from .controllers import CONTROLLERS
from litestar import MediaType, Request, Response
from litestar.exceptions import HTTPException
from litestar.status_codes import HTTP_500_INTERNAL_SERVER_ERROR
from async_igdb import IGDBClient


@asynccontextmanager
async def lifespan(app: Litestar) -> AsyncGenerator[None, None]:
    config = Config.load()
    async with IGDBClient(
        config.services.igdb.client_id, client_secret=config.services.igdb.client_secret
    ) as igdb_client:
        async with initialize_db(MODELS, config.paths.data) as db:
            app.state.context = Context(db, config, igdb_client)
            yield


@get("/")
async def get_root(session: Session) -> AuthState:
    return session.get_auth_state()


def plain_text_exception_handler(req: Request, exc: Exception) -> Response:
    """Default handler for exceptions subclassed from HTTPException."""
    status_code = getattr(exc, "status_code", HTTP_500_INTERNAL_SERVER_ERROR)
    detail = getattr(exc, "detail", "")
    req.app.logger.exception("Encountered a server error:")

    return Response(
        media_type=MediaType.TEXT,
        content=detail,
        status_code=status_code,
    )


app = Litestar(
    route_handlers=[get_root, *CONTROLLERS],
    state=State({"context": None}),
    lifespan=[lifespan],
    exception_handlers={500: plain_text_exception_handler},
    middleware=[CookieSessionManager],
    dependencies={
        "session": Provide(provide_session),
        "context": Provide(provide_context),
        "config": Provide(provide_config),
        "igdb": Provide(provide_igdb),
    },
)
