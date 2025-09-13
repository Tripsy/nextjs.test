import type {Metadata} from 'next';
import {lang} from '@/config/lang';
import Logout from '@/app/account/logout/logout.component';
import ProtectedRoute from '@/components/protected-route.component';
import {RouteAuth} from '@/config/routes';

export const metadata: Metadata = {
    title: lang('logout.meta.title'),
};

export default function Page() {
    return (
        <section className="fit-container">
            <ProtectedRoute routeAuth={RouteAuth.AUTHENTICATED}>
                <div className="standard-box p-4 sm:p-8 shadow-md md:w-[22rem]">
                    <Logout/>
                </div>
            </ProtectedRoute>
        </section>
    );
}