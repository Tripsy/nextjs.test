import type { Metadata } from 'next';
import ProtectedRoute from '@/app/_components/protected-route.component';
import EmailConfirmSend from '@/app/(public)/account/email-confirm-send/email-confirm-send.component';
import { translate } from '@/config/lang';
import { RouteAuth } from '@/config/routes';
import { cfg } from '@/config/settings';

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: await translate('email_confirm_send.meta.title', {
			app_name: cfg('app.name') as string,
		}),
		robots: 'noindex, nofollow',
	};
}

export default async function Page() {
	return (
		<section className="fit-container">
			<ProtectedRoute routeAuth={RouteAuth.UNAUTHENTICATED}>
				<div className="standard-box p-4 sm:p-8 shadow-md md:w-[22rem]">
					<EmailConfirmSend />
				</div>
			</ProtectedRoute>
		</section>
	);
}
