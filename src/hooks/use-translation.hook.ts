import { useEffect, useState } from 'react';
import { translate } from '@/config/lang';

export function useTranslation(keys: string[]) {
	const [translations, setTranslations] = useState<Record<string, string>>(
		{},
	);
	const [isTranslationLoading, setIsTranslationLoading] = useState(true);

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

				const translationMap = keys.reduce(
					(acc, key, index) => {
						acc[key] = results[index];
						return acc;
					},
					{} as Record<string, string>,
				);

				setTranslations(translationMap);
			} catch (error) {
				console.error('Failed to load translations:', error);
			} finally {
				if (isMounted) {
					setIsTranslationLoading(false);
				}
			}
		})();

		return () => {
			isMounted = false;
		};
	}, [keys]);

	return { translations, isTranslationLoading };
}
