import { useEffect, useState } from 'react';
import { translate } from '@/config/lang';

export function useTranslation(keys: string[]) {
	const [state, setState] = useState<{
		translations: Record<string, string>;
		isLoading: boolean;
	}>({
		translations: {},
		isLoading: true,
	});

	useEffect(() => {
		let isMounted = true;

		// Use an immediately invoked async function
		(async () => {
			try {
				const results = await Promise.all(
					keys.map((key) => translate(key)),
				);

				if (!isMounted) {
					return;
				}

				const translations = keys.reduce(
					(acc, key, index) => {
						acc[key] = results[index];
						return acc;
					},
					{} as Record<string, string>,
				);

				setState({
					translations: translations,
					isLoading: false,
				});
			} catch (error) {
				console.error('Failed to load translations:', error);

				if (isMounted) {
					setState((prev) => ({
						...prev,
						isLoading: false,
					}));
				}
			}
		})();

		return () => {
			isMounted = false;
		};
	}, [keys]);

	return {
		translations: state.translations,
		isTranslationLoading: state.isLoading,
	};
}
