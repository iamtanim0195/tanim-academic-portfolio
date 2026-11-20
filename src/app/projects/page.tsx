import React from 'react';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isAdminUser } from '@/lib/auth';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SkillBadge } from '@/components/ui/SkillBadge';
import { SmartMedia } from '@/components/ui/SmartMedia';
import { Button } from '@/components/ui/Button';
import { DeleteProjectButton } from '@/components/admin/DeleteProjectButton';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ArrowUpRight, ExternalLink, Plus, Pencil } from 'lucide-react';
import { FaGithub as Github } from "react-icons/fa";
import { LiveDemoPreview } from '@/components/ui/LiveDemoPreview';
import { ProjectThumbnail } from '@/components/projects/ProjectThumbnail';


export default async function ProjectsPage() {
    const admin = await isAdminUser();
    const supabase = await createServerSupabaseClient();

    let query = supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

    // Normal public users only see published projects; admin sees all (including drafts)
    if (!admin) {
        query = query.eq('published', true);
    }

    const { data: projects } = await query;

    return (
        <main className="py-12">
            <Container className="space-y-10">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <SectionHeading
                        eyebrow="PORTFOLIO"
                        title="Research & Engineering Projects"
                        subtitle="Explore autonomous systems, reinforcement learning experiments, and computer vision pipelines."
                        className="mb-0 sm:mb-0"
                    />

                    {/* Visible ONLY when logged in as Admin */}
                    {admin && (
                        <Link href="/admin/projects/new">
                            <Button variant="accent" size="md" className="gap-2 shrink-0">
                                <Plus size={16} />
                                <span>Add New Project</span>
                            </Button>
                        </Link>
                    )}
                </div>

                {!projects || projects.length === 0 ? (
                    <div className="p-12 bg-surface border border-border-subtle rounded-xl text-center space-y-3">
                        <p className="text-sm text-secondary-text">No projects published yet.</p>
                        {admin && (
                            <Link href="/admin/projects/new" className="inline-block">
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Plus size={14} /> Create First Project
                                </Button>
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="bg-surface border border-border-subtle rounded-xl overflow-hidden flex flex-col justify-between hover:border-accent/40 transition-colors"
                            >
                                <div>
                                    <ProjectThumbnail
                                        title={project.title}
                                        imageUrl={project.image_url}
                                        demoUrl={project.demo_url}
                                    />
                                    <div className="p-6 space-y-4">
                                        {/* Admin Toolbar per Project */}
                                        {admin && (
                                            <div className="flex items-center justify-between gap-2 pb-3 border-b border-border-subtle">
                                                <StatusBadge published={project.published} />
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={`/admin/projects/${project.id}`}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-background border border-border-subtle text-secondary-text hover:text-accent text-xs font-mono transition-colors"
                                                    >
                                                        <Pencil size={13} />
                                                        <span>Edit</span>
                                                    </Link>
                                                    <DeleteProjectButton
                                                        projectId={project.id}
                                                        projectTitle={project.title}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="text-xl font-bold text-primary-text hover:text-accent transition-colors">
                                                <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                                            </h3>
                                            <Link
                                                href={`/projects/${project.slug}`}
                                                className="text-secondary-text hover:text-accent shrink-0"
                                                aria-label={`Open ${project.title}`}
                                            >
                                                <ArrowUpRight size={20} />
                                            </Link>
                                        </div>

                                        <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
                                            {project.summary}
                                        </p>

                                        {project.technologies && project.technologies.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5">
                                                {project.technologies.map((tech: string) => (
                                                    <SkillBadge key={tech} name={tech} />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Code & Demo Links Footer */}
                                <div className="px-6 py-4 bg-background/40 border-t border-border-subtle flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-4">
                                        {project.github_url && (
                                            <a
                                                href={project.github_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 text-secondary-text hover:text-accent font-mono"
                                            >
                                                <Github size={14} /> Code
                                            </a>
                                        )}
                                        {project.demo_url && (
                                            <a
                                                href={project.demo_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 text-secondary-text hover:text-accent font-mono"
                                            >
                                                <ExternalLink size={14} /> Live Demo
                                            </a>
                                        )}
                                    </div>

                                    <Link
                                        href={`/projects/${project.slug}`}
                                        className="text-accent font-mono hover:underline"
                                    >
                                        Details →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Container>
        </main>
    );
}