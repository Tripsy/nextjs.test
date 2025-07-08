'use client';

import React, {useEffect} from 'react';
import {Icons} from '@/components/icon.component';

export default function Error({error, reset}: { error: Error; reset: () => void }) {
    useEffect(() => {
        // TODO: log error
        console.error('Error in dashboard:', error);
    }, [error]);

    return (
        <div className="card bg-base-100 shadow-lg m-4 sm:m-6 lg:m-8">
            <div className="card-body">
                <h2 className="card-title">
                    <Icons.Error className="w-5 h-5 text-error"/>
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
