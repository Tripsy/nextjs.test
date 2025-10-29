import { useStore } from 'zustand/react';
import { useDataTable } from '@/app/dashboard/_providers/data-table-provider';
import { parseJson } from '@/lib/utils/string';

export function ViewLogData() {
	const { modelStore } = useDataTable<'log_data'>();
	const actionEntry = useStore(modelStore, (state) => state.actionEntry);

	if (!actionEntry) {
		return <div className="text-center p-6">No log entry selected.</div>;
	}

	const {
		id,
		pid,
		category,
		level,
		message,
		context,
		debugStack,
		created_at,
	} = actionEntry;

	const parsedContext = parseJson(context);
	const parsedDebugStack = parseJson(debugStack);

	return (
		<>
			<div>
				<h3 className="font-bold border-b border-line pb-2 mb-2">
					Details
				</h3>
				<div className="ml-4 space-y-1">
					<p>
						<span className="font-semibold">ID:</span> {id}
					</p>
					<p>
						<span className="font-semibold">PID:</span> {pid}
					</p>
					<p>
						<span className="font-semibold">Category:</span>{' '}
						{category}
					</p>
					<p>
						<span className="font-semibold">Level:</span> {level}
					</p>
					<p>
						<span className="font-semibold">Message:</span>{' '}
						{message}
					</p>
					<p>
						<span className="font-semibold">Created At:</span>{' '}
						{new Date(created_at).toLocaleString()}
					</p>
				</div>
			</div>

			{parsedContext?.request && (
				<div className="mt-6">
					<h3 className="font-bold border-b border-line pb-2 mb-2">
						Request Context
					</h3>
					<div className="ml-4 space-y-1">
						<p>
							<span className="font-semibold">Method:</span>{' '}
							{parsedContext.request.method}
						</p>
						<p>
							<span className="font-semibold">URL:</span>{' '}
							{decodeURI(parsedContext.request.url)}
						</p>
						<p>
							<span className="font-semibold">Body:</span>{' '}
							{JSON.stringify(parsedContext.request.body)}
						</p>
						<p>
							<span className="font-semibold">Params:</span>{' '}
							{JSON.stringify(parsedContext.request.params)}
						</p>
						<p>
							<span className="font-semibold">Query:</span>{' '}
							{JSON.stringify(parsedContext.request.query)}
						</p>
					</div>
				</div>
			)}

			{parsedDebugStack && (
				<div className="mt-6">
					<h3 className="font-bold border-b border-line pb-2 mb-2">
						Debug Stack
					</h3>
					<div className="ml-4 space-y-1">
						<p>
							<span className="font-semibold">File:</span>{' '}
							{parsedDebugStack.file}
						</p>
						<p>
							<span className="font-semibold">Line:</span>{' '}
							{parsedDebugStack.line}
						</p>
						<p>
							<span className="font-semibold">Function:</span>{' '}
							{parsedDebugStack.function}
						</p>
						{parsedDebugStack.trace && (
							<div>
								<span className="font-semibold">Trace:</span>
								<pre className="bg-gray-50 border rounded p-2 text-xs mt-1 overflow-x-auto">
									{parsedDebugStack.trace.join('\n')}
								</pre>
							</div>
						)}
					</div>
				</div>
			)}
		</>
	);
}
