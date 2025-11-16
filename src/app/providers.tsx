import { headers } from 'next/headers';
import type React from 'react';
import { AuthProvider } from '@/app/_providers/auth.provider';
import { PrimeProvider } from '@/app/_providers/prime.provider';
import { ThemeProvider } from '@/app/_providers/theme.provider';
import { ToastProvider } from '@/app/_providers/toast.provider';
import type { AuthModel } from '@/lib/entities/auth.model';

export async function Providers({ children }: { children: React.ReactNode }) {
	const headersList = await headers();
	const authHeader = headersList.get('x-auth-data');

	let initAuth: AuthModel = null;

	try {
		initAuth = authHeader ? JSON.parse(authHeader) : null;
	} catch (error: unknown) {
		console.error('Failed to parse auth header', error);
	}

	return (
		<ThemeProvider>
			<PrimeProvider>
				<ToastProvider>
					<AuthProvider initAuth={initAuth}>{children}</AuthProvider>
				</ToastProvider>
			</PrimeProvider>
		</ThemeProvider>
	);
}
