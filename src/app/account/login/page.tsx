import type {Metadata} from 'next';
import LoginForm from '@/app/account/login/login-form.component';
import {lang} from '@/config/lang';

export const metadata: Metadata = {
    title: lang('login.meta.title'),
};

export default function Page() {
    return (
        <section className="fit-container">
            <div className="standard-box p-4 sm:p-8 shadow-md md:w-[22rem]">
                <LoginForm/>
            </div>
        </section>
    );
}