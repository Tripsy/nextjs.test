import React, {JSX} from 'react';

export const FormResult = ({
    children,
    title
}: {
    children: JSX.Element,
    title: string
}): JSX.Element | null => (
    <div className="form-result">
        <h1>
            {title}
        </h1>
        <div className="form-result-content">
            {children}
        </div>
    </div>
);
