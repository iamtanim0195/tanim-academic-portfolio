'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    FileText,
    Film,
    Trash2,
    ExternalLink,
    Copy,
    Check,
    Pencil,
} from 'lucide-react';
import { deleteUnifiedMediaAction } from '@/app/hero-bg-actions';

export interface UnifiedMediaRecord {
    id: string;
    dbId: string;
    title: string;
    url: string;
    kind: 'image' | 'video' | 'document';
    usedIn: 'Media Library' | 'Hero Avatar' | 'Hero Background' | 'CV Links' | 'Projects' | 'Feed';
    deletableSource?: 'media_assets' | 'hero_media_items' | 'hero_bg_media' | 'cv_links';
    editHref?: string;
    isActive?: boolean;
}

interface UnifiedMediaManagerProps {
    items: UnifiedMediaRecord[];
}

export function UnifiedMediaManager({ items }: UnifiedMediaManagerProps) {
    const router = useRouter();
    const [filter, setFilter] = useState<string>('ALL');
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const tabs = [
        'ALL',
        'Media Library',
        'Hero Avatar',
        'Hero Background',
        'CV Links',
        'Projects',
        'Feed',
    ];

    const filteredItems =
        filter === 'ALL' ? items : items.filter((item) => item.usedIn === filter);

    const handleCopy = (id: string, url: string) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDelete = async (item: UnifiedMediaRecord) => {
        if (!item.deletableSource) return;
        if (!window.confirm(`Delete "${item.title}" permanently?`)) return;

        setDeletingId(item.id);
        const res = await deleteUnifiedMediaAction(item.deletableSource, item.dbId, item.url);
        setDeletingId(null);

        if (res?.error) {
            alert(`Delete failed: ${res.error}`);
            return;
        }

        router.refresh();
    };

    return (
        <div className="space-y-6">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-border-subtle pb-4">
                {tabs.map((tab) => {
                    const count =
                        tab === 'ALL'
                            ? items.length
                            : items.filter((i) => i.usedIn === tab).length;
                    return (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setFilter(tab)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${filter === tab
                                    ? 'bg-accent text-accent-foreground font-semibold'
                                    : 'bg-surface border border-border-subtle text-secondary-text hover:text-primary-text'
                                }`}
                        >
                            {tab} ({count})
                        </button>
                    );
                })}
            </div>

            {/* Media Grid */}
            {filteredItems.length === 0 ? (
                <div className="p-10 bg-surface border border-border-subtle rounded-xl text-center text-xs text-secondary-text">
                    No media items found under &ldquo;{filter}&rdquo;.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-surface border border-border-subtle rounded-xl overflow-hidden flex flex-col justify-between hover:border-accent/40 transition-colors"
                        >
                            {/* Preview Area */}
                            <div className="h-44 bg-background flex items-center justify-center overflow-hidden border-b border-border-subtle relative">
                                {item.kind === 'image' ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={item.url}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : item.kind === 'video' ? (
                                    <div className="flex flex-col items-center gap-2 text-accent">
                                        <Film size={36} />
                                        <span className="text-[10px] font-mono">VIDEO ASSET</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-accent">
                                        <FileText size={36} />
                                        <span className="text-[10px] font-mono">DOCUMENT / CV</span>
                                    </div>
                                )}

                                {/* Usage Badge */}
                                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-background/90 border border-border-subtle text-accent">
                                    {item.usedIn}
                                </span>

                                {item.isActive && (
                                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-accent text-accent-foreground font-semibold">
                                        ACTIVE
                                    </span>
                                )}
                            </div>

                            {/* Metadata & Controls */}
                            <div className="p-4 space-y-3">
                                <div className="space-y-1">
                                    <h3 className="text-xs font-bold text-primary-text truncate" title={item.title}>
                                        {item.title}
                                    </h3>
                                    <p className="text-[11px] font-mono text-secondary-text truncate">{item.url}</p>
                                </div>

                                <div className="flex items-center justify-between gap-2 pt-2 border-t border-border-subtle">
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(item.id, item.url)}
                                            className="px-2.5 py-1.5 rounded-lg bg-background border border-border-subtle text-[11px] font-mono text-secondary-text hover:text-accent inline-flex items-center gap-1"
                                        >
                                            {copiedId === item.id ? <Check size={12} /> : <Copy size={12} />}
                                            <span>{copiedId === item.id ? 'Copied' : 'Copy URL'}</span>
                                        </button>

                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title="Open in new tab"
                                            className="p-1.5 rounded-lg bg-background border border-border-subtle text-secondary-text hover:text-accent"
                                        >
                                            <ExternalLink size={13} />
                                        </a>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        {item.editHref && (
                                            <Link
                                                href={item.editHref}
                                                title="Edit source item"
                                                className="p-1.5 rounded-lg bg-background border border-border-subtle text-secondary-text hover:text-accent"
                                            >
                                                <Pencil size={13} />
                                            </Link>
                                        )}

                                        {item.deletableSource && (
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(item)}
                                                disabled={deletingId === item.id}
                                                title="Delete media"
                                                className="p-1.5 rounded-lg bg-background border border-border-subtle text-secondary-text hover:text-red-400 disabled:opacity-50"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}   