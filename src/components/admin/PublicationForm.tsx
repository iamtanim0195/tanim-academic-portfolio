'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createPublicationAction, updatePublicationAction } from '@/app/admin/actions';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface PublicationFormProps {
    initialData?: {
        id: string;
        title: string;
        description?: string | null;
        paper_url?: string | null;
        authors?: string[] | null;
        venue?: string | null;
        year?: number | null;
        is_featured?: boolean;
        published?: boolean;
    };
}

export function PublicationForm({ initialData }: PublicationFormProps) {
    const isEdit = Boolean(initialData);
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        setFeedback(null);

        const formData = new FormData(e.currentTarget);

        try {
            const result =
                isEdit && initialData
                    ? await updatePublicationAction(initialData.id, formData)
                    : await createPublicationAction(formData);

            if (result?.error) {
                setFeedback({ type: 'error', message: result.error });
                setSubmitting(false);
                return;
            }

            setFeedback({
                type: 'success',
                message: isEdit
                    ? 'Publication updated successfully! Redirecting...'
                    : 'Publication created successfully! Redirecting...',
            });

            setTimeout(() => {
                router.push('/publications');
                router.refresh();
            }, 1200);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to save publication.';
            setFeedback({ type: 'error', message: msg });
            setSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-6 bg-surface border border-border-subtle rounded-xl space-y-5"
        >
            {feedback && (
                <div
                    role="alert"
                    className={`p-4 rounded-xl border text-xs font-medium flex items-center gap-2.5 ${feedback.type === 'success'
                            ? 'bg-accent/10 border-accent/40 text-accent'
                            : 'bg-red-900/20 border-red-500/40 text-red-400'
                        }`}
                >
                    {feedback.type === 'success' ? (
                        <CheckCircle2 size={18} className="shrink-0" />
                    ) : (
                        <AlertCircle size={18} className="shrink-0" />
                    )}
                    <span>{feedback.message}</span>
                </div>
            )}

            {/* Title */}
            <div className="space-y-1">
                <label className="text-xs font-mono text-secondary-text">Publication Title *</label>
                <input
                    name="title"
                    required
                    defaultValue={initialData?.title || ''}
                    placeholder="e.g. Sample-Efficient Deep Reinforcement Learning for Autonomous Navigation"
                    className="w-full px-3 py-2 bg-background border border-border-subtle rounded-lg text-sm text-primary-text focus:border-accent focus:outline-none"
                />
            </div>

            {/* Description */}
            <div className="space-y-1">
                <label className="text-xs font-mono text-secondary-text">Description / Abstract</label>
                <textarea
                    name="description"
                    rows={5}
                    defaultValue={initialData?.description || ''}
                    placeholder="Summary of the research paper, key findings, methodology, or contribution..."
                    className="w-full px-3 py-2 bg-background border border-border-subtle rounded-lg text-sm text-primary-text focus:border-accent focus:outline-none"
                />
            </div>

            {/* Link */}
            <div className="space-y-1">
                <label className="text-xs font-mono text-secondary-text">Publication Link (Paper / DOI / ArXiv / PDF URL)</label>
                <input
                    name="paperUrl"
                    type="url"
                    defaultValue={initialData?.paper_url || ''}
                    placeholder="https://arxiv.org/abs/... or https://doi.org/..."
                    className="w-full px-3 py-2 bg-background border border-border-subtle rounded-lg text-sm text-primary-text focus:border-accent focus:outline-none"
                />
            </div>

            {/* Optional Academic Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-border-subtle">
                <div className="space-y-1">
                    <label className="text-xs font-mono text-secondary-text">Authors (Optional)</label>
                    <input
                        name="authors"
                        defaultValue={(initialData?.authors || []).join(', ')}
                        placeholder="A. Researcher, B. Supervisor"
                        className="w-full px-3 py-2 bg-background border border-border-subtle rounded-lg text-sm text-primary-text focus:border-accent focus:outline-none"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-mono text-secondary-text">Venue / Journal (Optional)</label>
                    <input
                        name="venue"
                        defaultValue={initialData?.venue || ''}
                        placeholder="e.g. IEEE ICRA / NeurIPS"
                        className="w-full px-3 py-2 bg-background border border-border-subtle rounded-lg text-sm text-primary-text focus:border-accent focus:outline-none"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-mono text-secondary-text">Year (Optional)</label>
                    <input
                        name="year"
                        type="number"
                        min="2000"
                        max="2035"
                        defaultValue={initialData?.year || ''}
                        placeholder="2026"
                        className="w-full px-3 py-2 bg-background border border-border-subtle rounded-lg text-sm text-primary-text focus:border-accent focus:outline-none"
                    />
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs text-primary-text cursor-pointer">
                    <input
                        type="checkbox"
                        name="isFeatured"
                        defaultChecked={initialData?.is_featured ?? false}
                        className="accent-[#C4F269]"
                    />
                    <span>Feature on Homepage</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-primary-text cursor-pointer">
                    <input
                        type="checkbox"
                        name="published"
                        defaultChecked={initialData?.published ?? true}
                        className="accent-[#C4F269]"
                    />
                    <span>Published</span>
                </label>
            </div>

            <div className="flex items-center gap-3 pt-2">
                <Button type="submit" variant="accent" size="md" disabled={submitting}>
                    {submitting
                        ? isEdit
                            ? 'Saving Changes...'
                            : 'Adding Publication...'
                        : isEdit
                            ? 'Save Changes'
                            : 'Add Publication'}
                </Button>
                <Link href="/publications">
                    <Button type="button" variant="outline" size="md">
                        Cancel
                    </Button>
                </Link>
            </div>
        </form>
    );
}