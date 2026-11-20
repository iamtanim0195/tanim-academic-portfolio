'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
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
    FolderOpen,
    Eye,
    EyeOff,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
    addHeroBgAction,
    toggleHeroBgActiveAction,
    deleteHeroBgAction,
} from '@/app/hero-bg-actions';
import { Button } from '@/components/ui/Button';

export interface HeroBgItem {
    id: string;
    label: string;
    media_type: 'image' | 'video';
    url: string;
    is_active: boolean;
    created_at: string;
}

export interface LibraryChoiceItem {
    id: string;
    label: string;
    media_type: 'image' | 'video';
    url: string;
    sourceLabel: string;
}

interface HeroBackgroundControlProps {
    isAdmin: boolean;
    bgItems: HeroBgItem[];
    libraryItems: LibraryChoiceItem[];
}

function extractYouTubeId(url: string): string | null {
    const regExp =
        /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
}

export function HeroBackgroundControl({
    isAdmin,
    bgItems,
    libraryItems,
}: HeroBackgroundControlProps) {
    const router = useRouter();
    const [modalOpen, setModalOpen] = useState(false);
    const [sourceMode, setSourceMode] = useState<'upload' | 'link' | 'library'>('upload');
    const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
    const [urlInput, setUrlInput] = useState('');
    const [labelInput, setLabelInput] = useState('');
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [slideIndex, setSlideIndex] = useState(0);
    const [feedback, setFeedback] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const activeItems = bgItems.filter((item) => item.is_active);
    const activeVideo = activeItems.find((item) => item.media_type === 'video');
    const activeImages = activeItems.filter((item) => item.media_type === 'image');

    // Rotate through active background images every 6 seconds
    useEffect(() => {
        if (activeVideo || activeImages.length <= 1) return;
        const timer = setInterval(() => {
            setSlideIndex((prev) => (prev + 1) % activeImages.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [activeVideo, activeImages.length]);

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
            const path = `hero-bg/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;

            const { error } = await supabase.storage
                .from('portfolio-media')
                .upload(path, file);

            if (error) throw error;

            const { data } = supabase.storage.from('portfolio-media').getPublicUrl(path);
            setUrlInput(data.publicUrl);
            if (!labelInput) {
                setLabelInput(file.name.replace(/\.[^/.]+$/, ''));
            }
            setFeedback({ type: 'success', message: 'File uploaded! Click "Add to Hero Background".' });
        } catch (err: unknown) {
            setFeedback({
                type: 'error',
                message: err instanceof Error ? err.message : 'Upload failed',
            });
        } finally {
            setUploading(false);
        }
    };

    const handleAddBg = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        setFeedback(null);

        const formData = new FormData(e.currentTarget);
        const res = await addHeroBgAction(formData);
        setSaving(false);

        if (res?.error) {
            setFeedback({ type: 'error', message: res.error });
            return;
        }

        setLabelInput('');
        setUrlInput('');
        setFeedback({ type: 'success', message: 'Hero background updated!' });
        router.refresh();
    };

    const handleToggleActive = async (id: string, current: boolean) => {
        setFeedback(null);
        const res = await toggleHeroBgActiveAction(id, current);
        if (res?.error) {
            setFeedback({ type: 'error', message: res.error });
            return;
        }
        router.refresh();
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Remove this background media item?')) return;
        setFeedback(null);
        const res = await deleteHeroBgAction(id);
        if (res?.error) {
            setFeedback({ type: 'error', message: res.error });
            return;
        }
        router.refresh();
    };

    const selectFromLibrary = (item: LibraryChoiceItem) => {
        setUrlInput(item.url);
        setLabelInput(item.label);
        setMediaType(item.media_type);
        setFeedback({
            type: 'success',
            message: `Selected "${item.label}" from Media Library. Click "Add to Hero Background" to apply.`,
        });
    };

    return (
        <>
            {/* Background Media Layer (Sits behind Hero content) */}
            <div aria-hidden="true" className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {activeVideo ? (
                    (() => {
                        const ytId = extractYouTubeId(activeVideo.url);
                        if (ytId) {
                            return (
                                <iframe
                                    src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&modestbranding=1`}
                                    title={activeVideo.label}
                                    allow="autoplay; encrypted-media"
                                    className="w-full h-full object-cover scale-125 opacity-30"
                                />
                            );
                        }
                        return (
                            <video
                                src={activeVideo.url}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover opacity-30"
                            />
                        );
                    })()
                ) : activeImages.length > 0 ? (
                    activeImages.map((img, idx) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            key={img.id}
                            src={img.url}
                            alt=""
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === slideIndex % activeImages.length ? 'opacity-25' : 'opacity-0'
                                }`}
                        />
                    ))
                ) : null}

                {/* Readability Gradient Overlay */}
                {(activeVideo || activeImages.length > 0) && (
                    <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background" />
                )}
            </div>

            {/* Admin Floating Pencil Trigger for Hero Background */}
            {isAdmin && (
                <button
                    type="button"
                    onClick={() => {
                        setFeedback(null);
                        setModalOpen(true);
                    }}
                    title="Edit Hero Background Image / Video"
                    className="absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-surface/90 backdrop-blur-md border border-accent/40 text-accent hover:bg-accent hover:text-accent-foreground text-xs font-mono shadow-lg transition-all"
                >
                    <Pencil size={14} />
                    <span className="hidden sm:inline">Edit Background</span>
                </button>
            )}

            {/* Admin Hero Background Modal */}
            {isAdmin && modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
                    <div className="w-full max-w-3xl bg-surface border border-border-subtle rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="p-5 border-b border-border-subtle flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-extrabold text-primary-text">
                                    Hero Background Media
                                </h2>
                                <p className="text-[11px] font-mono text-accent">
                  // UPLOAD, PASTE LINK, PICK FROM LIBRARY & MANAGE ROTATION
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

                            {/* Previous History & Active Toggle */}
                            <div className="space-y-2.5">
                                <h3 className="text-xs font-mono uppercase tracking-wider text-secondary-text">
                                    Hero Background History ({bgItems.length}) — Active images rotate automatically
                                </h3>

                                {bgItems.length === 0 ? (
                                    <p className="p-4 rounded-xl bg-background/60 border border-border-subtle text-xs text-secondary-text text-center">
                                        No background media set yet (currently solid dark charcoal). Add an image or video below.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {bgItems.map((item) => (
                                            <div
                                                key={item.id}
                                                className={`p-3 rounded-xl border flex items-center gap-3 ${item.is_active
                                                        ? 'bg-accent/5 border-accent/40'
                                                        : 'bg-background/60 border-border-subtle opacity-75'
                                                    }`}
                                            >
                                                <div className="w-16 h-12 rounded-lg overflow-hidden bg-surface border border-border-subtle shrink-0 flex items-center justify-center">
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
                                                    <p className="text-xs font-bold text-primary-text truncate">
                                                        {item.label}
                                                    </p>
                                                    <div className="flex items-center gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleToggleActive(item.id, item.is_active)}
                                                            className={`px-2 py-0.5 rounded text-[10px] font-mono inline-flex items-center gap-1 border ${item.is_active
                                                                    ? 'bg-accent text-accent-foreground border-accent font-semibold'
                                                                    : 'bg-surface text-secondary-text border-border-subtle hover:text-accent'
                                                                }`}
                                                        >
                                                            {item.is_active ? <Eye size={10} /> : <EyeOff size={10} />}
                                                            <span>{item.is_active ? 'Active' : 'Hidden'}</span>
                                                        </button>

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

                            {/* Add New Background Media Form */}
                            <form
                                onSubmit={handleAddBg}
                                className="p-4 rounded-xl bg-background/60 border border-border-subtle space-y-4"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <span className="text-xs font-mono text-accent uppercase tracking-wider flex items-center gap-1.5">
                                        <Plus size={14} /> Add Background Media
                                    </span>

                                    {/* 3-Way Source Switcher: Upload / Link / Choose from Media Library */}
                                    <div className="inline-flex rounded-lg bg-surface border border-border-subtle p-0.5 text-[11px] font-mono">
                                        <button
                                            type="button"
                                            onClick={() => setSourceMode('upload')}
                                            className={`px-2.5 py-1 rounded-md flex items-center gap-1 ${sourceMode === 'upload'
                                                    ? 'bg-accent text-accent-foreground font-semibold'
                                                    : 'text-secondary-text'
                                                }`}
                                        >
                                            <Upload size={11} /> Upload
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
                                        <button
                                            type="button"
                                            onClick={() => setSourceMode('library')}
                                            className={`px-2.5 py-1 rounded-md flex items-center gap-1 ${sourceMode === 'library'
                                                    ? 'bg-accent text-accent-foreground font-semibold'
                                                    : 'text-secondary-text'
                                                }`}
                                        >
                                            <FolderOpen size={11} /> From Media Library
                                        </button>
                                    </div>
                                </div>

                                {/* Mode 3: Choose from Existing Portfolio Media Library */}
                                {sourceMode === 'library' && (
                                    <div className="space-y-2">
                                        <p className="text-[11px] font-mono text-secondary-text">
                                            Click any existing image or video from your portfolio to use as Hero Background:
                                        </p>
                                        {libraryItems.length === 0 ? (
                                            <p className="p-3 bg-surface rounded-lg text-xs text-secondary-text text-center">
                                                No images or videos in Media Library yet.
                                            </p>
                                        ) : (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                                                {libraryItems.map((item) => (
                                                    <button
                                                        key={item.id}
                                                        type="button"
                                                        onClick={() => selectFromLibrary(item)}
                                                        className={`p-2 rounded-lg border text-left transition-all ${urlInput === item.url
                                                                ? 'border-accent bg-accent/10'
                                                                : 'border-border-subtle bg-surface hover:border-accent/40'
                                                            }`}
                                                    >
                                                        <div className="h-16 rounded overflow-hidden bg-background mb-1.5 flex items-center justify-center">
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
                                                        <p className="text-[11px] font-semibold text-primary-text truncate">
                                                            {item.label}
                                                        </p>
                                                        <span className="text-[9px] font-mono text-accent">
                                                            {item.sourceLabel}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-xs font-mono text-secondary-text">Label *</label>
                                        <input
                                            name="label"
                                            required
                                            value={labelInput}
                                            onChange={(e) => setLabelInput(e.target.value)}
                                            placeholder="e.g. Robotics Lab Simulation"
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

                                {sourceMode === 'upload' && (
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
                                            <p className="text-[11px] font-mono text-accent">Uploading...</p>
                                        )}
                                        <input type="hidden" name="url" value={urlInput} />
                                    </div>
                                )}

                                {sourceMode === 'link' && (
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

                                {sourceMode === 'library' && (
                                    <input type="hidden" name="url" value={urlInput} />
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
                                        {saving ? 'Saving...' : 'Add to Hero Background'}
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