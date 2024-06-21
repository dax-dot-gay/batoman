from typing import TypeVar
from .platform_record import PlatformRecord
from .base import SettingScope, BaseRecord
from tinydb import where
from tinydb.queries import QueryLike

TRecord = TypeVar("TRecord", bound=BaseRecord)

RECORD_FACTORIES = {SettingScope.INSTANCE: {"platforms": PlatformRecord}}


def get_setting[
    TRecord
](scope: SettingScope, key: str, query: QueryLike | None = None) -> list[TRecord]:
    if query:
        result = BaseRecord.get_table().search(
            (where("scope") == scope) & (where("key") == key) & (query)
        )
    else:
        result = BaseRecord.get_table().search(
            (where("scope") == scope) & (where("key") == key)
        )

    return [RECORD_FACTORIES[scope][key](**i) for i in result]
