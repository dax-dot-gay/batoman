from enum import StrEnum
from typing import ClassVar, Type, TypeVar
from pydantic import computed_field
from ..base import BaseObject, CustomDocument, where
from ...util.context import Context


class SettingScope(StrEnum):
    INSTANCE = "instance"
    EMULATOR = "emulator"


TBase = TypeVar("TBase", bound="BaseRecord")


class BaseRecord(BaseObject):
    collection = "settings"
    setting_scope: ClassVar[SettingScope | None] = None
    setting_key: ClassVar[str | None] = None

    record_id: str

    @computed_field
    @property
    def scope(self) -> SettingScope | None:
        return self.setting_scope

    @computed_field
    @property
    def key(self) -> str | None:
        return self.setting_key

    @classmethod
    def default(cls: Type[TBase], context: Context, record_id: str) -> TBase | None:
        return None

    @classmethod
    async def create(
        cls: Type[TBase], context: Context, record_id: str, **kwargs
    ) -> TBase:
        raise NotImplementedError

    async def save(self):
        self._check()
        self.table.upsert(
            CustomDocument(self.json, int.from_bytes(bytes.fromhex(self.id))),
            where("record_id") == self.record_id,
        )
