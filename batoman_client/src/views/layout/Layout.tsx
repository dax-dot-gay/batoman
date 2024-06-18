import { useNavigate } from "react-router-dom";
import { useApi } from "../../util/api";
import { useEffect } from "react";

export function Layout() {
    const { state, auth } = useApi();
    const nav = useNavigate();

    useEffect(() => {
        if (state === "ready" && !auth?.user) {
            nav("/auth/login");
        }
    }, [state, auth?.session.id, auth?.user?.id]);

    return <></>;
}
