from litestar import Controller, get, post, delete
from litestar.di import Provide
from litestar.exceptions import *
from ..models import (
    PlatformRecord,
    BaseRecord,
    get_setting,
    User,
    SettingScope,
    RECORD_FACTORIES,
)
from ..util import guard_is_admin, provide_user, Context, guard_logged_in
from tinydb import where


class SettingsController(Controller):
    path = "/settings/{setting_scope:str}/{key:str}"
    guards = [guard_logged_in]
    dependencies = {"user": Provide(provide_user)}

    @get("/")
    async def get_all_settings(
        self, setting_scope: SettingScope, key: str
    ) -> list[BaseRecord]:
        return get_setting(setting_scope, key)

    @get(path="/{record_id:str}")
    async def get_record_by_id(
        self, setting_scope: SettingScope, key: str, record_id: str, context: Context
    ) -> BaseRecord:
        result = get_setting(setting_scope, key, query=where("record_id") == record_id)
        if len(result) > 0:
            return result[0]

        if (
            setting_scope in RECORD_FACTORIES.keys()
            and key in RECORD_FACTORIES[setting_scope].keys()
        ):
            default = RECORD_FACTORIES[setting_scope][key].default(context, record_id)
            if default:
                return default

        raise NotFoundException("Unknown record ID")

    @post("/{record_id:str}", guards=[guard_is_admin])
    async def create_record(
        self,
        setting_scope: SettingScope,
        key: str,
        record_id: str,
        context: Context,
        data: dict,
    ) -> BaseRecord:
        if (
            setting_scope in RECORD_FACTORIES.keys()
            and key in RECORD_FACTORIES[setting_scope].keys()
        ):
            new_record = await RECORD_FACTORIES[setting_scope][key].create(
                context, record_id, **data
            )
            if new_record:
                new_record.save()
                return new_record
            raise ClientException("Failed to create record")
        else:
            raise NotFoundException("Unknown scope/key")

    @delete("/{record_id:str}", guards=[guard_is_admin])
    async def delete_record(
        self, setting_scope: SettingScope, key: str, record_id: str
    ) -> None:
        result: list[BaseRecord] = get_setting[BaseRecord](
            setting_scope, key, query=where("record_id") == record_id
        )
        if len(result) > 0:
            result[0].delete()
            return None
        raise NotFoundException("Unknown reference.")
