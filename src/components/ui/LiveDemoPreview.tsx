'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Globe, ExternalLink } from 'lucide-react';

interface LiveDemoPreviewProps {
    demoUrl: string;
    title: string;
    interactive?: boolean;
    className?: string;
}

export function LiveDemoPreview({
    demoUrl,
    title,
    interactive = false,
    className = '',
}: LiveDemoPreviewProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0.35);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const updateScale = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                // Scale a 1280px desktop viewport to fit the card width cleanly
                setScale(containerWidth / 1280);
            }
        };

        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, []);

    return (
        <div
            ref={containerRef}
            className={`relative w-full aspect-video bg-background overflow-hidden select-none group ${className}`}
        >
            {/* Loading / Blocked Background Placeholder */}
            {!loaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-secondary-text bg-surface/60 p-4 text-center">
                    <Globe size={24} className="text-accent animate-pulse" />
                    <span className="text-[11px] font-mono">Loading live preview...</span>
                </div>
            )}

            {/* Scaled 1280x720 Desktop Iframe */}
            <iframe
                src={demoUrl}
                title={`${title} live demo preview`}
                loading="lazy"
                onLoad={() => setLoaded(true)}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                style={{
                    width: '1280px',
                    height: '720px',
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                }}
                className={`border-0 bg-white transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'
                    } ${interactive ? 'pointer-events-auto' : 'pointer-events-none'}`}
            />

            {/* Top-Left Live Indicator Badge */}
            <div className="absolute top-2.5 left-2.5 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-md border border-border-subtle text-[10px] font-mono text-accent shadow">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span>LIVE SITE</span>
            </div>

            {/* Hover Open Link Overlay (for non-interactive card thumbnails) */}
            {!interactive && (
                <a
                    href={demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${title} live demo`}
                    className="absolute inset-0 z-10 bg-background/0 group-hover:bg-background/30 transition-colors flex items-end justify-end p-3"
                >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent text-accent-foreground text-[11px] font-mono font-semibold shadow-lg">
                        Open Live <ExternalLink size={12} />
                    </span>
                </a>
            )}
        </div>
    );
}