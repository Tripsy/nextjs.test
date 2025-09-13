import type {Metadata} from 'next';
import Login from '@/app/account/login/login.component';
import {lang} from '@/config/lang';
import {csrf} from '@/components/csrf';
import {RouteAuth} from '@/config/routes';
import ProtectedRoute from '@/components/protected-route.component';

export const metadata: Metadata = {
    title: lang('login.meta.title'),
};

export default async function Page() {
    const csrfInput = await csrf();

    return (
        <section className="fit-container">
            <ProtectedRoute routeAuth={RouteAuth.UNAUTHENTICATED}>
                <div className="standard-box p-4 sm:p-8 shadow-md md:w-[22rem]">
                    <Login csrfInput={csrfInput}/>
                </div>
            </ProtectedRoute>
        </section>
    );
}