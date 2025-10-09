// components/_components/delete-confirm-dialog.component.tsx
'use client';

import React from 'react';
import { useUserStore } from '@/app/dashboard/_stores/user.store';

export function DeleteConfirmDialog() {
    const {
        isOperationOpen,
        selectedUsers,
        closeDeleteDialog,
        deleteUsers,
        isLoading,
    } = useUserStore();

    if (!isOperationOpen) return null;

    const handleDelete = async () => {
        try {
            await deleteUsers(selectedUsers.map(user => user.id));
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                <p className="mb-6">
                    Are you sure you want to delete {selectedUsers.length} user(s)?
                    This action cannot be undone.
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={closeDeleteDialog}
                        className="btn btn-secondary"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        className="btn btn-delete"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}