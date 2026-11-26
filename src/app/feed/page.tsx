import React from 'react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isAdminUser } from '@/lib/auth';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FeedPostComposer } from '@/components/feed/FeedPostComposer';
import { FeedPostCard, FeedPost } from '@/components/feed/FeedPostCard';

export const instant = false;

export default async function FeedPage() {
    const admin = await isAdminUser();
    const supabase = await createServerSupabaseClient();

    let query = supabase
        .from('activities')
        .select(
            `
      id,
      summary,
      image_url,
      likes_count,
      published,
      published_at,
      activity_comments (
        id,
        author_name,
        content,
        created_at
      )
    `
        )
        .order('published_at', { ascending: false });

    if (!admin) {
        query = query.eq('published', true);
    }

    const { data: rawPosts } = await query;

    const posts: FeedPost[] = (rawPosts || []).map((item) => ({
        id: item.id,
        summary: item.summary,
        image_url: item.image_url,
        likes_count: item.likes_count || 0,
        published: item.published,
        published_at: item.published_at,
        comments: (item.activity_comments || []).sort(
            (a: { created_at: string }, b: { created_at: string }) =>
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        ),
    }));

    return (
        <main className="py-12">
            <Container className="max-w-2xl space-y-8">
                <SectionHeading
                    eyebrow="LIVE STREAM"
                    title="Research & Academic Feed"
                    subtitle="Updates, lab milestones, paper notes, and ongoing progress."
                    className="mb-4 sm:mb-6"
                />

                {/* Admin Post Composer (Only visible when logged in as Admin) */}
                {admin && <FeedPostComposer />}

                {/* Feed Stream */}
                {posts.length === 0 ? (
                    <div className="p-12 bg-surface border border-border-subtle rounded-2xl text-center text-sm text-secondary-text">
                        No updates posted yet.
                    </div>
                ) : (
                    <div className="space-y-6">
                        {posts.map((post) => (
                            <FeedPostCard key={post.id} post={post} isAdmin={admin} />
                        ))}
                    </div>
                )}
            </Container>
        </main>
    );
}