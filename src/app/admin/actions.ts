'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { projectSchema } from '@/lib/validations';
import { isAdminUser } from '@/lib/auth';
import { publicationSchema } from '@/lib/validations';

async function verifyAdmin() {
    const authorized = await isAdminUser();
    if (!authorized) {
        throw new Error('Unauthorized: Admin authentication required.');
    }
    return await createServerSupabaseClient();
}

export async function createProjectAction(formData: FormData) {
    const supabase = await verifyAdmin();

    const rawData = {
        title: formData.get('title'),
        slug: formData.get('slug'),
        summary: formData.get('summary'),
        description: formData.get('description') || '',
        imageUrl: formData.get('imageUrl') || '',
        extraImageUrl: formData.get('extraImageUrl') || '',
        videoUrl: formData.get('videoUrl') || '',
        technologies: formData.get('technologies') || '',
        githubUrl: formData.get('githubUrl') || '',
        demoUrl: formData.get('demoUrl') || '',
        paperUrl: formData.get('paperUrl') || '',
        isFeatured: formData.get('isFeatured') === 'on',
        published: formData.get('published') === 'on',
    };

    const parsed = projectSchema.safeParse(rawData);
    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message || 'Invalid project data' };
    }

    const { error } = await supabase.from('projects').insert({
        title: parsed.data.title,
        slug: parsed.data.slug,
        summary: parsed.data.summary,
        description: parsed.data.description || null,
        image_url: parsed.data.imageUrl || null,
        extra_image_url: parsed.data.extraImageUrl || null,
        video_url: parsed.data.videoUrl || null,
        technologies: parsed.data.technologies,
        github_url: parsed.data.githubUrl || null,
        demo_url: parsed.data.demoUrl || null,
        paper_url: parsed.data.paperUrl || null,
        is_featured: parsed.data.isFeatured,
        published: parsed.data.published,
    });

    if (error) return { error: error.message };

    revalidatePath('/projects');
    revalidatePath('/');
    revalidatePath('/admin/projects');
    return { success: true };
}

export async function updateProjectAction(id: string, formData: FormData) {
    const supabase = await verifyAdmin();

    const rawData = {
        title: formData.get('title'),
        slug: formData.get('slug'),
        summary: formData.get('summary'),
        description: formData.get('description') || '',
        imageUrl: formData.get('imageUrl') || '',
        extraImageUrl: formData.get('extraImageUrl') || '',
        videoUrl: formData.get('videoUrl') || '',
        technologies: formData.get('technologies') || '',
        githubUrl: formData.get('githubUrl') || '',
        demoUrl: formData.get('demoUrl') || '',
        paperUrl: formData.get('paperUrl') || '',
        isFeatured: formData.get('isFeatured') === 'on',
        published: formData.get('published') === 'on',
    };

    const parsed = projectSchema.safeParse(rawData);
    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message || 'Invalid project data' };
    }

    const { error } = await supabase
        .from('projects')
        .update({
            title: parsed.data.title,
            slug: parsed.data.slug,
            summary: parsed.data.summary,
            description: parsed.data.description || null,
            image_url: parsed.data.imageUrl || null,
            extra_image_url: parsed.data.extraImageUrl || null,
            video_url: parsed.data.videoUrl || null,
            technologies: parsed.data.technologies,
            github_url: parsed.data.githubUrl || null,
            demo_url: parsed.data.demoUrl || null,
            paper_url: parsed.data.paperUrl || null,
            is_featured: parsed.data.isFeatured,
            published: parsed.data.published,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id);

    if (error) return { error: error.message };

    revalidatePath('/projects');
    revalidatePath(`/projects/${parsed.data.slug}`);
    revalidatePath('/');
    revalidatePath('/admin/projects');
    return { success: true };
}

export async function toggleProjectPublishAction(id: string, published: boolean) {
    const supabase = await verifyAdmin();
    const { error } = await supabase
        .from('projects')
        .update({ published: !published, updated_at: new Date().toISOString() })
        .eq('id', id);

    if (error) return { error: error.message };

    revalidatePath('/projects');
    revalidatePath('/');
    revalidatePath('/admin/projects');
    return { success: true };
}

export async function deleteProjectAction(id: string) {
    const supabase = await verifyAdmin();
    const { error } = await supabase.from('projects').delete().eq('id', id);

    if (error) return { error: error.message };

    revalidatePath('/projects');
    revalidatePath('/');
    revalidatePath('/admin/projects');
    return { success: true };
}

export async function createPublicationAction(formData: FormData) {
    const supabase = await verifyAdmin();

    const rawData = {
        title: formData.get('title'),
        description: formData.get('description') || '',
        paperUrl: formData.get('paperUrl') || '',
        authors: formData.get('authors') || '',
        venue: formData.get('venue') || '',
        year: formData.get('year') || '',
        isFeatured: formData.get('isFeatured') === 'on',
        published: formData.get('published') === 'on',
    };

    const parsed = publicationSchema.safeParse(rawData);
    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message || 'Invalid publication data' };
    }

    const { error } = await supabase.from('publications').insert({
        title: parsed.data.title,
        description: parsed.data.description || null,
        paper_url: parsed.data.paperUrl || null,
        authors: parsed.data.authors,
        venue: parsed.data.venue || null,
        year: parsed.data.year,
        is_featured: parsed.data.isFeatured,
        published: parsed.data.published,
    });

    if (error) return { error: error.message };

    revalidatePath('/publications');
    revalidatePath('/');
    revalidatePath('/admin/publications');
    return { success: true };
}

export async function updatePublicationAction(id: string, formData: FormData) {
    const supabase = await verifyAdmin();

    const rawData = {
        title: formData.get('title'),
        description: formData.get('description') || '',
        paperUrl: formData.get('paperUrl') || '',
        authors: formData.get('authors') || '',
        venue: formData.get('venue') || '',
        year: formData.get('year') || '',
        isFeatured: formData.get('isFeatured') === 'on',
        published: formData.get('published') === 'on',
    };

    const parsed = publicationSchema.safeParse(rawData);
    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message || 'Invalid publication data' };
    }

    const { error } = await supabase
        .from('publications')
        .update({
            title: parsed.data.title,
            description: parsed.data.description || null,
            paper_url: parsed.data.paperUrl || null,
            authors: parsed.data.authors,
            venue: parsed.data.venue || null,
            year: parsed.data.year,
            is_featured: parsed.data.isFeatured,
            published: parsed.data.published,
        })
        .eq('id', id);

    if (error) return { error: error.message };

    revalidatePath('/publications');
    revalidatePath('/');
    revalidatePath('/admin/publications');
    return { success: true };
}

export async function deletePublicationAction(id: string) {
    const supabase = await verifyAdmin();
    const { error } = await supabase.from('publications').delete().eq('id', id);

    if (error) return { error: error.message };

    revalidatePath('/publications');
    revalidatePath('/');
    revalidatePath('/admin/publications');
    return { success: true };
}