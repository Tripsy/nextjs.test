import React from 'react';
import {Notice} from '@/components/notice.component';

type ParamsType = 'error' | 'warning' | 'info' | 'success';
type SearchParamsType = {
    msg?: string;
};

export default async function Page({
   params,
   searchParams,
}: {
    params: { type: ParamsType };
    searchParams?: SearchParamsType;
}) {
    const {type} = await params;
    const queryParams = await searchParams;

    const message = queryParams?.msg || '';

    return (
        <div className="fit-container min-w-[22rem]">
            <Notice type={type} message={message}/>
        </div>
    );
}