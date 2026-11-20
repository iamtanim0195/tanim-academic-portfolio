'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { deleteProjectAction } from '@/app/admin/actions';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

interface DeleteProjectButtonProps {
    projectId: string;
    projectTitle: string;
    redirectAfterDelete?: boolean;
}

export function DeleteProjectButton({
    projectId,
    projectTitle,
    redirectAfterDelete = false,
}: DeleteProjectButtonProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleDelete = async () => {
        setLoading(true);
        setError(null);
        const res = await deleteProjectAction(projectId);
        setLoading(false);

        if (res.error) {
            setError(res.error);
            return;
        }

        setOpen(false);
        if (redirectAfterDelete) {
            router.push('/projects');
        }
        router.refresh();
    };

    return (
        <>
            <button
                type="button"
                onClick={() => {
                    setError(null);
                    setOpen(true);
                }}
                title="Delete Project"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-mono transition-colors"
            >
                <Trash2 size={13} />
                <span>Delete</span>
            </button>

            <ConfirmDialog
                isOpen={open}
                title={`Delete "${projectTitle}"?`}
                description={
                    error
                        ? `Error: ${error}`
                        : 'This action permanently removes the project and cannot be undone.'
                }
                onConfirm={handleDelete}
                onCancel={() => setOpen(false)}
                loading={loading}
            />
        </>
    );
}