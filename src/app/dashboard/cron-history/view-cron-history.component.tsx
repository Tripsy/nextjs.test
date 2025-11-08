import { useStore } from 'zustand/react';
import { useDataTable } from '@/app/dashboard/_providers/data-table-provider';
import { parseJson } from '@/lib/utils/string';
import {DisplayStatus} from "@/app/dashboard/_components/data-table-value";

export function ViewCronHistory() {
	const { modelStore } = useDataTable<'cron_history'>();
	const actionEntry = useStore(modelStore, (state) => state.actionEntry);

	if (!actionEntry) {
		return <div className="text-center p-6">No log entry selected.</div>;
	}

	const {
		id,
		label,
		start_at,
		end_at,
		status,
		run_time,
		content
	} = actionEntry;

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
						{new Date(start_at).toLocaleString()}
					</div>
					<div>
						<span className="font-semibold">End At:</span>{' '}
						{new Date(end_at).toLocaleString()}
					</div>
					<div className="flex items-center gap-2">
						<span className="font-semibold">Status:</span>{' '}
						<div className="max-w-[240px]">
							<DisplayStatus status={status} />
						</div>
					</div>
					<div>
						<span className="font-semibold">Run Time:</span> {run_time} second(s)
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
								<span className="font-semibold capitalize">{key}:</span>{' '}
								{typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
							</p>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
