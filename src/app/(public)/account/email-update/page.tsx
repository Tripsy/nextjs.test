import type { Metadata } from 'next';
import ProtectedRoute from '@/app/_components/protected-route.component';
import EmailUpdate from '@/app/(public)/account/email-update/email-update.component';
import { translate } from '@/config/lang';
import { RouteAuth } from '@/config/routes';
import { cfg } from '@/config/settings';

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: await translate('account_email_update.meta.title', {
			app_name: cfg('app.name') as string,
		}),
	};
}

export default async function Page() {
	return (
		<section className="fit-container">
			<ProtectedRoute routeAuth={RouteAuth.AUTHENTICATED}>
				<div className="standard-box p-4 sm:p-8 shadow-md md:w-[28rem]">
					<EmailUpdate />
				</div>
			</ProtectedRoute>
		</section>
	);
}
