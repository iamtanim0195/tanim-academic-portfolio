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

export async function addHeroMediaAction(formData: FormData) {
    const supabase = await verifyAdmin();

    const raw = {
        label: formData.get('label'),
        mediaType: formData.get('mediaType'),
        url: formData.get('url'),
        setActive: formData.get('setActive') === 'on',
    };

    const parsed = heroMediaSchema.safeParse(raw);
    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message || 'Invalid media data' };
    }

    // Deactivate previous items if this one is set active
    if (parsed.data.setActive) {
        await supabase
            .from('hero_media_items')
            .update({ is_active: false })
            .neq('id', '00000000-0000-0000-0000-000000000000');
    }

    const { error } = await supabase.from('hero_media_items').insert({
        label: parsed.data.label.trim(),
        media_type: parsed.data.mediaType,
        url: parsed.data.url.trim(),
        is_active: parsed.data.setActive,
    });

    if (error) return { error: error.message };

    revalidatePath('/');
    return { success: true };
}

export async function setActiveHeroMediaAction(id: string) {
    const supabase = await verifyAdmin();

    await supabase.from('hero_media_items').update({ is_active: false }).neq('id', id);
    const { error } = await supabase
        .from('hero_media_items')
        .update({ is_active: true })
        .eq('id', id);

    if (error) return { error: error.message };

    revalidatePath('/');
    return { success: true };
}

export async function deleteHeroMediaAction(id: string) {
    const supabase = await verifyAdmin();
    const { error } = await supabase.from('hero_media_items').delete().eq('id', id);

    if (error) return { error: error.message };

    revalidatePath('/');
    return { success: true };
}