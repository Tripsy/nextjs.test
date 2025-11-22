import type { TemplateModel } from '@/lib/entities/template.model';
import { formatDate } from '@/lib/utils/date';
import { capitalizeFirstLetter, parseJson } from '@/lib/utils/string';

export function TemplateDetails({
	entry,
}: {
	entry: TemplateModel | undefined;
}) {
	if (!entry) {
		return (
			<div className="min-h-48 flex items-center justify-center">
				Template details are missing.
			</div>
		);
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
	} = entry;

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
								<span>
									{typeof value === 'object'
										? JSON.stringify(value, null, 2)
										: String(value)}
								</span>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
