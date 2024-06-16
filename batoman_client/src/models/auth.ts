export type SessionType = {
    id: string;
    last_request: string;
    user_id: string | null;
};

export type UserType = {
    id: string;
    username: string;
    is_admin: boolean;
};

export type AuthState = {
    session: SessionType;
    user: UserType | null;
};
