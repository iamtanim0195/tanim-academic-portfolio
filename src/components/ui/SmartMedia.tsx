'use client';

import React, { useState } from 'react';

interface SmartMediaProps {
    url?: string | null;
    alt?: string;
    className?: string;
    aspectRatio?: 'video' | 'square' | 'auto';
}

function extractYouTubeId(url: string): string | null {
    const regExp =
        /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
}

export function SmartMedia({
    url,
    alt = 'Portfolio media',
    className = '',
    aspectRatio = 'video',
}: SmartMediaProps) {
    const [hasError, setHasError] = useState(false);

    // 1. Blank / No media selected
    if (!url || url.trim() === '' || hasError) {
        return null;
    }

    const trimmedUrl = url.trim();
    const youtubeId = extractYouTubeId(trimmedUrl);
    const isDirectVideo = /\.(mp4|webm|ogg)(\?.*)?$/i.test(trimmedUrl);

    const ratioClass =
        aspectRatio === 'video'
            ? 'aspect-video'
            : aspectRatio === 'square'
                ? 'aspect-square'
                : '';

    // 2. YouTube Video Link (Watch, Share, Shorts, or Embed URL)
    if (youtubeId) {
        return (
            <div
                className={`w-full ${ratioClass} rounded-xl overflow-hidden border border-border-subtle bg-background ${className}`}
            >
                <iframe
                    src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
                    title={alt}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    className="w-full h-full border-0"
                />
            </div>
        );
    }

    // 3. Direct Video File (.mp4 / .webm)
    if (isDirectVideo) {
        return (
            <div
                className={`w-full ${ratioClass} rounded-xl overflow-hidden border border-border-subtle bg-background ${className}`}
            >
                <video
                    src={trimmedUrl}
                    controls
                    playsInline
                    preload="metadata"
                    onError={() => setHasError(true)}
                    className="w-full h-full object-cover"
                />
            </div>
        );
    }

    // 4. Uploaded Image or External Image Link (Supabase, CDN, Social Direct Image URL)
    return (
        <div
            className={`w-full ${ratioClass} rounded-xl overflow-hidden border border-border-subtle bg-background ${className}`}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={trimmedUrl}
                alt={alt}
                loading="lazy"
                onError={() => setHasError(true)}
                className="w-full h-full object-cover"
            />
        </div>
    );
}