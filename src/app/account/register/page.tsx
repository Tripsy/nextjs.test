import type { Metadata } from 'next';
import Register from '@/app/account/register/register.component';
import ProtectedRoute from '@/components/protected-route.component';
import { lang } from '@/config/lang';
import { RouteAuth } from '@/config/routes';

export const metadata: Metadata = {
	title: lang('register.meta.title'),
};

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
