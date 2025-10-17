'use client';

import React, {JSX} from 'react';
import DataTableList from '@/app/dashboard/_components/data-table-list.component';
import {DataTableFiltersUsers} from '@/app/dashboard/users/data-table-filters-users.component';
import {DataTableActions} from '@/app/dashboard/_components/data-table-actions.component';
import {DataTableProvider} from '@/app/dashboard/_providers/data-table-provider';
import {Loading} from '@/components/loading.component';
import {useMounted} from '@/hooks';
import {createModelStore} from '@/app/dashboard/_stores/model.store';
import {DataTableManage} from '@/app/dashboard/_components/data-table-manage.component';
import {ActionUsers} from '@/app/dashboard/users/action-users.component';
import {FormManageContentUsers} from '@/app/dashboard/users/form-manage-content-users.component';

const modelStore = createModelStore('users');

export const DataTableUsers = (): JSX.Element => {
    const isMounted = useMounted();

    if (!isMounted) {
        return <Loading/>;
    }

    return (
        <DataTableProvider dataSource="users" selectionMode="checkbox" modelStore={modelStore}>
            <div className="standard-box p-4 shadow-md">
                <DataTableFiltersUsers/>
                <DataTableActions/>
                <DataTableList
                    dataKey="id"
                    scrollHeight="400px"
                />
            </div>
            <DataTableManage actionComponent={ActionUsers}>
                {/* @ts-expect-error FormManageContentUsers props are injected at runtime via FormManage */}
                <FormManageContentUsers />
            </DataTableManage>
        </DataTableProvider>
    );
}