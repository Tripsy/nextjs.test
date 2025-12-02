import { useEffect, useMemo, useState } from 'react';
import { useStore } from 'zustand/react';
import { Loading } from '@/app/_components/loading.component';
import { useTranslation } from '@/app/_hooks';
import { useToast } from '@/app/_providers/toast.provider';
import { useDataTable } from '@/app/(dashboard)/_providers/data-table-provider';
import { TemplateDetails } from '@/app/(dashboard)/dashboard/templates/template-details.component';
import type { TemplateModel } from '@/lib/entities/template.model';
import { getTemplate } from '@/lib/services/templates.service';

export function ViewMailQueueTemplate() {
	const { showToast } = useToast();

	const { modelStore } = useDataTable<'mail_queue'>();
	const actionEntry = useStore(modelStore, (state) => state.actionEntry);

	const translationsKeys = useMemo(
		() => ['app.text.error_title', 'dashboard.text.no_entry_selected'],
		[],
	);

	const { translations } = useTranslation(translationsKeys);

	const [template, setTemplate] = useState<TemplateModel | undefined>(
		undefined,
	);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!actionEntry) {
			return;
		}

		(async () => {
			if (!actionEntry?.template?.id) {
				return;
			}

			try {
				const template = await getTemplate(actionEntry.template.id);

				setTemplate(template);
			} catch (error) {
				showToast({
					severity: 'error',
					summary: translations['app.text.error_title'],
					detail: (error as Error).message,
				});
			} finally {
				setLoading(false);
			}
		})();
	}, [actionEntry, showToast, translations]);

	if (!actionEntry) {
		return (
			<div className="min-h-48 flex items-center justify-center">
				{translations['dashboard.text.no_entry_selected']}
			</div>
		);
	}

	if (loading) {
		return (
			<Loading className="min-h-64 flex items-center justify-center" />
		);
	}

	return <TemplateDetails entry={template} />;
}
