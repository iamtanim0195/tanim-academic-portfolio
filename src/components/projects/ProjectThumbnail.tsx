'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, Globe } from 'lucide-react';
import { SmartMedia } from '@/components/ui/SmartMedia';
import { LiveDemoPreview } from '@/components/ui/LiveDemoPreview';

interface ProjectThumbnailProps {
    title: string;
    imageUrl?: string | null;
    demoUrl?: string | null;
}

export function ProjectThumbnail({
    title,
    imageUrl,
    demoUrl,
}: ProjectThumbnailProps) {
    const hasImage = Boolean(imageUrl && imageUrl.trim() !== '');
    const hasDemo = Boolean(demoUrl && demoUrl.trim() !== '');

    // Default to image if available, otherwise live demo
    const [mode, setMode] = useState<'image' | 'live'>(
        hasImage ? 'image' : 'live'
    );

    // Render nothing if neither thumbnail image nor demo link exists
    if (!hasImage && !hasDemo) {
        return null;
    }

    return (
        <div className="relative border-b border-border-subtle bg-background">
            {/* Floating Toggle Switch (shown only when BOTH image and demo URL exist) */}
            {hasImage && hasDemo && (
                <div className="absolute top-2.5 right-2.5 z-20 inline-flex items-center rounded-full bg-background/90 backdrop-blur-md border border-border-subtle p-0.5 shadow-lg">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setMode('image');
                        }}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-mono inline-flex items-center gap-1 transition-colors ${mode === 'image'
                                ? 'bg-accent text-accent-foreground font-semibold'
                                : 'text-secondary-text hover:text-primary-text'
                            }`}
                    >
                        <ImageIcon size={11} />
                        <span>Image</span>
                    </button>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setMode('live');
                        }}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-mono inline-flex items-center gap-1 transition-colors ${mode === 'live'
                                ? 'bg-accent text-accent-foreground font-semibold'
                                : 'text-secondary-text hover:text-primary-text'
                            }`}
                    >
                        <Globe size={11} />
                        <span>Live</span>
                    </button>
                </div>
            )}

            {/* Active View */}
            {mode === 'image' && hasImage ? (
                <SmartMedia
                    url={imageUrl}
                    alt={title}
                    className="rounded-none border-0"
                />
            ) : hasDemo ? (
                <LiveDemoPreview demoUrl={demoUrl!} title={title} />
            ) : null}
        </div>
    );
}