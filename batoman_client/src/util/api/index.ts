import { useContext } from "react";
import { ApiProvider } from "./ApiProvider";
import {
    ApiContextType,
    ApiContext,
    ApiRequestFunction,
    ApiRequestOptions,
    ApiResponse,
} from "./types";

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
