import type { Metadata } from 'next';
import Register from '@/app/account/register/register.component';
import ProtectedRoute from '@/components/protected-route.component';
import { translate } from '@/config/lang';
import { RouteAuth } from '@/config/routes';
import { cfg } from '@/config/settings';

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: await translate('register.meta.title', {
			app_name: cfg('app.name') as string,
		}),
	};
}

export default async function Page() {
	return (
		<section className="fit-container">
			<ProtectedRoute routeAuth={RouteAuth.UNAUTHENTICATED}>
				<div className="standard-box p-4 sm:p-8 shadow-md md:w-[28rem]">
					<Register />
				</div>
			</ProtectedRoute>
		</section>
	);
}
