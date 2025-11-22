import { useStore } from 'zustand/react';
import { DisplayStatus } from '@/app/(dashboard)/_components/data-table-value';
import { useDataTable } from '@/app/(dashboard)/_providers/data-table-provider';
import { formatDate } from '@/lib/utils/date';
import { parseJson } from '@/lib/utils/string';

export function ViewCronHistory() {
	const { modelStore } = useDataTable<'cron_history'>();
	const actionEntry = useStore(modelStore, (state) => state.actionEntry);

	if (!actionEntry) {
		return (
			<div className="min-h-48 flex items-center justify-center">
				No entry selected.
			</div>
		);
	}

	const { id, label, start_at, end_at, status, run_time, content } =
		actionEntry;

	const parsedContent = parseJson(content);

	return (
		<div className="space-y-6">
			<div>
				<h3 className="font-bold border-b border-line pb-2 mb-3">
					Details
				</h3>
				<div className="ml-4 space-y-1">
					<div>
						<span className="font-semibold">ID:</span> {id}
					</div>
					<div>
						<span className="font-semibold">Label:</span> {label}
					</div>
					<div>
						<span className="font-semibold">Start At:</span>{' '}
						{formatDate(start_at, 'date-time')}
					</div>
					<div>
						<span className="font-semibold">End At:</span>{' '}
						{formatDate(end_at, 'date-time') || 'n/a'}
					</div>
					<div className="flex items-center gap-2">
						<span className="font-semibold">Status:</span>{' '}
						<div className="max-w-[240px]">
							<DisplayStatus status={status} />
						</div>
					</div>
					<div>
						<span className="font-semibold">Run Time:</span>{' '}
						{run_time} second(s)
					</div>
				</div>
			</div>

			{parsedContent && (
				<div>
					<h3 className="font-bold border-b border-line pb-2 mb-3">
						Content
					</h3>
					<div className="ml-4 space-y-1">
						{Object.entries(parsedContent).map(([key, value]) => (
							<p key={key}>
								<span className="font-semibold capitalize">
									{key}:
								</span>{' '}
								{typeof value === 'object'
									? JSON.stringify(value, null, 2)
									: String(value)}
							</p>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
