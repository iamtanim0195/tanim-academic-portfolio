'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

export function ConfirmDialog({
    isOpen,
    title,
    description,
    onConfirm,
    onCancel,
    loading = false,
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-surface border border-border-subtle rounded-xl p-6 space-y-4 shadow-2xl">
                <div className="flex items-center gap-3 text-red-400">
                    <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <AlertTriangle size={20} />
                    </div>
                    <h3 className="text-base font-bold text-primary-text">{title}</h3>
                </div>

                <p className="text-xs text-secondary-text leading-relaxed">{description}</p>

                <div className="flex items-center justify-end gap-3 pt-2">
                    <Button variant="outline" size="sm" onClick={onCancel} disabled={loading}>
                        Cancel
                    </Button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Deleting...' : 'Confirm Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}