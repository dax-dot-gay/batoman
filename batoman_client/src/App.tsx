import { MantineProvider } from "@mantine/core";
import { ApiProvider } from "./util/api";
import { I18nextProvider } from "react-i18next";
import i18n from "./util/localization";
import { RouterProvider } from "react-router-dom";
import { router } from "./util/routes";

function App() {
    return (
        <MantineProvider defaultColorScheme="dark">
            <I18nextProvider i18n={i18n} defaultNS={"translation"}>
                <ApiProvider>
                    <RouterProvider router={router} />
                </ApiProvider>
            </I18nextProvider>
        </MantineProvider>
    );
}

export default App;
