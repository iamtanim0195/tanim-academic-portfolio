'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createProjectAction, updateProjectAction } from '@/app/admin/actions';
import { MediaSourceInput } from '@/components/admin/MediaSourceInput';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ProjectFormProps {
    initialData?: {
        id: string;
        title: string;
        slug: string;
        summary: string;
        description?: string | null;
        image_url?: string | null;
        extra_image_url?: string | null;
        video_url?: string | null;
        github_url?: string | null;
        demo_url?: string | null;
        technologies?: string[] | null;
        is_featured?: boolean;
        published?: boolean;
    };
}

export function ProjectForm({ initialData }: ProjectFormProps) {
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
            const result = isEdit && initialData
                ? await updateProjectAction(initialData.id, formData)
                : await createProjectAction(formData);

            if (result?.error) {
                setFeedback({ type: 'error', message: result.error });
                setSubmitting(false);
                return;
            }

            setFeedback({
                type: 'success',
                message: isEdit
                    ? 'Project updated successfully! Redirecting...'
                    : 'Project created successfully! Redirecting...',
            });

            setTimeout(() => {
                router.push('/projects');
                router.refresh();
            }, 1200);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Something went wrong while saving.';
            setFeedback({ type: 'error', message: msg });
            setSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-6 bg-surface border border-border-subtle rounded-xl space-y-5"
        >
            {/* Notification Banner */}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-mono text-secondary-text">Project Title *</label>
                    <input
                        name="title"
                        required
                        defaultValue={initialData?.title || ''}
                        placeholder="e.g. Vision-Guided Robotic Arm"
                        className="w-full px-3 py-2 bg-background border border-border-subtle rounded-lg text-sm text-primary-text focus:border-accent focus:outline-none"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-mono text-secondary-text">
                        URL Slug * <span className="text-[10px] text-secondary-text">(lowercase & hyphens only)</span>
                    </label>
                    <input
                        name="slug"
                        required
                        pattern="[a-z0-9-]+"
                        title="Only lowercase letters, numbers, and hyphens allowed"
                        defaultValue={initialData?.slug || ''}
                        placeholder="e.g. vision-guided-robotic-arm"
                        className="w-full px-3 py-2 bg-background border border-border-subtle rounded-lg text-sm text-primary-text focus:border-accent focus:outline-none"
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-mono text-secondary-text">Short Summary (Card Preview) *</label>
                <textarea
                    name="summary"
                    rows={2}
                    required
                    defaultValue={initialData?.summary || ''}
                    placeholder="1–2 sentences summarizing the project for the card grid..."
                    className="w-full px-3 py-2 bg-background border border-border-subtle rounded-lg text-sm text-primary-text focus:border-accent focus:outline-none"
                />
            </div>

            <div className="space-y-1">
                <label className="text-xs font-mono text-secondary-text">Detailed Description</label>
                <textarea
                    name="description"
                    rows={6}
                    defaultValue={initialData?.description || ''}
                    placeholder="Full problem statement, system architecture, dataset, results, and conclusions..."
                    className="w-full px-3 py-2 bg-background border border-border-subtle rounded-lg text-sm text-primary-text focus:border-accent focus:outline-none"
                />
            </div>

            {/* 1. Thumbnail Image */}
            <MediaSourceInput
                name="imageUrl"
                label="Thumbnail Image (Upload, External Image Link, or None)"
                defaultValue={initialData?.image_url || ''}
            />

            {/* 2. Extra Image */}
            <MediaSourceInput
                name="extraImageUrl"
                label="Extra Image (Architecture Diagram / Result Plot — Optional)"
                defaultValue={initialData?.extra_image_url || ''}
            />

            {/* 3. Video */}
            <MediaSourceInput
                name="videoUrl"
                label="Project Video (Upload MP4/WebM, YouTube Link, or None)"
                defaultValue={initialData?.video_url || ''}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-mono text-secondary-text">Code Link (GitHub / GitLab)</label>
                    <input
                        name="githubUrl"
                        type="url"
                        defaultValue={initialData?.github_url || ''}
                        placeholder="https://github.com/username/repo"
                        className="w-full px-3 py-2 bg-background border border-border-subtle rounded-lg text-sm text-primary-text focus:border-accent focus:outline-none"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-mono text-secondary-text">Demo Link (Live App / Simulation)</label>
                    <input
                        name="demoUrl"
                        type="url"
                        defaultValue={initialData?.demo_url || ''}
                        placeholder="https://demo.example.com"
                        className="w-full px-3 py-2 bg-background border border-border-subtle rounded-lg text-sm text-primary-text focus:border-accent focus:outline-none"
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-mono text-secondary-text">Technologies (comma-separated)</label>
                <input
                    name="technologies"
                    defaultValue={(initialData?.technologies || []).join(', ')}
                    placeholder="Python, PyTorch, ROS2, OpenCV, C++"
                    className="w-full px-3 py-2 bg-background border border-border-subtle rounded-lg text-sm text-primary-text focus:border-accent focus:outline-none"
                />
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
                            : 'Creating Project...'
                        : isEdit
                            ? 'Save Changes'
                            : 'Create Project'}
                </Button>
                <Link href="/projects">
                    <Button type="button" variant="outline" size="md">
                        Cancel
                    </Button>
                </Link>
            </div>
        </form>
    );
}