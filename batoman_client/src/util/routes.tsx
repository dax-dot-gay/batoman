import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../views/layout/Layout";
import { LoginView } from "../views/login/Login";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [],
    },
    {
        path: "/auth/login",
        element: <LoginView />,
    },
]);
