import asyncio
from contextlib import asynccontextmanager
from typing import Any, AsyncGenerator, Callable, ClassVar, Mapping, Type, TypeVar
from uuid import uuid4
from pydantic import BaseModel, Field
from aiotinydb import AIOTinyDB
from tinydb import where
from tinydb.queries import QueryLike
from tinydb.table import Table, Document
import concurrent.futures


class CustomDocument(Document):
    def __init__(self, value: Mapping, doc_id: str):
        super().__init__(value, doc_id)


class CustomTable(Table):
    document_id_class = str
    document_class: CustomDocument

    def _get_next_id(self):
        return uuid4()


class CustomDB(Table):
    document_id_class = str

    def _get_next_id(self):
        return uuid4()


TBase = TypeVar("TBase", bound="BaseObject")


class BaseObject(BaseModel):
    model_config = {"arbitrary_types_allowed": True}
    _db: ClassVar[AIOTinyDB | None] = None
    collection: ClassVar[str] = None

    id: str = Field(default_factory=lambda: uuid4().hex)

    @classmethod
    def _init(cls, db: AIOTinyDB):
        cls._db = db

    @classmethod
    def _check_class(cls) -> None:
        if cls._db == None:
            raise RuntimeError("Model was not initialized.")

    def _check(self) -> None:
        if self._db == None:
            raise RuntimeError("Model was not initialized.")

    @classmethod
    def get_table(cls) -> CustomTable:
        cls._check_class()
        if not cls.collection:
            return cls._db.table("_default")
        return cls._db.table(cls.collection)

    @property
    def table(self) -> CustomTable:
        self._check()
        if not self.collection:
            return self._db.table("_default")
        return self._db.table(self.collection)

    @classmethod
    def get(cls: Type[TBase], id: str) -> TBase | None:
        cls._check_class()
        result = cls.get_table().get(doc_id=int.from_bytes(bytes.fromhex(id)))
        return cls(**result) if result else None

    @classmethod
    def query(cls: Type[TBase], query: QueryLike) -> list[TBase]:
        cls._check_class()
        return [cls(**i) for i in cls.get_table().search(query)]

    @classmethod
    def query_one(cls: Type[TBase], query: QueryLike) -> TBase | None:
        cls._check_class()
        result = cls.get_table().get(query)
        return cls(**result) if result else None

    @classmethod
    def all(cls: Type[TBase]) -> list[TBase]:
        cls._check_class()
        return [cls(**i) for i in cls.get_table().all()]

    @property
    def json(self):
        return self.model_dump(mode="json")

    def save(self):
        self._check()
        self.table.upsert(
            CustomDocument(self.json, int.from_bytes(bytes.fromhex(self.id))),
            where("id") == self.id,
        )

    def delete(self):
        self._check()
        self.table.remove(doc_ids=[int.from_bytes(bytes.fromhex(self.id))])


@asynccontextmanager
async def initialize_db(
    document_classes: list[Type[BaseObject]], storage: str
) -> AsyncGenerator[AIOTinyDB, None]:
    async with AIOTinyDB(storage) as db:
        db.document_id_class = str
        db.table_class = CustomTable
        db.document_class = CustomDocument
        for doc in document_classes:
            doc._init(db)

        try:
            yield db
        finally:
            pass
