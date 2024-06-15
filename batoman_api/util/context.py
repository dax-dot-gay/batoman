from aiotinydb import AIOTinyDB
from .config import Config


class Context:
    def __init__(self, db: AIOTinyDB, config: Config):
        self.db = AIOTinyDB
        self.config = config
