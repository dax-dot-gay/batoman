import { notifications } from "@mantine/notifications";
import {
    IconCircleCheck,
    IconCircleX,
    IconExclamationCircle,
    IconInfoCircle,
} from "@tabler/icons-react";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

const NOTIFICATION_TYPES = {
    success: {
        icon: IconCircleCheck,
        color: "lime",
    },
    info: {
        icon: IconInfoCircle,
        color: "cyan",
    },
    warning: {
        icon: IconExclamationCircle,
        color: "orange",
    },
    error: {
        icon: IconCircleX,
        color: "red",
    },
};

export function useNotifications() {
    const { t } = useTranslation();
    const showNotification = useCallback(
        (
            type: keyof typeof NOTIFICATION_TYPES,
            message: string,
            title?: string,
        ) => {
            const IconElement = NOTIFICATION_TYPES[type].icon;
            notifications.show({
                color: NOTIFICATION_TYPES[type].color,
                icon: <IconElement />,
                message,
                title: title ?? t(`common.notifications.${type}`),
            });
        },
        [t],
    );

    const functions = useMemo(
        () => ({
            success: (message: string, title?: string) =>
                showNotification("success", message, title),
            info: (message: string, title?: string) =>
                showNotification("info", message, title),
            warning: (message: string, title?: string) =>
                showNotification("warning", message, title),
            error: (message: string, title?: string) =>
                showNotification("error", message, title),
        }),
        [showNotification],
    );

    return functions;
}
