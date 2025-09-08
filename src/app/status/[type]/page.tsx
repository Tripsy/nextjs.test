'use client';

import React from 'react';
import {Notice} from '@/components/notice.component';
import {useParams, useSearchParams} from 'next/navigation';

type ParamsType = 'error' | 'warning' | 'info' | 'success';

export default function Page() {
    const params = useParams<{ type: ParamsType }>();
    const searchParams = useSearchParams();

    const type = params.type;
    const message = searchParams.get('msg') || '';

    return (
        <div className="fit-container min-w-[22rem]">
            <Notice type={type} message={message}/>
        </div>
    );
}