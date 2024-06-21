from ..models.auth import Session, User
from .session_middleware import get_session_from_connection
from litestar.exceptions import *
from litestar.connection import ASGIConnection
from litestar.handlers.base import BaseRouteHandler
from litestar.datastructures import State
from .context import Context, Config
from async_igdb import IGDBClient

async def provide_user(session: Session) -> User:
    user = session.user
    if user:
        return user
    raise NotAuthorizedException("Login required to access this endpoint.")

async def guard_logged_in(connection: ASGIConnection, route_handler: BaseRouteHandler) -> None:
    session = await get_session_from_connection(connection)
    if not session.user:
        raise NotAuthorizedException("Login required to access this endpoint.")


async def guard_is_admin(
    connection: ASGIConnection, route_handler: BaseRouteHandler
) -> None:
    session = await get_session_from_connection(connection)
    if not session.user:
        raise NotAuthorizedException("Login required to access this endpoint.")
    if not session.user.is_admin:
        raise NotAuthorizedException("Insufficient permissions")


async def provide_context(state: State) -> Context:
    return state.context


async def provide_config(context: Context) -> Config:
    return context.config


async def provide_igdb(context: Context) -> IGDBClient:
    return context.igdb_client
