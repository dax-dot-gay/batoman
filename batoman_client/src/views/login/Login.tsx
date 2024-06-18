import {
    Avatar,
    Box,
    Button,
    Divider,
    Group,
    Paper,
    Stack,
    Text,
    TextInput,
} from "@mantine/core";
import {
    IconDeviceGamepad2,
    IconLock,
    IconLogin2,
    IconUser,
} from "@tabler/icons-react";
import { VERSION } from "@/common";
import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";
import { PasswordInput } from "@/components/form/PasswordInput";
import { useApi } from "@/util/api";
import { AuthMixin } from "@/util/api/methods/auth";
import { useNotifications } from "@/util/notifications";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function LoginView() {
    const { t } = useTranslation();
    const form = useForm({
        initialValues: {
            username: "",
            password: "",
        },
        validate: {
            username: (value) =>
                value.length > 0 ? null : t("errors.form.field_required"),
            password: (value) =>
                value.length > 0 ? null : t("errors.form.field_required"),
        },
    });
    const api = useApi(AuthMixin);
    const { success, error } = useNotifications();
    const nav = useNavigate();

    useEffect(() => {
        if (api.state === "ready" && api.auth?.user) {
            nav("/");
        }
    }, [api.state, api.auth?.session?.id, api.auth?.user?.id]);

    return (
        <Box className="app-root auth">
            <Stack gap="sm" className="auth-container">
                <Group gap="sm" justify="space-between">
                    <Group gap="sm">
                        <Avatar size={40}>
                            <IconDeviceGamepad2 size={24} />
                        </Avatar>
                        <Text size="lg">{t("common.appName")}</Text>
                    </Group>
                    <Text c="dimmed">v{VERSION}</Text>
                </Group>
                <Paper
                    className="auth-form login paper-light"
                    p="sm"
                    radius="sm"
                    shadow="xs"
                >
                    <Stack gap="sm">
                        <Group gap="sm" justify="space-between">
                            <IconLogin2 />
                            <Text>{t("views.login.title")}</Text>
                        </Group>
                        <Divider />
                        <form
                            onSubmit={form.onSubmit(({ username, password }) =>
                                api.methods
                                    .login(username, password)
                                    .then((result) => {
                                        if (result) {
                                            success(t("views.login.success"));
                                            nav("/");
                                        } else {
                                            error(t("views.login.failed"));
                                        }
                                    }),
                            )}
                        >
                            <Stack gap="sm">
                                <TextInput
                                    label={t("views.login.fields.username")}
                                    leftSection={<IconUser size="20" />}
                                    {...form.getInputProps("username")}
                                    withAsterisk
                                />
                                <PasswordInput
                                    label={t("views.login.fields.password")}
                                    leftSection={<IconLock size={20} />}
                                    {...form.getInputProps("password")}
                                    withAsterisk
                                />
                                <Group justify="end">
                                    <Button
                                        type="submit"
                                        leftSection={<IconLogin2 size={20} />}
                                        disabled={!form.isValid()}
                                    >
                                        {t("views.login.submit")}
                                    </Button>
                                </Group>
                            </Stack>
                        </form>
                    </Stack>
                </Paper>
            </Stack>
        </Box>
    );
}
