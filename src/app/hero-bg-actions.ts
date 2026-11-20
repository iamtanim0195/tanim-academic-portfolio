'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { heroMediaSchema } from '@/lib/validations';
import { isAdminUser } from '@/lib/auth';

async function verifyAdmin() {
    const authorized = await isAdminUser();
    if (!authorized) {
        throw new Error('Unauthorized: Admin access required.');
    }
    return await createServerSupabaseClient();
}

export async function addHeroBgAction(formData: FormData) {
    const supabase = await verifyAdmin();

    const raw = {
        label: formData.get('label'),
        mediaType: formData.get('mediaType'),
        url: formData.get('url'),
        setActive: formData.get('setActive') === 'on',
    };

    const parsed = heroMediaSchema.safeParse(raw);
    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message || 'Invalid background media data' };
    }

    // If adding an active video, deactivate other active items so video plays cleanly
    if (parsed.data.setActive && parsed.data.mediaType === 'video') {
        await supabase
            .from('hero_bg_media')
            .update({ is_active: false })
            .neq('id', '00000000-0000-0000-0000-000000000000');
    }

    const { error } = await supabase.from('hero_bg_media').insert({
        label: parsed.data.label.trim(),
        media_type: parsed.data.mediaType,
        url: parsed.data.url.trim(),
        is_active: parsed.data.setActive,
    });

    if (error) return { error: error.message };

    revalidatePath('/');
    revalidatePath('/admin/media');
    return { success: true };
}

export async function toggleHeroBgActiveAction(id: string, currentActive: boolean) {
    const supabase = await verifyAdmin();

    const { error } = await supabase
        .from('hero_bg_media')
        .update({ is_active: !currentActive })
        .eq('id', id);

    if (error) return { error: error.message };

    revalidatePath('/');
    revalidatePath('/admin/media');
    return { success: true };
}

export async function deleteHeroBgAction(id: string) {
    const supabase = await verifyAdmin();
    const { error } = await supabase.from('hero_bg_media').delete().eq('id', id);

    if (error) return { error: error.message };

    revalidatePath('/');
    revalidatePath('/admin/media');
    return { success: true };
}

// Unified delete action for /admin/media hub
export async function deleteUnifiedMediaAction(
    source: 'media_assets' | 'hero_media_items' | 'hero_bg_media' | 'cv_links',
    id: string,
    storageUrl?: string
) {
    const supabase = await verifyAdmin();

    // If file lives in our Supabase 'portfolio-media' bucket, remove it from Storage too
    if (storageUrl && storageUrl.includes('/portfolio-media/')) {
        const parts = storageUrl.split('/portfolio-media/');
        if (parts[1]) {
            await supabase.storage.from('portfolio-media').remove([decodeURIComponent(parts[1])]);
        }
    }

    const { error } = await supabase.from(source).delete().eq('id', id);
    if (error) return { error: error.message };

    revalidatePath('/');
    revalidatePath('/admin/media');
    return { success: true };
}