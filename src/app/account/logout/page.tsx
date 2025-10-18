import type { Metadata } from 'next';
import Logout from '@/app/account/logout/logout.component';
import { lang } from '@/config/lang';

export const metadata: Metadata = {
	title: lang('logout.meta.title'),
};

export default function Page() {
	return (
		<section className="fit-container">
			<div className="standard-box p-4 sm:p-8 shadow-md md:w-[22rem]">
				<Logout />
			</div>
		</section>
	);
}
