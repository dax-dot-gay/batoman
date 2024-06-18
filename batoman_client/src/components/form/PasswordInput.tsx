import {
    PasswordInput as MantinePasswordInput,
    PasswordInputProps,
} from "@mantine/core";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

export function PasswordInput(
    props: Omit<
        PasswordInputProps,
        "visibilityToggleIcon" | "visibilityToggleButtonProps"
    >,
) {
    return (
        <MantinePasswordInput
            visibilityToggleIcon={({ reveal }) =>
                reveal ? <IconEyeOff size={16} /> : <IconEye size={16} />
            }
            {...props}
        />
    );
}
