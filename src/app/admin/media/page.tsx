import React from 'react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { MediaUploader } from '@/components/admin/MediaUploader';
import {
    UnifiedMediaManager,
    UnifiedMediaRecord,
} from '@/components/admin/UnifiedMediaManager';

export default async function AdminMediaPage() {
    const supabase = await createServerSupabaseClient();

    const [
        { data: assets },
        { data: avatars },
        { data: heroBgs },
        { data: cvLinks },
        { data: projects },
        { data: activities },
    ] = await Promise.all([
        supabase.from('media_assets').select('*').order('created_at', { ascending: false }),
        supabase.from('hero_media_items').select('*').order('created_at', { ascending: false }),
        supabase.from('hero_bg_media').select('*').order('created_at', { ascending: false }),
        supabase.from('cv_links').select('*').order('created_at', { ascending: false }),
        supabase.from('projects').select('id, title, image_url, extra_image_url, video_url'),
        supabase.from('activities').select('id, title, summary, image_url'),
    ]);

    const records: UnifiedMediaRecord[] = [];

    // 1. General Media Library Assets
    for (const a of assets || []) {
        records.push({
            id: `asset-${a.id}`,
            dbId: a.id,
            title: a.title,
            url: a.file_url,
            kind: a.file_type,
            usedIn: 'Media Library',
            deletableSource: 'media_assets',
        });
    }

    // 2. Hero Avatar Photos & Videos
    for (const h of avatars || []) {
        records.push({
            id: `avatar-${h.id}`,
            dbId: h.id,
            title: h.label,
            url: h.url,
            kind: h.media_type,
            usedIn: 'Hero Avatar',
            deletableSource: 'hero_media_items',
            isActive: h.is_active,
        });
    }

    // 3. Hero Background Media
    for (const bg of heroBgs || []) {
        records.push({
            id: `herobg-${bg.id}`,
            dbId: bg.id,
            title: bg.label,
            url: bg.url,
            kind: bg.media_type,
            usedIn: 'Hero Background',
            deletableSource: 'hero_bg_media',
            isActive: bg.is_active,
        });
    }

    // 4. CV Links & Uploaded PDFs
    for (const cv of cvLinks || []) {
        records.push({
            id: `cv-${cv.id}`,
            dbId: cv.id,
            title: cv.label,
            url: cv.url,
            kind: 'document',
            usedIn: 'CV Links',
            deletableSource: 'cv_links',
            isActive: cv.is_active,
        });
    }

    // 5. Project Images & Videos
    for (const p of projects || []) {
        if (p.image_url) {
            records.push({
                id: `proj-thumb-${p.id}`,
                dbId: p.id,
                title: `${p.title} (Thumbnail)`,
                url: p.image_url,
                kind: 'image',
                usedIn: 'Projects',
                editHref: `/admin/projects/${p.id}`,
            });
        }
        if (p.extra_image_url) {
            records.push({
                id: `proj-extra-${p.id}`,
                dbId: p.id,
                title: `${p.title} (Extra Image)`,
                url: p.extra_image_url,
                kind: 'image',
                usedIn: 'Projects',
                editHref: `/admin/projects/${p.id}`,
            });
        }
        if (p.video_url) {
            records.push({
                id: `proj-vid-${p.id}`,
                dbId: p.id,
                title: `${p.title} (Video)`,
                url: p.video_url,
                kind: 'video',
                usedIn: 'Projects',
                editHref: `/admin/projects/${p.id}`,
            });
        }
    }

    // 6. Feed Post Images
    for (const act of activities || []) {
        if (act.image_url) {
            records.push({
                id: `feed-${act.id}`,
                dbId: act.id,
                title: act.title || act.summary?.slice(0, 40) || 'Feed Post Image',
                url: act.image_url,
                kind: 'image',
                usedIn: 'Feed',
                editHref: '/feed',
            });
        }
    }

    return (
        <div className="space-y-8 max-w-6xl">
            <div>
                <h1 className="text-2xl font-extrabold text-primary-text">
                    Central Media & Links Hub
                </h1>
                <p className="text-xs font-mono text-accent mt-1">
          // ALL UPLOADED FILES, AVATARS, HERO BACKGROUNDS, CVS, PROJECTS & FEED MEDIA
                </p>
            </div>

            <MediaUploader />

            <UnifiedMediaManager items={records} />
        </div>
    );
}