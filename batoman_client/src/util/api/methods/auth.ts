import { UserType } from "../../../models";
import { ApiConstructor } from "./base";

export function AuthMixin<TBase extends ApiConstructor>(Base: TBase) {
    return class AuthMixin extends Base {
        public async login(
            username: string,
            password: string,
        ): Promise<UserType | null> {
            const result = await this.request<UserType>("/auth/login", {
                method: "POST",
                body: { username, password },
            });
            if (result.success) {
                await this.refresh();
                return result.data;
            } else {
                return null;
            }
        }

        public async logout(): Promise<void> {
            await this.request<null>("/auth/logout", { method: "DELETE" });
            await this.refresh();
        }
    };
}