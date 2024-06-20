import tomllib
from pydantic import BaseModel


class PathsConfig(BaseModel):
    cache: str
    staging: str
    data: str


class BatoceraSSHConfig(BaseModel):
    host: str
    port: int = 22
    username: str
    password: str


class BatoceraPathsConfig(BaseModel):
    userdata: str


class BatoceraConfig(BaseModel):
    ssh: BatoceraSSHConfig
    paths: BatoceraPathsConfig


class AuthAdminConfig(BaseModel):
    username: str | None = None
    password: str | None = None
    active: bool = False


class AuthConfig(BaseModel):
    admin: AuthAdminConfig | None = None


class IGDBServicesConfig(BaseModel):
    client_id: str
    client_secret: str


class ServicesConfig(BaseModel):
    igdb: IGDBServicesConfig


class Config(BaseModel):
    paths: PathsConfig
    batocera: BatoceraConfig
    auth: AuthConfig
    services: ServicesConfig

    @classmethod
    def load(cls, config_path: str = "config.toml") -> "Config":
        with open(config_path, "rb") as f:
            return Config(**tomllib.load(f))
