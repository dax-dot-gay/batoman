import { MantineProvider } from "@mantine/core";
import { ApiProvider } from "./util/api";

function App() {
    return (
        <MantineProvider defaultColorScheme="dark">
            <ApiProvider></ApiProvider>
        </MantineProvider>
    );
}

export default App;
