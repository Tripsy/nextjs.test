import React, {JSX} from 'react';
import clsx from 'clsx';

export const FormElement = ({
    children,
    labelText,
    labelFor,
    className
}: {
    children: JSX.Element,
    className?: string,
    labelText?: string
    labelFor?: string
}): JSX.Element | null => (
    <div className={clsx('form-element', className)}>
        {labelText && (
            <label htmlFor={labelFor}>{labelText}</label>
        )}
        {children}
    </div>
);
