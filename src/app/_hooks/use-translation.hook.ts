import { useEffect, useState } from 'react';
import { translate } from '@/config/lang';

export function useTranslation<T extends readonly string[]>(keys: T) {
	type TranslationMap = {
		[K in T[number]]: string;
	};

	const [translations, setTranslations] = useState<TranslationMap>(
		{} as TranslationMap,
	);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let isMounted = true;

		(async () => {
			try {
				const results = await Promise.all(
					keys.map((key) => translate(key)),
				);

				if (!isMounted) {
					return;
				}

				const newTranslations = {} as TranslationMap;

				keys.forEach((key, index) => {
					(newTranslations as Record<string, string>)[key] =
						results[index];
				});

				setTranslations(newTranslations);
				setIsLoading(false);
			} catch (error) {
				console.error('Failed to load translations:', error);
				if (isMounted) setIsLoading(false);
			}
		})();

		return () => {
			isMounted = false;
		};
	}, [keys]);

	return {
		translations,
		isTranslationLoading: isLoading,
	};
}
