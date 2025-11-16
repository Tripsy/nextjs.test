import { useMemo } from 'react';
import { getActionIcon, Icons } from '@/components/icon.component';
import type { DataSourceType } from '@/config/data-source';
import { useTranslation } from '@/hooks/use-translation.hook';

export function DataTableActionButton({
	dataSource,
	actionName,
	className,
	handleClick,
	disabled = false,
}: {
	dataSource: keyof DataSourceType;
	actionName: string;
	className?: string;
	handleClick: () => void;
	disabled?: boolean;
}) {
	const actionTitleKey = `${dataSource}.action.${actionName}.title`;
	const actionLabelKey = `${dataSource}.action.${actionName}.label`;

	const translationsKeys = useMemo(
		() => [actionTitleKey, actionLabelKey],
		[actionLabelKey, actionTitleKey],
	);

	const { translations } = useTranslation(translationsKeys);

	const ActionIcon = getActionIcon(actionName);

	return (
		<button
			type="button"
			className={className || 'btn'}
			title={translations[actionTitleKey]}
			onClick={handleClick}
			disabled={disabled}
		>
			{disabled ? (
				<>
					<Icons.Loading className="w-4 h-4 animate-spin" />
					Please wait...
				</>
			) : (
				<>
					<ActionIcon />
					{translations[actionLabelKey]}
				</>
			)}
		</button>
	);
}
