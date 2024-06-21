from litestar import Controller, get
from ..util import guard_logged_in
from async_igdb import IGDBClient, PlatformModel
from ..models import CacheObject


class IGDBController(Controller):
    path = "/services/igdb"
    guards = [guard_logged_in]

    @get("/platforms")
    async def get_platform_list(self, igdb: IGDBClient) -> list[PlatformModel]:
        cached = CacheObject.from_cache("platforms-cache")
        if cached:
            print([i["slug"] for i in cached.data])
            return cached.data

        result = await igdb.resolve_links(await igdb.platforms.find(limit=500))
        CacheObject.to_cache("platforms-cache", result)
        return result
