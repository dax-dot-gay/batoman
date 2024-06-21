export enum SettingScope {
    INSTANCE = "instance",
    EMULATOR = "emulator",
}

export interface BaseRecord {
    id: string;
    record_id: string;
    scope: SettingScope;
    key: string;
}

export interface PlatformRecord extends BaseRecord {
    scope: SettingScope.INSTANCE;
    key: "platforms";
    slug: string;
    display_name: string;
    logo: string | null;
    enabled: boolean;
    batocera_alias: string | null;
    source_alias: { [key: string]: string };
}

export type SettingsRecords = PlatformRecord;
