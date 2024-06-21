import { PlatformModel } from "@/models";
import { ApiConstructor } from "./base";

export function IGDBMixin<TBase extends ApiConstructor>(Base: TBase) {
    return class IGDBMixin extends Base {
        async get_available_platforms(): Promise<PlatformModel[]> {
            const result = await this.request<PlatformModel[]>(
                "/services/igdb/platforms",
            );
            if (result.success) {
                return result.data;
            }
            return [];
        }
    };
}
