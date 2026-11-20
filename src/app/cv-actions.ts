'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { cvLinkSchema } from '@/lib/validations';
import { isAdminUser } from '@/lib/auth';

async function verifyAdmin() {
    const authorized = await isAdminUser();
    if (!authorized) {
        throw new Error('Unauthorized: Admin access required.');
    }
    return await createServerSupabaseClient();
}

export async function addCvLinkAction(formData: FormData) {
    const supabase = await verifyAdmin();

    const raw = {
        label: formData.get('label'),
        url: formData.get('url'),
        setActive: formData.get('setActive') === 'on',
    };

    const parsed = cvLinkSchema.safeParse(raw);
    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message || 'Invalid CV data' };
    }

    // If setting this new CV as active, deactivate all others first
    if (parsed.data.setActive) {
        await supabase.from('cv_links').update({ is_active: false }).neq('id', '00000000-0000-0000-0000-000000000000');
    }

    const { error } = await supabase.from('cv_links').insert({
        label: parsed.data.label.trim(),
        url: parsed.data.url.trim(),
        is_active: parsed.data.setActive,
    });

    if (error) return { error: error.message };

    revalidatePath('/');
    return { success: true };
}

export async function setActiveCvAction(id: string) {
    const supabase = await verifyAdmin();

    // Deactivate all links, then activate the selected one
    await supabase.from('cv_links').update({ is_active: false }).neq('id', id);
    const { error } = await supabase
        .from('cv_links')
        .update({ is_active: true })
        .eq('id', id);

    if (error) return { error: error.message };

    revalidatePath('/');
    return { success: true };
}

export async function deleteCvLinkAction(id: string) {
    const supabase = await verifyAdmin();
    const { error } = await supabase.from('cv_links').delete().eq('id', id);

    if (error) return { error: error.message };

    revalidatePath('/');
    return { success: true };
}