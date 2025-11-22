import { DisplayStatus } from '@/app/(dashboard)/_components/data-table-value';
import type { UserModel } from '@/lib/entities/user.model';
import { formatDate } from '@/lib/utils/date';
import { capitalizeFirstLetter } from '@/lib/utils/string';

export function UserDetails({ entry }: { entry: UserModel | undefined }) {
	if (!entry) {
		return (
			<div className="min-h-48 flex items-center justify-center">
				User details are missing.
			</div>
		);
	}

	const {
		id,
		name,
		email,
		role,
		status,
		language,
		created_at,
		updated_at,
		deleted_at,
	} = entry;

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
						<span className="font-semibold">Name:</span> {name}
					</p>
					<p>
						<span className="font-semibold">Email:</span> {email}
					</p>
					<p>
						<span className="font-semibold">Language:</span>{' '}
						{language}
					</p>
				</div>
			</div>

			<div>
				<h3 className="font-bold border-b border-line pb-2 mb-3">
					Account Info
				</h3>
				<div className="ml-4 space-y-1 text-sm">
					<div>
						<span className="font-semibold">Role:</span>{' '}
						{capitalizeFirstLetter(role)}
					</div>
					<div className="flex items-center gap-2">
						<span className="font-semibold">Status:</span>{' '}
						<div className="max-w-[240px]">
							<DisplayStatus status={status} />
						</div>
					</div>
					{deleted_at && (
						<div>
							<span className="font-semibold">Deleted At:</span>{' '}
							<span className="text-red-500">
								{formatDate(deleted_at, 'date-time')}
							</span>
						</div>
					)}
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
						{formatDate(updated_at, 'date-time') || '-'}
					</p>
				</div>
			</div>
		</div>
	);
}
