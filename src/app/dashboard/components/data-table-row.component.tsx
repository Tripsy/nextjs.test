import {Icons} from '@/components/icon.component';
import ValueError from '@/lib/exceptions/value.error';
import {formatDate} from '@/lib/utils/date';

const statusList = {
    active: {
        label: 'Active',
        class: "badge badge-success h-8",
        icon: <Icons.Status.Active/>,
    },
    pending: {
        label: 'Pending',
        class: "badge badge-warning h-8",
        icon: <Icons.Status.Pending/>,
    },
    inactive: {
        label: 'Inactive',
        class: "badge badge-error h-8",
        icon: <Icons.Status.Inactive/>,
    },
    deleted: {
        label: 'Deleted',
        class: "badge badge-neutral h-8",
        icon: <Icons.Status.Deleted/>,
    },
};

export type StatusKey = keyof typeof statusList;

export function TableRowStatus({status}: { status: StatusKey }) {
    if (!(status in statusList)) {
        throw new ValueError(`Invalid status: ${status}`);
    }

    const current = statusList[status as StatusKey];

    return (
        <div className={`${current.class} w-full text-white dark:text-black`}>
            {current.icon}
            {current.label}
        </div>
    );
}

export function TableRowDate({date}: { date: Date | string }) {
    return <span>{date ? formatDate(date) : '-'}</span>;
}