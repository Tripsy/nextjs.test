import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type {
	TemplateContentPageType,
	TemplateLayoutPageEnum,
	TemplateModel,
} from '@/lib/entities/template.model';
import {
	ApiRequest,
	getResponseData,
	type ResponseFetch,
} from '@/lib/utils/api';
import { formatDate } from '@/lib/utils/date';

interface Props {
	params: Promise<{
		label: string;
	}>;
}

async function getPageData(label: string): Promise<{
	title: string;
	content: string;
	layout: TemplateLayoutPageEnum;
	updated_at: string | Date;
} | null> {
	try {
		const fetchResponse: ResponseFetch<TemplateModel> | undefined =
			await new ApiRequest()
				.setRequestMode('remote-api')
				.doFetch(`/templates/${label}/page`, {
					method: 'GET',
					next: { revalidate: 3600 },
				});

		if (fetchResponse?.success) {
			const responseData = getResponseData(fetchResponse);

			if (responseData) {
				const content =
					responseData.content as unknown as TemplateContentPageType;

				return {
					title: content.title,
					content: content.body,
					layout: content.layout,
					updated_at: responseData.updated_at,
				};
			}
		}

		return null;
	} catch {
		return null;
	}
}

export async function generateMetadata(props: Props): Promise<Metadata> {
	const { params } = props;

	const resolvedParams = await params;
	const label = resolvedParams.label;

	const pageData = await getPageData(label);

	if (!pageData) {
		return {
			title: 'Page Not Found',
		};
	}

	return {
		title: pageData.title,
	};
}

export default async function Page(props: Props) {
	const { params } = props;

	const resolvedParams = await params;
	const label = resolvedParams.label;

	const pageData = await getPageData(label);

	if (!pageData) {
		notFound();
	}

	return (
		<div className="default-container">
			<h1 className="text-xl font-semibold mb-4">{pageData.title}</h1>

			<div
				className="mb-4"
				/*biome-ignore lint/security/noDangerouslySetInnerHtml: It's fine*/
				dangerouslySetInnerHTML={{ __html: pageData.content }}
			/>
			<div className="text-sm italic text-right">
				Last update: {formatDate(pageData.updated_at, 'date-time')}
			</div>
		</div>
	);
}
