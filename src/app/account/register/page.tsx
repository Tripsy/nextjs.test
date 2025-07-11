import type {Metadata} from 'next';
import Register from '@/app/account/register/register.component';
import {lang} from '@/config/lang';

export const metadata: Metadata = {
    title: lang('register.meta.title'),
};

export default function Page() {
    return (
        <section className="fit-container">
            <div className="standard-box p-4 sm:p-8 shadow-md md:min-w-[28rem]">
                <Register/>
            </div>
        </section>
    );
}