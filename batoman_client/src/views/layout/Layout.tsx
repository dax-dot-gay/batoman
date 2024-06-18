import { Outlet, useNavigate } from "react-router-dom";
import { useApi, useUser } from "../../util/api";
import { useEffect } from "react";
import {
    ActionIcon,
    AppShell,
    Avatar,
    Badge,
    Burger,
    Divider,
    Group,
    Stack,
    Text,
    useMantineTheme,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconDeviceGamepad2, IconLogout, IconUser } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { AuthMixin } from "@/util/api/methods/auth";

export function Layout() {
    const { state, auth, methods } = useApi(AuthMixin);
    const nav = useNavigate();

    useEffect(() => {
        if (state === "ready" && !auth?.user) {
            nav("/auth/login");
        }
    }, [state, auth?.session.id, auth?.user?.id]);
    const theme = useMantineTheme();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);
    const [drawer, { toggle: toggleDrawer }] = useDisclosure(false);
    const { t } = useTranslation();
    const user = useUser();

    return (
        <AppShell
            className="app-root layout"
            header={{ height: isMobile ? 60 : 48 }}
            navbar={{
                width: 256,
                breakpoint: "xs",
                collapsed: {
                    desktop: false,
                    mobile: drawer,
                },
            }}
        >
            <AppShell.Header className="paper-light layout-section header">
                <Group gap="sm" h="100%" px="sm">
                    {isMobile && (
                        <Burger opened={!drawer} onClick={toggleDrawer} />
                    )}
                    <IconDeviceGamepad2 size={28} />
                    <Text size="lg">{t("common.appName")}</Text>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar className="layout-section nav" p={0}>
                <Stack h="100%" className="nav-main" gap={0}>
                    <Stack
                        className="nav-items"
                        gap="xs"
                        style={{ flexGrow: 1 }}
                        p="sm"
                    ></Stack>
                    <Divider />
                    <Group gap="sm" p="sm" justify="space-between">
                        <Group gap="sm">
                            <Avatar>
                                <IconUser />
                            </Avatar>
                            <Stack gap={2}>
                                <Text>{user?.username}</Text>
                                <Badge variant="light" size="xs">
                                    {user?.is_admin
                                        ? t("common.auth.userType.admin")
                                        : t("common.auth.userType.user")}
                                </Badge>
                            </Stack>
                        </Group>
                        <ActionIcon
                            onClick={() =>
                                methods.logout().then(() => nav("/auth/login"))
                            }
                            size="lg"
                            variant="light"
                        >
                            <IconLogout size="20" />
                        </ActionIcon>
                    </Group>
                </Stack>
            </AppShell.Navbar>
            <AppShell.Main className="layout-section main">
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}
