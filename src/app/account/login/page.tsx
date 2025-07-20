import type {Metadata} from 'next';
import Login from '@/app/account/login/login.component';
import {lang} from '@/config/lang';
import {csrf} from '@/components/csrf';

export const metadata: Metadata = {
    title: lang('login.meta.title'),
};

export default async function Page() {
    const csrfInput = await csrf();

    return (
        <section className="fit-container">
            <div className="standard-box p-4 sm:p-8 shadow-md md:w-[22rem]">
                <Login csrfInput={csrfInput}/>
            </div>
        </section>
    );
}