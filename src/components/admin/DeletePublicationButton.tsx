'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { deletePublicationAction } from '@/app/admin/actions';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

interface DeletePublicationButtonProps {
    publicationId: string;
    publicationTitle: string;
}

export function DeletePublicationButton({
    publicationId,
    publicationTitle,
}: DeletePublicationButtonProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleDelete = async () => {
        setLoading(true);
        setError(null);
        const res = await deletePublicationAction(publicationId);
        setLoading(false);

        if (res.error) {
            setError(res.error);
            return;
        }

        setOpen(false);
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
                title="Delete Publication"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-mono transition-colors"
            >
                <Trash2 size={13} />
                <span>Delete</span>
            </button>

            <ConfirmDialog
                isOpen={open}
                title={`Delete "${publicationTitle}"?`}
                description={
                    error
                        ? `Error: ${error}`
                        : 'This action permanently removes this publication and cannot be undone.'
                }
                onConfirm={handleDelete}
                onCancel={() => setOpen(false)}
                loading={loading}
            />
        </>
    );
}