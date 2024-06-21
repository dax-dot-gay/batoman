from datetime import UTC, datetime, timedelta
from .base import BaseObject, CustomDocument
from tinydb import where
from pydantic import BaseModel
from typing import Type, TypeVar

TCache = TypeVar("TCache", bound=BaseModel)


class CacheObject[TCache](BaseObject):
    collection = "cache"

    cache_id: str
    last_cache: datetime
    expire: timedelta
    cached_data: TCache

    def save(self):
        self._check()
        self.table.upsert(
            CustomDocument(self.json, int.from_bytes(bytes.fromhex(self.id))),
            where("cache_id") == self.cache_id,
        )

    @classmethod
    def to_cache(
        cls: Type["CacheObject"],
        id: str,
        data: TCache,
        expire: timedelta = timedelta(days=1),
    ) -> "CacheObject[TCache]":
        new_cache = cls(
            cache_id=id, last_cache=datetime.now(UTC), cached_data=data, expire=expire
        )
        new_cache.save()
        return new_cache

    @classmethod
    def from_cache(cls: Type["CacheObject"], id: str) -> "CacheObject[TCache] | None":
        result = cls.query_one(where("cache_id") == id)
        if result:
            if result.last_cache + result.expire < datetime.now(UTC):
                result.delete()
                return None
            return result
        return None

    @property
    def data(self) -> TCache:
        return self.cached_data

    @data.setter
    def data(self, value: TCache):
        self.cached_data = value
        self.last_cache = datetime.now(UTC)
        self.save()
