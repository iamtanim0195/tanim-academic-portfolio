import React from 'react';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isAdminUser } from '@/lib/auth';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { DeletePublicationButton } from '@/components/admin/DeletePublicationButton';
import { Plus, Pencil, ExternalLink, BookOpen } from 'lucide-react';

export default async function PublicationsPage() {
    const admin = await isAdminUser();
    const supabase = await createServerSupabaseClient();

    let query = supabase
        .from('publications')
        .select('*')
        .order('created_at', { ascending: false });

    if (!admin) {
        query = query.eq('published', true);
    }

    const { data: publications } = await query;

    return (
        <main className="py-12">
            <Container className="max-w-5xl space-y-10">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <SectionHeading
                        eyebrow="RESEARCH OUTPUTS"
                        title="Publications & Preprints"
                        subtitle="Peer-reviewed conference papers, journal articles, workshop submissions, and research manuscripts."
                        className="mb-0 sm:mb-0"
                    />

                    {/* Visible ONLY when logged in as Admin */}
                    {admin && (
                        <Link href="/admin/publications/new">
                            <Button variant="accent" size="md" className="gap-2 shrink-0">
                                <Plus size={16} />
                                <span>Add New Publication</span>
                            </Button>
                        </Link>
                    )}
                </div>

                {!publications || publications.length === 0 ? (
                    <div className="p-12 bg-surface border border-border-subtle rounded-xl text-center space-y-3">
                        <BookOpen size={32} className="text-accent mx-auto opacity-80" />
                        <p className="text-sm text-secondary-text">No publications added yet.</p>
                        {admin && (
                            <Link href="/admin/publications/new" className="inline-block">
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Plus size={14} /> Add First Publication
                                </Button>
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {publications.map((pub) => (
                            <article
                                key={pub.id}
                                className="p-6 bg-surface border border-border-subtle rounded-xl space-y-4 hover:border-accent/40 transition-colors"
                            >
                                {/* Admin Toolbar */}
                                {admin && (
                                    <div className="flex items-center justify-between gap-2 pb-3 border-b border-border-subtle">
                                        <StatusBadge published={pub.published} />
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/admin/publications/${pub.id}`}
                                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-background border border-border-subtle text-secondary-text hover:text-accent text-xs font-mono transition-colors"
                                            >
                                                <Pencil size={13} />
                                                <span>Edit</span>
                                            </Link>
                                            <DeletePublicationButton
                                                publicationId={pub.id}
                                                publicationTitle={pub.title}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    {/* Optional Venue & Year Badge */}
                                    {(pub.venue || pub.year) && (
                                        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-accent">
                                            {pub.venue && <span>{pub.venue}</span>}
                                            {pub.venue && pub.year && <span>•</span>}
                                            {pub.year && <span>{pub.year}</span>}
                                        </div>
                                    )}

                                    {/* Title */}
                                    <h2 className="text-lg sm:text-xl font-bold text-primary-text leading-snug">
                                        {pub.paper_url ? (
                                            <a
                                                href={pub.paper_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-accent transition-colors"
                                            >
                                                {pub.title}
                                            </a>
                                        ) : (
                                            pub.title
                                        )}
                                    </h2>

                                    {/* Optional Authors */}
                                    {pub.authors && pub.authors.length > 0 && (
                                        <p className="text-xs font-mono text-secondary-text">
                                            {pub.authors.join(', ')}
                                        </p>
                                    )}
                                </div>

                                {/* Description */}
                                {pub.description && (
                                    <p className="text-xs sm:text-sm text-secondary-text leading-relaxed whitespace-pre-line">
                                        {pub.description}
                                    </p>
                                )}

                                {/* External Publication Link */}
                                {pub.paper_url && (
                                    <div className="pt-2">
                                        <a
                                            href={pub.paper_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background border border-border-subtle text-xs font-mono text-accent hover:border-accent/50 transition-colors"
                                        >
                                            <ExternalLink size={13} />
                                            <span>Read Publication</span>
                                        </a>
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>
                )}
            </Container>
        </main>
    );
}