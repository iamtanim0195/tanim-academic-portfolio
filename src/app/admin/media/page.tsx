import React from 'react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { MediaUploader } from '@/components/admin/MediaUploader';
import { FileText, Film, Image as ImageIcon } from 'lucide-react';

export default async function AdminMediaPage() {
    const supabase = await createServerSupabaseClient();
    const { data: assets } = await supabase
        .from('media_assets')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-8 max-w-6xl">
            <div>
                <h1 className="text-2xl font-extrabold text-primary-text">Media Library</h1>
                <p className="text-xs font-mono text-accent mt-1">// SUPABASE STORAGE ASSETS & CV DOCUMENTS</p>
            </div>

            <MediaUploader />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {!assets || assets.length === 0 ? (
                    <div className="col-span-full p-8 bg-surface border border-border-subtle rounded-xl text-center text-xs text-secondary-text">
                        No media assets uploaded yet. Upload your profile photo, hero video, or CV PDF above.
                    </div>
                ) : (
                    assets.map((asset) => (
                        <div
                            key={asset.id}
                            className="bg-surface border border-border-subtle rounded-xl overflow-hidden flex flex-col justify-between"
                        >
                            <div className="h-40 bg-background flex items-center justify-center overflow-hidden border-b border-border-subtle">
                                {asset.file_type === 'image' ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={asset.file_url} alt={asset.alt_text} className="w-full h-full object-cover" />
                                ) : asset.file_type === 'video' ? (
                                    <Film size={36} className="text-accent" />
                                ) : (
                                    <FileText size={36} className="text-accent" />
                                )}
                            </div>

                            <div className="p-4 space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-bold text-primary-text truncate">{asset.title}</span>
                                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-accent/10 text-accent">
                                        {asset.file_type}
                                    </span>
                                </div>
                                <p className="text-[11px] text-secondary-text truncate">{asset.alt_text}</p>
                                <input
                                    readOnly
                                    value={asset.file_url}
                                    className="w-full px-2 py-1 bg-background border border-border-subtle rounded text-[10px] font-mono text-secondary-text"
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}