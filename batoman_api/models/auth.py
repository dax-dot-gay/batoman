from datetime import datetime

from pydantic import BaseModel
from tinydb import where
from .base import BaseObject
from passlib.hash import argon2


class Session(BaseObject):
    collection = "auth.session"
    last_request: datetime | None = None
    user_id: str | None = None

    @property
    def user(self) -> "User | None":
        if not self.user_id:
            return None

        return User.get(self.user_id)

    def get_auth_state(self) -> "AuthState":
        return AuthState(session=self, user=self.user.redacted if self.user else None)


class RedactedUser(BaseModel):
    username: str
    is_admin: bool


class User(BaseObject):
    collection = "auth.user"
    username: str
    password: str
    is_admin: bool = False

    @classmethod
    def create(cls, username: str, password: str) -> "User":
        return User(username=username, password=argon2.hash(password))

    def verify(self, password: str) -> bool:
        return argon2.verify(password, self.password)

    @property
    def session(self) -> Session | None:
        result = Session.query(where("user_id") == self.id)
        if len(result) == 1:
            return result[0]
        return None

    @property
    def redacted(self) -> RedactedUser:
        return RedactedUser(username=self.username, is_admin=self.is_admin)


class AuthState(BaseModel):
    session: Session
    user: RedactedUser | None
