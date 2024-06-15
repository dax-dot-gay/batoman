from datetime import datetime
from .base import BaseObject


class SessionModel(BaseObject):
    collection = "auth.session"
    last_request: datetime | None = None
    user_id: str | None = None
