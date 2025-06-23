import {JSX} from 'react';

export const FormFieldError = ({
   messages,
   className = 'form-tooltip-error'
}: {
    messages?: string[],
    className?: string
}): JSX.Element | null => (
    messages?.length ? (
        <div className={className}>
            {messages.length === 1 ? messages[0] : (
                <ul>
                    {messages.map(msg => <li key={msg}>- {msg}</li>)}
                </ul>
            )}
        </div>
    ) : null
);
