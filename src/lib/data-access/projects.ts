import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Project } from '@/types';

export async function getPublishedProjects(): Promise<Project[]> {
    try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('published', true)
            .order('order_index', { ascending: true });

        if (error || !data) return [];

        return data.map((item) => ({
            id: item.id,
            slug: item.slug,
            title: item.title,
            summary: item.summary,
            description: item.description,
            imageUrl: item.image_url,
            technologies: item.technologies || [],
            researchProblem: item.research_problem,
            methodology: item.methodology,
            githubUrl: item.github_url,
            demoUrl: item.demo_url,
            paperUrl: item.paper_url,
            isFeatured: item.is_featured,
            published: item.published,
        }));
    } catch (err) {
        console.error('Failed to fetch published projects:', err);
        return [];
    }
}