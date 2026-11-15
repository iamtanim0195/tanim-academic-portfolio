'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function MediaUploader() {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [altText, setAltText] = useState('');
    const [fileType, setFileType] = useState<'image' | 'video' | 'document'>('image');
    const [isHeroBg, setIsHeroBg] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const router = useRouter();

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        setStatus(null);

        try {
            const supabase = createClient();
            const fileExt = file.name.split('.').pop();
            const filePath = `${fileType}s/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('portfolio-media')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: publicUrlData } = supabase.storage
                .from('portfolio-media')
                .getPublicUrl(filePath);

            const { error: dbError } = await supabase.from('media_assets').insert({
                title: title || file.name,
                alt_text: altText || title || file.name,
                file_url: publicUrlData.publicUrl,
                file_type: fileType,
                is_public: true,
                is_hero_bg: isHeroBg,
            });

            if (dbError) throw dbError;

            setStatus({ type: 'success', message: 'Asset uploaded and saved to Media Library.' });
            setFile(null);
            setTitle('');
            setAltText('');
            setIsHeroBg(false);
            router.refresh();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Upload failed';
            setStatus({ type: 'error', message });
        } finally {
            setUploading(false);
        }
    };

    return (
        <form onSubmit={handleUpload} className="p-6 bg-surface border border-border-subtle rounded-xl space-y-4">
            <h2 className="text-sm font-mono uppercase tracking-wider text-accent font-semibold flex items-center gap-2">
                <Upload size={16} /> Upload New Media Asset
            </h2>

            {status && (
                <div
                    className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${status.type === 'success'
                            ? 'bg-accent/10 border-accent/30 text-accent'
                            : 'bg-red-900/20 border-red-500/30 text-red-400'
                        }`}
                >
                    {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    <span>{status.message}</span>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-mono text-secondary-text">Asset Title *</label>
                    <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Lab Robotics Setup"
                        className="w-full px-3 py-2 bg-background border border-border-subtle rounded-lg text-sm text-primary-text focus:border-accent focus:outline-none"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-mono text-secondary-text">Accessible Alt Text *</label>
                    <input
                        type="text"
                        required
                        value={altText}
                        onChange={(e) => setAltText(e.target.value)}
                        placeholder="Describe image for screen readers..."
                        className="w-full px-3 py-2 bg-background border border-border-subtle rounded-lg text-sm text-primary-text focus:border-accent focus:outline-none"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-mono text-secondary-text">Asset Type</label>
                    <select
                        value={fileType}
                        onChange={(e) => setFileType(e.target.value as 'image' | 'video' | 'document')}
                        className="w-full px-3 py-2 bg-background border border-border-subtle rounded-lg text-sm text-primary-text focus:border-accent focus:outline-none"
                    >
                        <option value="image">Image (JPG, PNG, WebP)</option>
                        <option value="video">Hero Video (MP4, WebM)</option>
                        <option value="document">Document / CV (PDF)</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-mono text-secondary-text">Select File *</label>
                    <input
                        type="file"
                        required
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="w-full px-3 py-1.5 bg-background border border-border-subtle rounded-lg text-xs text-secondary-text file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-mono file:bg-accent/10 file:text-accent"
                    />
                </div>
            </div>

            {fileType === 'image' && (
                <label className="flex items-center gap-2 text-xs text-primary-text cursor-pointer pt-1">
                    <input
                        type="checkbox"
                        checked={isHeroBg}
                        onChange={(e) => setIsHeroBg(e.target.checked)}
                        className="accent-[#C4F269]"
                    />
                    <span>Include in Rotating Hero Background Collection</span>
                </label>
            )}

            <Button type="submit" variant="accent" size="md" disabled={uploading || !file}>
                {uploading ? 'Uploading to Storage...' : 'Upload Asset'}
            </Button>
        </form>
    );
}