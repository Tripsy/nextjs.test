export type LogoutSituation = 'success' | 'error' | null;

export type LogoutState = {
    message: string | null;
    situation: LogoutSituation;
};

export const defaultLogoutState: LogoutState = {
    message: null,
    situation: null
};