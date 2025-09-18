import {cookies} from 'next/headers';
import {cfg} from '@/config/settings';

export type CookieOptions = {
    httpOnly?: boolean;
    secure?: boolean;
    path?: string;
    sameSite?: 'lax' | 'strict' | 'none';
    maxAge?: number;
    expires?: Date;
    domain?: string;
};

export async function setCookie(
    name: string,
    value: string,
    options?: CookieOptions
): Promise<void> {
    const cookieStore = await cookies();

    cookieStore.set(name, value, {
        httpOnly: options?.httpOnly ?? false,
        secure: options?.secure ?? cfg('environment') === 'production',
        path: options?.path ?? '/',
        sameSite: options?.sameSite ?? 'lax',
        maxAge: options?.maxAge,
        expires: options?.expires,
        domain: options?.domain,
    });
}

export async function getCookie(name: string): Promise<string | undefined> {
    const cookieStore = await cookies();

    return cookieStore.get(name)?.value;
}

export async function deleteCookie(name: string, path?: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete({
        name,
        path: path ?? '/',
    });
}