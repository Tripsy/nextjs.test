import type { Metadata } from 'next';
import PasswordRecover from '@/app/(public)/account/password-recover/password-recover.component';
import { translate } from '@/config/lang';
import { cfg } from '@/config/settings';
import ProtectedRoute from "@/app/_components/protected-route.component";
import {RouteAuth} from "@/config/routes";

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: await translate('password_recover.meta.title', {
			app_name: cfg('app.name') as string,
		}),
	};
}

export default async function Page() {
	return (
		<section className="fit-container">
			<ProtectedRoute routeAuth={RouteAuth.UNAUTHENTICATED}>
				<div className="standard-box p-4 sm:p-8 shadow-md md:w-[22rem]">
					<PasswordRecover />
				</div>
			</ProtectedRoute>
		</section>
	);
}
