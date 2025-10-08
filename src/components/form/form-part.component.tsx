import React, {JSX} from 'react';
import clsx from 'clsx';

export const FormPart = ({
   children,
   className
}: {
    children: JSX.Element,
    className?: string
}): JSX.Element | null => (
    <div className={clsx('form-part', className)}>
        {children}
    </div>
);
