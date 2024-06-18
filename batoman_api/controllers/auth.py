from litestar import Controller, post, get
from litestar.exceptions import *
from pydantic import BaseModel;
from ..models import Session, User, AuthState
from tinydb import where

class CredentialsModel(BaseModel):
    username: str
    password: str

class AuthController(Controller):
    path = "/auth"
    
    @post("/login")
    async def post_login(self, session: Session, data: CredentialsModel) -> AuthState:
        if session.user_id:
            raise ClientException(detail="Already logged in.")
        
        user = User.query_one(where("username") == data.username)
        if user and user.verify(data.password):
            session.user_id = user.id
            session.save()
            return session.get_auth_state()
        else:
            raise NotFoundException(detail="Unknown username/password")
    