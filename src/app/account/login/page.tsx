import type {Metadata} from 'next';
import LoginForm from '@/app/account/login/login-form.component';
import {lang} from '@/config/lang';

export const metadata: Metadata = {
    title: lang('login.meta.title'),
};

export default function Page() {
    return (
        <section className="fit-container">
            <div className="standard-box shadow-md">
                <LoginForm/>
            </div>

        </section>
    );
}