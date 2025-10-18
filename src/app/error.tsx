'use client';

import { useEffect } from 'react';
import { Notice } from '@/components/notice.component';

export default function Error({
	error,
	reset,
}: {
	error: Error;
	reset: () => void;
}) {
	useEffect(() => {
		console.error('Error:', error);
	}, [error]);

	return (
		<Notice type="error" message={error.message}>
			<div className="mt-4">
				<button className="btn btn-error" onClick={() => reset()}>
					Try Again
				</button>
			</div>
		</Notice>
	);
}
