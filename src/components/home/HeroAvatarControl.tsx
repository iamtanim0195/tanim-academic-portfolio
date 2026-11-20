'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Bot,
    Pencil,
    X,
    Plus,
    Trash2,
    CheckCircle2,
    Upload,
    Link as LinkIcon,
    AlertCircle,
    Image as ImageIcon,
    Film,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
    addHeroMediaAction,
    setActiveHeroMediaAction,
    deleteHeroMediaAction,
} from '@/app/hero-media-actions';
import { Button } from '@/components/ui/Button';

export interface HeroMediaItem {
    id: string;
    label: string;
    media_type: 'image' | 'video';
    url: string;
    is_active: boolean;
    created_at: string;
}

interface HeroAvatarControlProps {
    isAdmin: boolean;
    mediaItems: HeroMediaItem[];
}

function extractYouTubeId(url: string): string | null {
    const regExp =
        /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
}

export function HeroAvatarControl({ isAdmin, mediaItems }: HeroAvatarControlProps) {
    const router = useRouter();
    const [modalOpen, setModalOpen] = useState(false);
    const [sourceMode, setSourceMode] = useState<'upload' | 'link'>('upload');
    const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
    const [urlInput, setUrlInput] = useState('');
    const [labelInput, setLabelInput] = useState('');
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [mediaError, setMediaError] = useState(false);
    const [feedback, setFeedback] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const activeItem =
        mediaItems.find((item) => item.is_active) || mediaItems[0] || null;

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setFeedback(null);

        try {
            const supabase = createClient();
            const detectedType: 'image' | 'video' = file.type.startsWith('video/')
                ? 'video'
                : 'image';
            setMediaType(detectedType);

            const ext = file.name.split('.').pop();
            const path = `hero/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;

            const { error } = await supabase.storage
                .from('portfolio-media')
                .upload(path, file);

            if (error) throw error;

            const { data } = supabase.storage.from('portfolio-media').getPublicUrl(path);
            setUrlInput(data.publicUrl);
            if (!labelInput) {
                setLabelInput(file.name.replace(/\.[^/.]+$/, ''));
            }
            setFeedback({
                type: 'success',
                message: 'File uploaded! Click "Save Media" to apply.',
            });
        } catch (err: unknown) {
            setFeedback({
                type: 'error',
                message: err instanceof Error ? err.message : 'Upload failed',
            });
        } finally {
            setUploading(false);
        }
    };

    const handleAddMedia = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        setFeedback(null);

        const formData = new FormData(e.currentTarget);
        const res = await addHeroMediaAction(formData);
        setSaving(false);

        if (res?.error) {
            setFeedback({ type: 'error', message: res.error });
            return;
        }

        setLabelInput('');
        setUrlInput('');
        setMediaError(false);
        setFeedback({ type: 'success', message: 'Hero media saved!' });
        router.refresh();
    };

    const handleSetActive = async (id: string) => {
        setFeedback(null);
        setMediaError(false);
        const res = await setActiveHeroMediaAction(id);
        if (res?.error) {
            setFeedback({ type: 'error', message: res.error });
            return;
        }
        setFeedback({ type: 'success', message: 'Active hero media updated!' });
        router.refresh();
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this item from history?')) return;
        setFeedback(null);
        const res = await deleteHeroMediaAction(id);
        if (res?.error) {
            setFeedback({ type: 'error', message: res.error });
            return;
        }
        router.refresh();
    };

    const renderActiveMedia = () => {
        if (!activeItem || mediaError) {
            return (
                <div className="w-full h-full rounded-full bg-background/80 border border-border-subtle flex flex-col items-center justify-center text-center p-6 space-y-2">
                    <Bot size={48} className="text-accent animate-pulse" />
                    <span className="font-mono text-xs text-secondary-text">
                        [ Profile Photo / Video ]
                    </span>
                    <span className="text-[11px] text-accent font-mono">
                        Hero Mode: Interactive
                    </span>
                </div>
            );
        }

        if (activeItem.media_type === 'video') {
            const ytId = extractYouTubeId(activeItem.url);
            if (ytId) {
                return (
                    <iframe
                        src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0`}
                        title={activeItem.label}
                        allow="autoplay; encrypted-media"
                        className="w-full h-full object-cover rounded-full pointer-events-none scale-150"
                    />
                );
            }

            return (
                <video
                    src={activeItem.url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    onError={() => setMediaError(true)}
                    className="w-full h-full object-cover rounded-full"
                />
            );
        }

        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={activeItem.url}
                alt={activeItem.label}
                onError={() => setMediaError(true)}
                className="w-full h-full object-cover rounded-full"
            />
        );
    };

    return (
        <>
            <div className="relative w-64 h-64 sm:w-80 sm:h-80">
                {/* Circular Frame */}
                <div className="w-full h-full rounded-full border-2 border-accent/40 bg-surface flex items-center justify-center p-3 shadow-2xl overflow-hidden">
                    <div className="w-full h-full rounded-full overflow-hidden bg-background flex items-center justify-center">
                        {renderActiveMedia()}
                    </div>
                </div>

                {/* Admin Floating Pencil Button */}
                {isAdmin && (
                    <button
                        type="button"
                        onClick={() => {
                            setFeedback(null);
                            setModalOpen(true);
                        }}
                        title="Edit Hero Photo / Video"
                        aria-label="Edit Hero Photo or Video"
                        className="absolute bottom-3 right-3 z-20 p-3 rounded-full bg-surface border border-accent/50 text-accent hover:bg-accent hover:text-accent-foreground shadow-xl transition-all hover:scale-105"
                    >
                        <Pencil size={18} />
                    </button>
                )}
            </div>

            {/* Admin Hero Media Popup Modal */}
            {isAdmin && modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
                    <div className="w-full max-w-2xl bg-surface border border-border-subtle rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="p-5 border-b border-border-subtle flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-extrabold text-primary-text">
                                    Hero Profile Photo & Video
                                </h2>
                                <p className="text-[11px] font-mono text-accent">
                  // UPLOAD, LINK, PREVIEW HISTORY & SET ACTIVE
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setModalOpen(false)}
                                aria-label="Close modal"
                                className="p-2 rounded-lg text-secondary-text hover:text-primary-text hover:bg-background"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-5 overflow-y-auto space-y-6">
                            {feedback && (
                                <div
                                    className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${feedback.type === 'success'
                                            ? 'bg-accent/10 border-accent/40 text-accent'
                                            : 'bg-red-900/20 border-red-500/40 text-red-400'
                                        }`}
                                >
                                    {feedback.type === 'success' ? (
                                        <CheckCircle2 size={16} />
                                    ) : (
                                        <AlertCircle size={16} />
                                    )}
                                    <span>{feedback.message}</span>
                                </div>
                            )}

                            {/* Preview History Grid */}
                            <div className="space-y-2.5">
                                <h3 className="text-xs font-mono uppercase tracking-wider text-secondary-text">
                                    Previous Uploads & Links ({mediaItems.length})
                                </h3>

                                {mediaItems.length === 0 ? (
                                    <p className="p-4 rounded-xl bg-background/60 border border-border-subtle text-xs text-secondary-text text-center">
                                        No profile photo or video added yet. Add one below.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {mediaItems.map((item) => (
                                            <div
                                                key={item.id}
                                                className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${item.is_active
                                                        ? 'bg-accent/5 border-accent/40'
                                                        : 'bg-background/60 border-border-subtle'
                                                    }`}
                                            >
                                                {/* Mini Preview Thumbnail */}
                                                <div className="w-14 h-14 rounded-full overflow-hidden bg-surface border border-border-subtle shrink-0 flex items-center justify-center">
                                                    {item.media_type === 'image' ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={item.url}
                                                            alt={item.label}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <Film size={20} className="text-accent" />
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1 space-y-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-xs font-bold text-primary-text truncate">
                                                            {item.label}
                                                        </span>
                                                        {item.is_active && (
                                                            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono bg-accent text-accent-foreground font-semibold shrink-0">
                                                                ACTIVE
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-1.5 pt-1">
                                                        {!item.is_active && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleSetActive(item.id)}
                                                                className="px-2 py-1 rounded bg-surface border border-border-subtle text-[10px] font-mono text-secondary-text hover:text-accent hover:border-accent/40"
                                                            >
                                                                Set Active
                                                            </button>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(item.id)}
                                                            title="Delete"
                                                            className="p-1 rounded bg-surface border border-border-subtle text-secondary-text hover:text-red-400"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Add New Image / Video Form */}
                            <form
                                onSubmit={handleAddMedia}
                                className="p-4 rounded-xl bg-background/60 border border-border-subtle space-y-4"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <span className="text-xs font-mono text-accent uppercase tracking-wider flex items-center gap-1.5">
                                        <Plus size={14} /> Add Photo or Video
                                    </span>

                                    {/* Upload vs External Link Toggle */}
                                    <div className="inline-flex rounded-lg bg-surface border border-border-subtle p-0.5 text-[11px] font-mono">
                                        <button
                                            type="button"
                                            onClick={() => setSourceMode('upload')}
                                            className={`px-2.5 py-1 rounded-md flex items-center gap-1 ${sourceMode === 'upload'
                                                    ? 'bg-accent text-accent-foreground font-semibold'
                                                    : 'text-secondary-text'
                                                }`}
                                        >
                                            <Upload size={11} /> Upload File
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSourceMode('link')}
                                            className={`px-2.5 py-1 rounded-md flex items-center gap-1 ${sourceMode === 'link'
                                                    ? 'bg-accent text-accent-foreground font-semibold'
                                                    : 'text-secondary-text'
                                                }`}
                                        >
                                            <LinkIcon size={11} /> External Link
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-xs font-mono text-secondary-text">Label *</label>
                                        <input
                                            name="label"
                                            required
                                            value={labelInput}
                                            onChange={(e) => setLabelInput(e.target.value)}
                                            placeholder="e.g. Lab Headshot / Robot Demo"
                                            className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-lg text-xs text-primary-text focus:border-accent focus:outline-none"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-mono text-secondary-text">Media Type *</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setMediaType('image')}
                                                className={`py-2 px-3 rounded-lg border text-xs font-mono flex items-center justify-center gap-1.5 ${mediaType === 'image'
                                                        ? 'bg-accent/15 border-accent text-accent'
                                                        : 'bg-surface border-border-subtle text-secondary-text'
                                                    }`}
                                            >
                                                <ImageIcon size={13} /> Image
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setMediaType('video')}
                                                className={`py-2 px-3 rounded-lg border text-xs font-mono flex items-center justify-center gap-1.5 ${mediaType === 'video'
                                                        ? 'bg-accent/15 border-accent text-accent'
                                                        : 'bg-surface border-border-subtle text-secondary-text'
                                                    }`}
                                            >
                                                <Film size={13} /> Video
                                            </button>
                                        </div>
                                        <input type="hidden" name="mediaType" value={mediaType} />
                                    </div>
                                </div>

                                {sourceMode === 'upload' ? (
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-mono text-secondary-text">
                                            Select Image or Video File *
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*,video/*"
                                            onChange={handleFileUpload}
                                            disabled={uploading}
                                            className="w-full px-3 py-1.5 bg-surface border border-border-subtle rounded-lg text-xs text-secondary-text file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-mono file:bg-accent/10 file:text-accent"
                                        />
                                        {uploading && (
                                            <p className="text-[11px] font-mono text-accent">
                                                Uploading to Supabase Storage...
                                            </p>
                                        )}
                                        <input type="hidden" name="url" value={urlInput} />
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        <label className="text-xs font-mono text-secondary-text">
                                            Image or Video URL (Direct Image, MP4, or YouTube Link) *
                                        </label>
                                        <input
                                            name="url"
                                            type="url"
                                            required
                                            value={urlInput}
                                            onChange={(e) => setUrlInput(e.target.value)}
                                            placeholder="https://..."
                                            className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-lg text-xs text-primary-text focus:border-accent focus:outline-none"
                                        />
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-1">
                                    <label className="flex items-center gap-2 text-xs text-primary-text cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="setActive"
                                            defaultChecked
                                            className="accent-[#C4F269]"
                                        />
                                        <span>Show on homepage immediately</span>
                                    </label>

                                    <Button
                                        type="submit"
                                        variant="accent"
                                        size="sm"
                                        disabled={saving || uploading || !urlInput}
                                    >
                                        {saving ? 'Saving...' : 'Save Media'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}