'use client';

import { useStore } from 'zustand/react';
import { useDataTable } from '@/app/(dashboard)/_providers/data-table-provider';
import type { TemplateModel } from '@/lib/entities/template.model';
import { formatDate } from '@/lib/utils/date';
import { capitalizeFirstLetter, parseJson } from '@/lib/utils/string';

export function ViewTemplate() {
	const { modelStore } = useDataTable<'templates'>();
	const actionEntry = useStore(
		modelStore,
		(state) => state.actionEntry,
	) as TemplateModel | null;

	if (!actionEntry) {
		return <div className="text-center p-6">No template selected.</div>;
	}

	const {
		id,
		label,
		language,
		type,
		content,
		created_at,
		updated_at,
		deleted_at,
	} = actionEntry;

	const parsedContent = parseJson(content);

	return (
		<div className="space-y-6">
			<div>
				<h3 className="font-bold border-b border-line pb-2 mb-3">
					Details
				</h3>
				<div className="ml-4 space-y-1 text-sm">
					<p>
						<span className="font-semibold">ID:</span> {id}
					</p>
					<p>
						<span className="font-semibold">Label:</span> {label}
					</p>
					<p>
						<span className="font-semibold">Language:</span>{' '}
						{language}
					</p>
					<p>
						<span className="font-semibold">Type:</span>{' '}
						{capitalizeFirstLetter(type)}
					</p>
				</div>
			</div>

			<div>
				<h3 className="font-bold border-b border-line pb-2 mb-3">
					Timestamps
				</h3>
				<div className="ml-4 space-y-1 text-sm">
					<p>
						<span className="font-semibold">Created At:</span>{' '}
						{formatDate(created_at, 'date-time')}
					</p>
					<p>
						<span className="font-semibold">Updated At:</span>{' '}
						{formatDate(updated_at, 'date-time')}
					</p>
					{deleted_at && (
						<p>
							<span className="font-semibold">Deleted At:</span>{' '}
							<span className="text-red-500">
								{formatDate(deleted_at, 'date-time')}
							</span>
						</p>
					)}
				</div>
			</div>

			{parsedContent && (
				<div>
					<h3 className="font-bold border-b border-line pb-2 mb-3">
						Content
					</h3>
					<div className="ml-4 space-y-1">
						{Object.entries(parsedContent).map(([key, value]) => (
							<div key={key}>
								<span className="font-semibold capitalize">
									{key}:
								</span>{' '}
								{['body', 'html'].includes(key) ? (
									<span
										/*biome-ignore lint/security/noDangerouslySetInnerHtml: It's fine*/
										dangerouslySetInnerHTML={{
											__html: String(value),
										}}
									/>
								) : (
									<span>
										{typeof value === 'object'
											? JSON.stringify(value, null, 2)
											: String(value)}
									</span>
								)}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
