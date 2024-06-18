import { createContext } from "react";
import { AuthState } from "../../models";

export type ApiResponse<TData = any> =
    | {
          success: true;
          data: TData;
      }
    | {
          success: false;
          code: number;
          data: any | null;
      };

export type ApiRequestOptions = (
    | {
          method?: "GET" | "DELETE";
      }
    | {
          method: "POST" | "PUT" | "PATCH";
          body?: object;
      }
) & {
    params?: { [key: string]: string };
    expect?: "json" | "text" | "blob";
};

export type ApiRequestFunction = <TData = any>(
    endpoint: string,
    options?: ApiRequestOptions,
) => Promise<ApiResponse<TData>>;

export type ApiContextType_init = {
    state: "init";
};

export type ApiContextType_ready = {
    state: "ready";
    authState: AuthState;
    request: ApiRequestFunction;
    refresh: () => Promise<AuthState | null>;
}

export type ApiContextType_error = {
    state: "error";
    refresh: () => Promise<AuthState | null>;
    reason: string | null;
};

export type ApiContextType = ApiContextType_init | ApiContextType_ready | ApiContextType_error;

export const ApiContext = createContext<ApiContextType>({
    state: "error",
    refresh: async () => null,
    reason: "Context not initialized.",
});
