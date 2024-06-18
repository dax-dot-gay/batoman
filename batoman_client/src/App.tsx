import { MantineProvider, createTheme } from "@mantine/core";
import { ApiProvider } from "./util/api";
import { I18nextProvider } from "react-i18next";
import i18n from "./util/localization";
import { RouterProvider } from "react-router-dom";
import { router } from "./util/routes";
import "./styles/index.scss";
import { Notifications } from "@mantine/notifications";

function App() {
    return (
        <MantineProvider
            defaultColorScheme="dark"
            theme={createTheme({
                colors: {
                    primary: [
                        "#ffeaf3",
                        "#fdd4e1",
                        "#f4a7bf",
                        "#ec779c",
                        "#e64f7e",
                        "#e3356b",
                        "#e22762",
                        "#c91a52",
                        "#b41149",
                        "#9f003e",
                    ],
                },
                primaryColor: "primary",
                primaryShade: 7,
            })}
        >
            <I18nextProvider i18n={i18n} defaultNS={"translation"}>
                <ApiProvider>
                    <Notifications />
                    <RouterProvider router={router} />
                </ApiProvider>
            </I18nextProvider>
        </MantineProvider>
    );
}

export default App;
