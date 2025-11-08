import { cfg, isSupportedLanguage } from '@/config/settings';
import { ApiRequest } from '@/lib/utils/api';
import { getObjectValue, replaceVars } from '@/lib/utils/string';

type TranslationValue = string | { [key: string]: TranslationValue };
type TranslationResource = Record<string, TranslationValue>;

let languageSelected: string | null = null;
const languageResources: Record<string, TranslationResource> = {};

async function fetchLanguage() {
	try {
		const result = await new ApiRequest()
			.setRequestMode('same-site')
			.setRequestInit({
				credentials: 'same-origin',
			})
			.doFetch<{ language: string }>('language', {
				method: 'GET',
			});

		return result?.data?.language || (cfg('app.language') as string);
	} catch (error) {
		console.error('Failed to fetch language:', error);

		return cfg('app.language') as string;
	}
}

export async function getLanguage(): Promise<string> {
	if (languageSelected) {
		return languageSelected;
	}

	if (typeof document === 'undefined') {
		languageSelected = await fetchLanguage();
	} else {
		languageSelected =
			document.documentElement.lang || navigator.language?.split('-')[0];
		languageSelected = languageSelected.toLowerCase();
	}

	if (languageSelected && isSupportedLanguage(languageSelected)) {
		return languageSelected;
	}

	return cfg('app.language') as string;
}

export function setLanguage(lang: string) {
	if (isSupportedLanguage(lang)) {
		languageSelected = lang;
	}
}

async function loadLanguageResource(
	language: string,
): Promise<TranslationResource> {
	if (languageResources[language]) {
		return languageResources[language];
	}

	languageResources[language] = (
		await import(`@/locales/${language}`)
	).default;

	return languageResources[language];
}

/**
 * Utility function used to get the translated string from the resource.
 * Always returns `string` (Note: if returned object value is not string, it returns the key)
 */
export const getTranslatedString = (
	resource: TranslationResource,
	key: string,
) => {
	const objectValue = getObjectValue(resource, key);

	return typeof objectValue === 'string' ? objectValue : key;
};

/**
 * Translate a key with optional replacements.
 * The key should be in the format `namespace.key`.
 */
export const translate = async (
	key: string,
	replacements: Record<string, string> = {},
): Promise<string> => {
	const languageSelected = await getLanguage();
	const languageResource = await loadLanguageResource(languageSelected);

	const value = getTranslatedString(languageResource, key);

	if (value !== key && replacements) {
		return replaceVars(value, replacements);
	}

	return value;
};

/**
 * Translate multiple keys with optional replacements.
 *
 * @example translateBatch([
 *     { key: "user.create" },
 *     { key: "user.edit", vars: { "user.id": 1 } },
 *     { key: "user.delete" }
 * ])
 */
export const translateBatch = async (
	requests: (
		| string
		| {
				key: string;
				vars?: Record<string, string>;
		  }
	)[],
): Promise<Record<string, string>> => {
	const language = await getLanguage();
	const resource = await loadLanguageResource(language);

	const result: Record<string, string> = {};

	for (const request of requests) {
		if (typeof request === 'string') {
			result[request] = getTranslatedString(resource, request);
		} else {
			const value = getTranslatedString(resource, request.key);

			if (request.vars) {
				result[request.key] = replaceVars(value, request.vars);
			} else {
				result[request.key] = value;
			}
		}
	}

	return result;
};
