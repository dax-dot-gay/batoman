import { SettingScope, SettingsRecords } from "@/models";
import { ApiConstructor } from "./base";

export function SettingsMixin<TBase extends ApiConstructor>(Base: TBase) {
    return class SettingsMixin extends Base {
        public async get_settings<TRecord extends SettingsRecords = any>(
            scope: SettingScope,
            key: string,
        ): Promise<TRecord[]> {
            const result = await this.request<TRecord[]>(
                `/settings/${scope}/${key}`,
            );
            if (result.success) {
                return result.data;
            } else {
                return [];
            }
        }

        public async get_setting<TRecord extends SettingsRecords = any>(
            scope: SettingScope,
            key: string,
            id: string,
        ): Promise<TRecord | null> {
            const result = await this.request<TRecord>(
                `/settings/${scope}/${key}/${id}`,
            );
            if (result.success) {
                return result.data;
            } else {
                return null;
            }
        }

        public async create_record<
            TRecord extends SettingsRecords = any,
            TOptions extends object = any,
        >(
            scope: SettingScope,
            key: string,
            id: string,
            options: TOptions,
        ): Promise<TRecord | null> {
            const result = await this.request<TRecord>(
                `/settings/${scope}/${key}/${id}`,
                {
                    method: "POST",
                    body: options,
                },
            );
            if (result.success) {
                return result.data;
            } else {
                return null;
            }
        }

        public async delete_record(
            scope: SettingScope,
            key: string,
            id: string,
        ): Promise<void> {
            await this.request(`/settings/${scope}/${key}/${id}`, {
                method: "DELETE",
            });
        }
    };
}
