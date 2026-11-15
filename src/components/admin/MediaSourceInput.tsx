'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Upload, Link as LinkIcon, Ban, CheckCircle2 } from 'lucide-react';
import { SmartMedia } from '@/components/ui/SmartMedia';

interface MediaSourceInputProps {
    name: string;
    label: string;
    defaultValue?: string;
}

export function MediaSourceInput({
    name,
    label,
    defaultValue = '',
}: MediaSourceInputProps) {
    const [mode, setMode] = useState<'none' | 'link' | 'upload'>(
        defaultValue ? 'link' : 'none'
    );
    const [urlValue, setUrlValue] = useState(defaultValue);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleModeChange = (newMode: 'none' | 'link' | 'upload') => {
        setMode(newMode);
        setUploadError(null);
        if (newMode === 'none') {
            setUrlValue('');
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setUploadError(null);

        try {
            const supabase = createClient();
            const ext = file.name.split('.').pop();
            const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;

            const { error } = await supabase.storage
                .from('portfolio-media')
                .upload(path, file);

            if (error) throw error;

            const { data } = supabase.storage.from('portfolio-media').getPublicUrl(path);
            setUrlValue(data.publicUrl);
        } catch (err: unknown) {
            setUploadError(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-3 p-4 bg-background/50 border border-border-subtle rounded-xl">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-mono text-secondary-text">{label}</label>

                {/* 3-Way Selector */}
                <div className="inline-flex rounded-lg bg-surface border border-border-subtle p-0.5 text-[11px] font-mono">
                    <button
                        type="button"
                        onClick={() => handleModeChange('none')}
                        className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors ${mode === 'none'
                                ? 'bg-accent text-accent-foreground font-semibold'
                                : 'text-secondary-text hover:text-primary-text'
                            }`}
                    >
                        <Ban size={12} /> None / Blank
                    </button>

                    <button
                        type="button"
                        onClick={() => handleModeChange('link')}
                        className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors ${mode === 'link'
                                ? 'bg-accent text-accent-foreground font-semibold'
                                : 'text-secondary-text hover:text-primary-text'
                            }`}
                    >
                        <LinkIcon size={12} /> External / YouTube
                    </button>

                    <button
                        type="button"
                        onClick={() => handleModeChange('upload')}
                        className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors ${mode === 'upload'
                                ? 'bg-accent text-accent-foreground font-semibold'
                                : 'text-secondary-text hover:text-primary-text'
                            }`}
                    >
                        <Upload size={12} /> Upload File
                    </button>
                </div>
            </div>

            {/* Hidden input submitted with standard HTML FormData */}
            <input type="hidden" name={name} value={mode === 'none' ? '' : urlValue} />

            {mode === 'link' && (
                <input
                    type="url"
                    value={urlValue}
                    onChange={(e) => setUrlValue(e.target.value)}
                    placeholder="Paste YouTube video link or direct image URL (https://...)"
                    className="w-full px-3 py-2 bg-background border border-border-subtle rounded-lg text-xs text-primary-text focus:border-accent focus:outline-none"
                />
            )}

            {mode === 'upload' && (
                <div className="space-y-2">
                    <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="w-full px-3 py-1.5 bg-background border border-border-subtle rounded-lg text-xs text-secondary-text file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-mono file:bg-accent/10 file:text-accent"
                    />
                    {uploading && (
                        <p className="text-[11px] font-mono text-accent">Uploading to Supabase Storage...</p>
                    )}
                    {uploadError && (
                        <p className="text-[11px] font-mono text-red-400">{uploadError}</p>
                    )}
                    {urlValue && !uploading && (
                        <p className="text-[11px] font-mono text-accent flex items-center gap-1">
                            <CheckCircle2 size={12} /> Ready: {urlValue}
                        </p>
                    )}
                </div>
            )}

            {/* Live Preview when URL exists */}
            {mode !== 'none' && urlValue && (
                <div className="max-w-sm pt-1">
                    <SmartMedia url={urlValue} alt="Media preview" />
                </div>
            )}
        </div>
    );
}