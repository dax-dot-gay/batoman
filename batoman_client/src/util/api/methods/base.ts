import { AuthState } from "../../../models";
import { ApiContextType, ApiRequestFunction } from "../types";

export type Constructor<T extends object> = new (...args: any[]) => T;
export class BaseApiMethods {
    public constructor(public api: ApiContextType, public id: string) {}

    public updateApiContext(api: ApiContextType) {
        this.api = api;
    }

    public get request(): ApiRequestFunction {
        return this.api.state === "ready" ? this.api.request : async () => ({success: false, code: 0, data: "API not ready."});
    }

    public get state(): ApiContextType["state"] {
        return this.api.state;
    }

    public get authState(): AuthState | null {
        return this.api.state === "ready" ? this.api.authState : null;
    }

    public get refresh(): () => Promise<AuthState | null> {
        return this.api.state === "init" ? async () => null : this.api.refresh;
    }
}

export type ApiConstructor = Constructor<BaseApiMethods>;
export type ApiMethods<TBase extends ApiConstructor, TMixin extends BaseApiMethods> = (base: TBase) => TMixin;