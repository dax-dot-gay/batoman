import { ReactNode, useCallback, useEffect, useState } from "react";
import { ApiContext, ApiRequestFunction, ApiRequestOptions } from "./types";
import { trimStart } from "lodash";
import { AuthState } from "../../models";

export function ApiProvider({
    children,
}: {
    children?: ReactNode | ReactNode[];
}) {
    const request: ApiRequestFunction = useCallback(
        async (endpoint: string, options?: ApiRequestOptions) => {
            const url = `/api/${trimStart(endpoint, "/")}${options?.params ? "?" + new URLSearchParams(options.params) : ""}`;
            const result = await fetch(url, {
                method: options?.method ?? "GET",
                headers:
                    options?.expect === "blob"
                        ? {}
                        : {
                              "Content-Type":
                                  options?.expect === "text"
                                      ? "text/plain"
                                      : "application/json",
                          },
                body:
                    ["POST", "PUT", "PATCH"].includes(
                        options?.method ?? "GET",
                    ) && (options as any).body
                        ? JSON.stringify((options as any).body)
                        : undefined,
            });

            if (result.ok) {
                try {
                    switch (options?.expect) {
                        case "blob":
                            return {
                                success: true,
                                data: (await result.blob()) as any,
                            };
                        case "text":
                            return {
                                success: true,
                                data: (await result.text()) as any,
                            };
                        default:
                            return {
                                success: true,
                                data: await result.json(),
                            };
                    }
                } catch {
                    return {
                        success: false,
                        code: -1,
                        data: "Data decode failed",
                    };
                }
            } else {
                return {
                    success: false,
                    code: result.status,
                    data: await result.text(),
                };
            }
        },
        [],
    );

    const [authState, setAuthState] = useState<AuthState | null>(null);
    const [error, setError] = useState<string | null>(null);
    const reloadAuth = useCallback(async () => {
        const result = await request<AuthState>("/");
        if (result.success) {
            setAuthState(result.data);
            return result.data;
        } else {
            setAuthState(null);
            setError("Failed to acquire auth info.");
            return null;
        }
    }, [request, setAuthState, setError]);

    useEffect(() => {
        reloadAuth();
    }, [reloadAuth]);

    return (
        <ApiContext.Provider
            value={
                authState
                    ? {
                          state: "ready",
                          authState,
                          request,
                          refresh: reloadAuth,
                      }
                    : error
                      ? {
                            state: "error",
                            reason: error,
                            refresh: reloadAuth,
                        }
                      : { state: "init" }
            }
        >
            {children}
        </ApiContext.Provider>
    );
}
