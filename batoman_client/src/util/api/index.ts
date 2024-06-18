import { useContext } from "react";
import { ApiProvider } from "./ApiProvider";
import {
    ApiContextType,
    ApiContext,
    ApiRequestFunction,
    ApiRequestOptions,
    ApiResponse,
    ApiContextType_ready,
} from "./types";
import { ApiMethods, BaseApiMethods } from "./methods/base";
import { AuthState } from "../../models";
import { UnionToIntersection, ValuesType } from "utility-types";
import { useCustomCompareMemo } from "use-custom-compare";
import { difference, eq, uniqueId } from "lodash";

export { ApiProvider };
export type {
    ApiContextType,
    ApiRequestFunction,
    ApiRequestOptions,
    ApiResponse,
};

export function useApiContext(): ApiContextType {
    return useContext(ApiContext);
}

export function useApi<TMixins extends ApiMethods<any, any>[]>(
    ...withMixins: TMixins
): {
    state: ApiContextType["state"];
    auth: AuthState | null;
    methods: typeof BaseApiMethods &
        UnionToIntersection<ReturnType<ValuesType<TMixins>>["prototype"]>;
} {
    const context = useApiContext();
    const constructedMethods = useCustomCompareMemo(() => {
        return new (withMixins.reduce((prev, cur) => cur(prev), BaseApiMethods))(context, uniqueId());
    }, [context, withMixins], ([prevContext, prevMixins], [nextContext, nextMixins]) => {
        const prevNames = prevMixins.map(v => v.name);
        const nextNames = nextMixins.map(v => v.name);
        if (difference(prevNames, nextNames).length > 0) {
            return false;
        }

        if (prevContext.state === nextContext.state) {
            switch (nextContext.state) {
                case "error":
                    return true;
                case "init":
                    return true;
                default:
                    const prev = prevContext as ApiContextType_ready;
                    if (nextContext.authState.user?.id !== prev.authState.user?.id) {
                        return false;
                    }

                    if (nextContext.authState.session.id !== prev.authState.session.id || nextContext.authState.session.user_id !== prev.authState.session.user_id) {
                        return false;
                    }

                    if (!eq(nextContext.request, prev.request)) {
                        return false;
                    }

                    if (!eq(nextContext.refresh, prev.refresh)) {
                        return false;
                    }

                    return true;
            }
        } else {
            return false;
        }
    });

    return {
        state: context.state,
        auth: context.state === "ready" ? context.authState : null,
        methods: constructedMethods as any
    }
}
