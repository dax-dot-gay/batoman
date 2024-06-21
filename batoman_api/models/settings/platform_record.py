from typing import Type
from ...util.context import Context
from .base import BaseRecord, SettingScope
from async_igdb import PlatformModel


class PlatformRecord(BaseRecord):
    setting_scope = SettingScope.INSTANCE
    setting_key = "platforms"

    slug: str
    display_name: str
    logo: str | None = None
    enabled: bool = False
    batocera_alias: str | None = None
    source_alias: dict[str, str] = {}

    @classmethod
    async def create(
        cls: Type["PlatformRecord"],
        context: Context,
        record_id: str,
        platform_id: int = None,
        **kwargs,
    ):
        platform = await context.igdb_client.platforms.find_one(ids=[platform_id])
        if platform:
            result: PlatformModel = await context.igdb_client.resolve_links()
            return cls(
                record_id=result.slug,
                slug=result.slug,
                display_name=result.name,
                logo=(
                    f"https:{result.platform_logo.url}"
                    if result.platform_logo
                    else None
                ),
            )
        return None
