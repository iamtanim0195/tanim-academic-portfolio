'use client';

import React, { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';

interface HeroMediaProps {
    heroMode: 'photo' | 'video';
    avatarUrl?: string;
    heroVideoUrl?: string;
    backgroundImages?: string[];
    altText?: string;
}

export function HeroMedia({
    heroMode = 'photo',
    avatarUrl,
    heroVideoUrl,
    backgroundImages = [],
    altText = 'Researcher portrait',
}: HeroMediaProps) {
    const [bgIndex, setBgIndex] = useState(0);
    const [mediaError, setMediaError] = useState(false);

    useEffect(() => {
        if (backgroundImages.length <= 1) return;
        const interval = setInterval(() => {
            setBgIndex((prev) => (prev + 1) % backgroundImages.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [backgroundImages.length]);

    return (
        <div className="relative flex items-center justify-center">
            {/* Subtle Rotating Background Halo */}
            {backgroundImages.length > 0 && (
                <div
                    aria-hidden="true"
                    className="absolute -inset-6 rounded-full opacity-20 blur-xl transition-all duration-1000 bg-cover bg-center pointer-events-none"
                    style={{ backgroundImage: `url(${backgroundImages[bgIndex]})` }}
                />
            )}

            {/* Foreground Circular Frame */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border-2 border-accent/40 bg-surface p-2 shadow-2xl overflow-hidden">
                <div className="w-full h-full rounded-full bg-background border border-border-subtle overflow-hidden flex items-center justify-center relative">
                    {heroMode === 'video' && heroVideoUrl && !mediaError ? (
                        <video
                            src={heroVideoUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            onError={() => setMediaError(true)}
                            className="w-full h-full object-cover"
                        />
                    ) : avatarUrl && !mediaError ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={avatarUrl}
                            alt={altText}
                            onError={() => setMediaError(true)}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center p-6 space-y-2">
                            <Bot size={48} className="text-accent" />
                            <span className="font-mono text-xs text-secondary-text">[ Media Placeholder ]</span>
                            <span className="text-[11px] text-accent font-mono">
                                Mode: {heroMode.toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}