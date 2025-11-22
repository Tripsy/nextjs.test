'use client';

import { useStore } from 'zustand/react';
import { useDataTable } from '@/app/(dashboard)/_providers/data-table-provider';
import { TemplateDetails } from '@/app/(dashboard)/dashboard/templates/template-details.component';

export function ViewTemplate() {
	const { modelStore } = useDataTable<'templates'>();
	const actionEntry = useStore(modelStore, (state) => state.actionEntry);

	if (!actionEntry) {
		return (
			<div className="min-h-48 flex items-center justify-center">
				No entry selected.
			</div>
		);
	}

	return <TemplateDetails entry={actionEntry} />;
}
