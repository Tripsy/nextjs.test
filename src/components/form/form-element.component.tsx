import clsx from 'clsx';
import type { JSX } from 'react';

export const FormElement = ({
	children,
	labelText,
	labelFor,
	className,
}: {
	children: JSX.Element;
	className?: string;
	labelText?: string;
	labelFor?: string;
}): JSX.Element | null => (
	<div className={clsx('form-element', className)}>
		{labelText && <label htmlFor={labelFor}>{labelText}</label>}
		{children}
	</div>
);
