import { MantineProvider } from "@mantine/core";
import { ApiProvider, useApi } from "./util/api";
import { AuthMixin } from "./util/api/methods/auth";

function Test() {
    const api = useApi(AuthMixin);
    api.methods.login("test", "test").then(console.log);
    console.log(api);
    return <></>
}

function App() {
    return (
        <MantineProvider defaultColorScheme="dark">
            <ApiProvider>
                <Test />
            </ApiProvider>
        </MantineProvider>
    );
}

export default App;
