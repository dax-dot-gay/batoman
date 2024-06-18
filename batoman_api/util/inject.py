from ..models.auth import Session, User
from .session_middleware import get_session_from_connection
from litestar.exceptions import *
from litestar.connection import ASGIConnection
from litestar.handlers.base import BaseRouteHandler

async def provide_user(session: Session) -> User:
    user = session.user
    if user:
        return user
    raise NotAuthorizedException("Login required to access this endpoint.")

async def guard_logged_in(connection: ASGIConnection, route_handler: BaseRouteHandler) -> None:
    session = await get_session_from_connection(connection)
    if not session.user:
        raise NotAuthorizedException("Login required to access this endpoint.")