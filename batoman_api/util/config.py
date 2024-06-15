import tomllib
from pydantic import BaseModel


class PathsSystemConfig(BaseModel):
    cache: str
    staging: str
    data: str


class PathsBatoceraConfig(BaseModel):
    userdata: str


class PathsConfig(BaseModel):
    system: PathsSystemConfig
    batocera: PathsBatoceraConfig


class Config(BaseModel):
    paths: PathsConfig

    @classmethod
    def load(cls, config_path: str = "config.toml") -> "Config":
        with open(config_path, "rb") as f:
            return Config(**tomllib.load(f))
