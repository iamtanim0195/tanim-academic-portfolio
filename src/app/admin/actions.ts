'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { projectSchema, publicationSchema } from '@/lib/validations';

async function verifyAdmin() {
    const supabase = await createServerSupabaseClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized: Admin authentication required.');
    }
    return supabase;
}

// --- PROJECTS ACTIONS ---

export async function createProjectAction(formData: FormData) {
    const supabase = await verifyAdmin();

    const rawData = {
        title: formData.get('title'),
        slug: formData.get('slug'),
        summary: formData.get('summary'),
        researchProblem: formData.get('researchProblem') || '',
        methodology: formData.get('methodology') || '',
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
        research_problem: parsed.data.researchProblem,
        methodology: parsed.data.methodology,
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

export async function toggleProjectPublishAction(id: string, currentStatus: boolean) {
    const supabase = await verifyAdmin();
    const { error } = await supabase
        .from('projects')
        .update({ published: !currentStatus })
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

// --- PUBLICATIONS ACTIONS ---

export async function createPublicationAction(formData: FormData) {
    const supabase = await verifyAdmin();

    const rawData = {
        title: formData.get('title'),
        authors: formData.get('authors') || '',
        venue: formData.get('venue'),
        year: formData.get('year'),
        doi: formData.get('doi') || '',
        paperUrl: formData.get('paperUrl') || '',
        isFeatured: formData.get('isFeatured') === 'on',
        published: formData.get('published') === 'on',
    };

    const parsed = publicationSchema.safeParse(rawData);
    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message || 'Invalid publication data' };
    }

    const { error } = await supabase.from('publications').insert({
        title: parsed.data.title,
        authors: parsed.data.authors,
        venue: parsed.data.venue,
        year: parsed.data.year,
        doi: parsed.data.doi || null,
        paper_url: parsed.data.paperUrl || null,
        is_featured: parsed.data.isFeatured,
        published: parsed.data.published,
    });

    if (error) return { error: error.message };

    revalidatePath('/publications');
    revalidatePath('/');
    revalidatePath('/admin/publications');
    return { success: true };
}