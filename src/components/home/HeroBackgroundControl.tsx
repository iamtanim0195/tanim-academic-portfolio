'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { addHeroBgAction, deleteHeroBgAction } from '@/app/hero-bg-actions';
import { Button } from '@/components/ui/Button';

export interface HeroBgItem {
    id: string;
    label: string;
    media_type: 'image' | 'video';
    url: string;
    is_active?: boolean;
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
    const [currentIndex, setCurrentIndex] = useState(0);
    const [feedback, setFeedback] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const ytIframeRef = useRef<HTMLIFrameElement | null>(null);

    const safeIndex = bgItems.length > 0 ? currentIndex % bgItems.length : 0;
    const currentItem = bgItems.length > 0 ? bgItems[safeIndex] : null;

    const advanceToNext = useCallback(() => {
        if (bgItems.length <= 1) return;
        setCurrentIndex((prev) => (prev + 1) % bgItems.length);
    }, [bgItems.length]);

    // 1. Image Timer: Stay for exactly 2 seconds, then advance to next item
    useEffect(() => {
        if (!currentItem || bgItems.length <= 1) return;
        if (currentItem.media_type !== 'image') return;

        const timer = setTimeout(() => {
            advanceToNext();
        }, 3000);

        return () => clearTimeout(timer);
    }, [currentItem, bgItems.length, advanceToNext]);

    // 2. YouTube Embed Listener: Advance when YouTube iframe posts "ended" state (info === 0)
    useEffect(() => {
        if (!currentItem || currentItem.media_type !== 'video') return;
        const ytId = extractYouTubeId(currentItem.url);
        if (!ytId) return;

        const handleMessage = (event: MessageEvent) => {
            if (typeof event.data !== 'string') return;
            try {
                const data = JSON.parse(event.data);
                // YouTube IFrame API sends info: 0 when video finishes
                if (data.event === 'onStateChange' && data.info === 0) {
                    advanceToNext();
                }
            } catch {
                // Ignore non-JSON postMessages
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [currentItem, advanceToNext]);

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
            setFeedback({ type: 'success', message: 'File uploaded! Click "Add to Loop".' });
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
        formData.set('setActive', 'on');
        const res = await addHeroBgAction(formData);
        setSaving(false);

        if (res?.error) {
            setFeedback({ type: 'error', message: res.error });
            return;
        }

        setLabelInput('');
        setUrlInput('');
        setFeedback({ type: 'success', message: 'Added to Hero Background loop!' });
        router.refresh();
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Remove this media item from the loop?')) return;
        setFeedback(null);
        const res = await deleteHeroBgAction(id);
        if (res?.error) {
            setFeedback({ type: 'error', message: res.error });
            return;
        }
        setCurrentIndex(0);
        router.refresh();
    };

    const selectFromLibrary = (item: LibraryChoiceItem) => {
        setUrlInput(item.url);
        setLabelInput(item.label);
        setMediaType(item.media_type);
        setFeedback({
            type: 'success',
            message: `Selected "${item.label}". Click "Add to Loop" to include it.`,
        });
    };

    return (
        <>
            {/* Background Sequential Playlist Layer */}
            <div aria-hidden="true" className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {currentItem &&
                    (currentItem.media_type === 'video' ? (
                        (() => {
                            const ytId = extractYouTubeId(currentItem.url);
                            if (ytId) {
                                return (
                                    <iframe
                                        key={currentItem.id}
                                        ref={ytIframeRef}
                                        src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&enablejsapi=1${bgItems.length === 1 ? `&loop=1&playlist=${ytId}` : ''
                                            }`}
                                        title={currentItem.label}
                                        allow="autoplay; encrypted-media"
                                        onLoad={() => {
                                            // Subscribe to YouTube player state events so we detect when video finishes
                                            ytIframeRef.current?.contentWindow?.postMessage(
                                                JSON.stringify({ event: 'listening' }),
                                                '*'
                                            );
                                        }}
                                        className="w-full h-full object-cover scale-125 opacity-30"
                                    />
                                );
                            }

                            return (
                                <video
                                    key={currentItem.id}
                                    src={currentItem.url}
                                    autoPlay
                                    muted
                                    playsInline
                                    loop={bgItems.length === 1}
                                    onEnded={advanceToNext}
                                    onError={advanceToNext}
                                    className="w-full h-full object-cover opacity-30"
                                />
                            );
                        })()
                    ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            key={currentItem.id}
                            src={currentItem.url}
                            alt=""
                            onError={advanceToNext}
                            className="w-full h-full object-cover opacity-25 transition-opacity duration-500"
                        />
                    ))}

                {/* Readability Gradient Overlay */}
                {currentItem && (
                    <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background" />
                )}
            </div>

            {/* Admin Floating Pencil Trigger */}
            {isAdmin && (
                <button
                    type="button"
                    onClick={() => {
                        setFeedback(null);
                        setModalOpen(true);
                    }}
                    title="Edit Hero Background Playlist"
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
                                    Hero Background Loop Playlist
                                </h2>
                                <p className="text-[11px] font-mono text-accent">
                  // ALL ITEMS PLAY SEQUENTIALLY (IMAGES: 2S • VIDEOS: FULL DURATION)
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

                            {/* Playlist Items List */}
                            <div className="space-y-2.5">
                                <h3 className="text-xs font-mono uppercase tracking-wider text-secondary-text">
                                    Loop Playlist ({bgItems.length} {bgItems.length === 1 ? 'item' : 'items'})
                                </h3>

                                {bgItems.length === 0 ? (
                                    <p className="p-4 rounded-xl bg-background/60 border border-border-subtle text-xs text-secondary-text text-center">
                                        No background media added yet. Add images or videos below to start the loop.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {bgItems.map((item, idx) => (
                                            <div
                                                key={item.id}
                                                className="p-3 rounded-xl border border-border-subtle bg-background/60 flex items-center gap-3"
                                            >
                                                <div className="w-16 h-12 rounded-lg overflow-hidden bg-surface border border-border-subtle shrink-0 flex items-center justify-center relative">
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
                                                    <span className="absolute bottom-0.5 left-1 px-1 rounded bg-background/85 text-[9px] font-mono text-accent">
                                                        #{idx + 1}
                                                    </span>
                                                </div>

                                                <div className="min-w-0 flex-1 space-y-1">
                                                    <p className="text-xs font-bold text-primary-text truncate">
                                                        {item.label}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-mono text-secondary-text">
                                                            {item.media_type === 'image' ? 'Image • 2s' : 'Video • Full length'}
                                                        </span>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(item.id)}
                                                            title="Remove from loop"
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
                                        <Plus size={14} /> Add to Loop
                                    </span>

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

                                {sourceMode === 'library' && (
                                    <div className="space-y-2">
                                        <p className="text-[11px] font-mono text-secondary-text">
                                            Select any image or video from your Media Library:
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
                                                <ImageIcon size={13} /> Image (2s)
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setMediaType('video')}
                                                className={`py-2 px-3 rounded-lg border text-xs font-mono flex items-center justify-center gap-1.5 ${mediaType === 'video'
                                                    ? 'bg-accent/15 border-accent text-accent'
                                                    : 'bg-surface border-border-subtle text-secondary-text'
                                                    }`}
                                            >
                                                <Film size={13} /> Video (Full)
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

                                <div className="flex justify-end pt-1">
                                    <Button
                                        type="submit"
                                        variant="accent"
                                        size="sm"
                                        disabled={saving || uploading || !urlInput}
                                    >
                                        {saving ? 'Adding...' : 'Add to Loop'}
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