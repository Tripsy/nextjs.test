import { useStore } from 'zustand/react';
import { useDataTable } from '@/app/(dashboard)/_providers/data-table-provider';
import {formatDate} from "@/lib/utils/date";
import {DisplayStatus} from "@/app/(dashboard)/_components/data-table-value";

export function ViewMailQueue() {
	const { modelStore } = useDataTable<'mail_queue'>();
	const actionEntry = useStore(modelStore, (state) => state.actionEntry);

	if (!actionEntry) {
		return <div className="text-center p-6">No entry selected.</div>;
	}

	const {
		id,
		template,
		language,
		content,
		to,
		from,
		status,
		error,
		sent_at,
		created_at,
		updated_at
	} = actionEntry;

	return (
		<div className="space-y-6">
			<div>
				<h3 className="font-bold border-b border-line pb-2 mb-3">
					Details
				</h3>
				<div className="ml-4 space-y-1">
					<p>
						<span className="font-semibold">ID:</span> {id}
					</p>
					<p>
						<span className="font-semibold">Template:</span> {template?.label || 'n/a'}
					</p>
					<p>
						<span className="font-semibold">Language:</span> {language}
					</p>
					<p>
						<span className="font-semibold">Created At:</span>{' '}
						{formatDate(created_at, 'date-time')}
					</p>
					<p>
						<span className="font-semibold">Updated At:</span>{' '}
						{formatDate(updated_at, 'date-time') || '-'}
					</p>
				</div>
			</div>

			<div>
				<h3 className="font-bold border-b border-line pb-2 mb-3">
					Status
				</h3>
				<div className="ml-4 space-y-1">
					<div className="flex items-center gap-2">
						<span className="font-semibold">Status:</span>{' '}
						<div className="max-w-[240px]">
							<DisplayStatus status={status} />
						</div>
					</div>
					<p>
						<span className="font-semibold">Error:</span> {error || '-'}
					</p>
					<p>
						<span className="font-semibold">Sent At:</span>{' '}
						{formatDate(sent_at, 'date-time') || '-'}
					</p>
					<p>
						<span className="font-semibold">Sent To:</span>{' '}
						{to.name} &lt;{to.address}&gt;
					</p>
					{from &&
						<p>
							<span className="font-semibold">Sent From:</span>{' '}
							{from?.name} &lt;{from?.address}&gt;
						</p>
					}
				</div>
			</div>

			<div>
				<h3 className="font-bold border-b border-line pb-2 mb-3">
					Content
				</h3>
				<div className="ml-4 space-y-1">
					<p>
						<span className="font-semibold">Layout:</span>{' '}
						{content.layout}
					</p>
					<p>
						<span className="font-semibold">Subject:</span>{' '}
						{content.subject}
					</p>
					<p>
						<span className="font-semibold">HTML:</span>{' '}
						{content.html}
					</p>
					<p>
						<span className="font-semibold">Vars:</span>{' '}
						{/*TODO: security issues - sensitive information are displayed here*/}
						{JSON.stringify(content.vars, null, 2)}
					</p>
				</div>
			</div>
		</div>
	);
}
