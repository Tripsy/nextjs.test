'use client';

import React, {useEffect} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';

export default function Error({error, reset}: { error: Error; reset: () => void }) {
    useEffect(() => {
        console.error('Error in dashboard:', error);
    }, [error]);

    return (
        <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
                <h2 className="card-title">
                    <FontAwesomeIcon icon={faTriangleExclamation} className="w-5 h-5 text-error"/>
                    Something went wrong!
                </h2>
                <p>
                    {error.message}
                </p>
                <div className="card-actions justify-end">
                    <button
                        className="btn btn-error" onClick={() => reset()}>
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    );
}
