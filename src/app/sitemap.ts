import type { MetadataRoute } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const staticRoutes = [
        '',
        '/about',
        '/research',
        '/projects',
        '/publications',
        '/feed',
        '/education',
        '/experience',
        '/skills',
        '/contact',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    try {
        const supabase = await createServerSupabaseClient();

        const [{ data: projects }, { data: activities }] = await Promise.all([
            supabase.from('projects').select('slug, updated_at').eq('published', true),
            supabase.from('activities').select('slug, created_at').eq('published', true),
        ]);

        const projectRoutes = (projects || []).map((p) => ({
            url: `${baseUrl}/projects/${p.slug}`,
            lastModified: new Date(p.updated_at || Date.now()),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        }));

        const activityRoutes = (activities || []).map((a) => ({
            url: `${baseUrl}/feed/${a.slug}`,
            lastModified: new Date(a.created_at || Date.now()),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }));

        return [...staticRoutes, ...projectRoutes, ...activityRoutes];
    } catch {
        return staticRoutes;
    }
}