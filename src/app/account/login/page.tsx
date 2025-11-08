import type { Metadata } from 'next';
import Login from '@/app/account/login/login.component';
import { translate } from '@/config/lang';
import { cfg } from '@/config/settings';

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: await translate('login.meta.title', {
			app_name: cfg('app.name') as string,
		}),
	};
}

export default async function Page() {
	return (
		<section className="fit-container">
			<div className="standard-box p-4 sm:p-8 shadow-md md:w-[22rem]">
				<Login />
			</div>
		</section>
	);
}
