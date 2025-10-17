'use client';

import React from 'react';

export function ActionUsers() {
    // const {
    //     isActionOpen,
    //     selectedUsers,
    //     closeDeleteDialog,
    //     deleteUsers,
    //     isLoading,
    // } = useUserStore();
    //
    // if (!isActionOpen) return null;
    //
    // const handleDelete = async () => {
    //     try {
    //         await deleteUsers(selectedUsers.map(user => user.id));
    //     } catch (error) {
    //         console.error('Delete failed:', error);
    //     }
    // };

    return (
        <>
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
                {/*Are you sure you want to delete {selectedUsers.length} user(s)?*/}
                This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
                <button
                    // onClick={closeDeleteDialog}
                    // className="btn btn-secondary"
                    // disabled={isLoading}
                >
                    Cancel
                </button>
                <button
                    // onClick={handleDelete}
                    // className="btn btn-delete"
                    // disabled={isLoading}
                >
                    Something
                    {/*{isLoading ? 'Deleting...' : 'Delete'}*/}
                </button>
            </div>
        </>
    );
}