from litestar import Controller, get
from ..util import guard_logged_in
from async_igdb import IGDBClient, PlatformModel


class IGDBController(Controller):
    path = "/services/igdb"
    guards = [guard_logged_in]

    @get("/platforms")
    async def get_platform_list(self, igdb: IGDBClient) -> list[PlatformModel]:
        return await igdb.platforms.find(limit=500)
