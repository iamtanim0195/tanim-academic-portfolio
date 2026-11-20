'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createFeedPostAction } from '@/app/feed/actions';
import { MediaSourceInput } from '@/components/admin/MediaSourceInput';
import { Button } from '@/components/ui/Button';
import { Send, ImagePlus, CheckCircle2, AlertCircle } from 'lucide-react';

export function FeedPostComposer() {
    const router = useRouter();
    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        setFeedback(null);

        const form = e.currentTarget;
        const formData = new FormData(form);

        const res = await createFeedPostAction(formData);
        setSubmitting(false);

        if (res?.error) {
            setFeedback({ type: 'error', message: res.error });
            return;
        }

        form.reset();
        setShowMediaPicker(false);
        setFeedback({ type: 'success', message: 'Post published to your feed!' });
        router.refresh();
        setTimeout(() => setFeedback(null), 3000);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-5 bg-surface border border-border-subtle rounded-2xl space-y-4 shadow-lg"
        >
            <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-accent uppercase tracking-wider">
          // Create New Feed Post
                </span>
                <label className="flex items-center gap-1.5 text-xs text-secondary-text cursor-pointer">
                    <input
                        type="checkbox"
                        name="published"
                        defaultChecked
                        className="accent-[#C4F269]"
                    />
                    <span>Public</span>
                </label>
            </div>

            {feedback && (
                <div
                    className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${feedback.type === 'success'
                            ? 'bg-accent/10 border-accent/40 text-accent'
                            : 'bg-red-900/20 border-red-500/40 text-red-400'
                        }`}
                >
                    {feedback.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                    <span>{feedback.message}</span>
                </div>
            )}

            <textarea
                name="caption"
                rows={3}
                required
                placeholder="Share a research milestone, lab photo, paper reading note, or project update..."
                className="w-full px-3.5 py-2.5 bg-background border border-border-subtle rounded-xl text-sm text-primary-text placeholder:text-secondary-text/70 focus:border-accent focus:outline-none resize-none"
            />

            {showMediaPicker && (
                <MediaSourceInput
                    name="imageUrl"
                    label="Post Photo (Upload Image, External Link, or None)"
                />
            )}

            <div className="flex items-center justify-between pt-1 border-t border-border-subtle">
                <button
                    type="button"
                    onClick={() => setShowMediaPicker((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-secondary-text hover:text-accent hover:bg-background transition-colors"
                >
                    <ImagePlus size={15} className="text-accent" />
                    <span>{showMediaPicker ? 'Hide Photo' : 'Add Photo (Upload / Link)'}</span>
                </button>

                <Button type="submit" variant="accent" size="sm" disabled={submitting} className="gap-1.5">
                    <Send size={13} />
                    <span>{submitting ? 'Posting...' : 'Post'}</span>
                </Button>
            </div>
        </form>
    );
}