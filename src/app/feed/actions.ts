'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { feedPostSchema, commentSchema } from '@/lib/validations';
import { isAdminUser } from '@/lib/auth';

async function verifyAdmin() {
    const authorized = await isAdminUser();
    if (!authorized) {
        throw new Error('Unauthorized: Admin access required.');
    }
    return await createServerSupabaseClient();
}

// --- ADMIN POST ACTIONS ---

export async function createFeedPostAction(formData: FormData) {
    const supabase = await verifyAdmin();

    const raw = {
        caption: formData.get('caption'),
        imageUrl: formData.get('imageUrl') || '',
        published: formData.get('published') === 'on',
    };

    const parsed = feedPostSchema.safeParse(raw);
    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message || 'Invalid post data' };
    }

    const slug = `post-${Date.now()}`;
    const title = parsed.data.caption.slice(0, 60);

    const { error } = await supabase.from('activities').insert({
        title,
        slug,
        summary: parsed.data.caption,
        content: parsed.data.caption,
        image_url: parsed.data.imageUrl || null,
        category: 'research_update',
        published: parsed.data.published,
        published_at: new Date().toISOString(),
    });

    if (error) return { error: error.message };

    revalidatePath('/feed');
    revalidatePath('/');
    return { success: true };
}

export async function updateFeedPostAction(id: string, formData: FormData) {
    const supabase = await verifyAdmin();

    const raw = {
        caption: formData.get('caption'),
        imageUrl: formData.get('imageUrl') || '',
        published: formData.get('published') === 'on',
    };

    const parsed = feedPostSchema.safeParse(raw);
    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message || 'Invalid post data' };
    }

    const { error } = await supabase
        .from('activities')
        .update({
            title: parsed.data.caption.slice(0, 60),
            summary: parsed.data.caption,
            content: parsed.data.caption,
            image_url: parsed.data.imageUrl || null,
            published: parsed.data.published,
        })
        .eq('id', id);

    if (error) return { error: error.message };

    revalidatePath('/feed');
    revalidatePath('/');
    return { success: true };
}

export async function deleteFeedPostAction(id: string) {
    const supabase = await verifyAdmin();
    const { error } = await supabase.from('activities').delete().eq('id', id);

    if (error) return { error: error.message };

    revalidatePath('/feed');
    revalidatePath('/');
    return { success: true };
}

// --- ADMIN COMMENT MODERATION ---

export async function deleteCommentAction(commentId: string) {
    const supabase = await verifyAdmin();
    const { error } = await supabase
        .from('activity_comments')
        .delete()
        .eq('id', commentId);

    if (error) return { error: error.message };

    revalidatePath('/feed');
    return { success: true };
}

// --- PUBLIC REACTIONS & COMMENTS ---

export async function toggleLikeAction(activityId: string, liked: boolean) {
    const supabase = await createServerSupabaseClient();
    const delta = liked ? 1 : -1;

    const { data, error } = await supabase.rpc('increment_activity_likes', {
        row_id: activityId,
        delta,
    });

    if (error) return { error: error.message };

    revalidatePath('/feed');
    return { success: true, likesCount: data as number };
}

export async function addCommentAction(formData: FormData) {
    const raw = {
        activityId: formData.get('activityId'),
        authorName: formData.get('authorName'),
        content: formData.get('content'),
        honeypot: formData.get('website') || '',
    };

    const parsed = commentSchema.safeParse(raw);
    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message || 'Invalid comment' };
    }

    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from('activity_comments').insert({
        activity_id: parsed.data.activityId,
        author_name: parsed.data.authorName.trim(),
        content: parsed.data.content.trim(),
    });

    if (error) return { error: error.message };

    revalidatePath('/feed');
    return { success: true };
}