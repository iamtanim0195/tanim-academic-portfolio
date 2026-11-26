import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isAdminUser } from '@/lib/auth';
import { Container } from '@/components/ui/Container';
import { SkillBadge } from '@/components/ui/SkillBadge';
import { SmartMedia } from '@/components/ui/SmartMedia';
import { Button } from '@/components/ui/Button';
import { DeleteProjectButton } from '@/components/admin/DeleteProjectButton';
import { ArrowLeft, ExternalLink, Pencil } from 'lucide-react';
import { FaGithub as Github } from "react-icons/fa";

export const instant = false;

interface ProjectDetailPageProps {
    params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
    const { slug } = await params;
    const admin = await isAdminUser();
    const supabase = await createServerSupabaseClient();

    let query = supabase.from('projects').select('*').eq('slug', slug);
    if (!admin) {
        query = query.eq('published', true);
    }

    const { data: project } = await query.single();

    if (!project) {
        notFound();
    }

    return (
        <main className="py-12">
            <Container className="max-w-4xl space-y-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-2 text-xs font-mono text-secondary-text hover:text-accent"
                    >
                        <ArrowLeft size={14} /> Back to All Projects
                    </Link>

                    {/* Admin Edit & Delete Buttons */}
                    {admin && (
                        <div className="flex items-center gap-2">
                            <Link
                                href={`/admin/projects/${project.id}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border-subtle text-secondary-text hover:text-accent text-xs font-mono"
                            >
                                <Pencil size={13} /> Edit Project
                            </Link>
                            <DeleteProjectButton
                                projectId={project.id}
                                projectTitle={project.title}
                                redirectAfterDelete
                            />
                        </div>
                    )}
                </div>

                {/* Title & Summary */}
                <div className="space-y-3">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-primary-text tracking-tight">
                        {project.title}
                    </h1>
                    <p className="text-secondary-text text-base leading-relaxed">
                        {project.summary}
                    </p>
                </div>

                {/* Action Links: Code & Demo */}
                {(project.github_url || project.demo_url) && (
                    <div className="flex flex-wrap items-center gap-4">
                        {project.github_url && (
                            <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                                <Button variant="accent" size="md" className="gap-2">
                                    <Github size={16} /> View Code
                                </Button>
                            </a>
                        )}
                        {project.demo_url && (
                            <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="md" className="gap-2">
                                    <ExternalLink size={16} /> Live Demo
                                </Button>
                            </a>
                        )}
                    </div>
                )}

                {/* Primary Thumbnail Image */}
                {project.image_url && (
                    <div className="space-y-2">
                        <span className="text-[11px] font-mono text-secondary-text uppercase tracking-wider">
              // Overview Visual
                        </span>
                        <SmartMedia url={project.image_url} alt={`${project.title} thumbnail`} />
                    </div>
                )}

                {/* Detailed Description */}
                {project.description && (
                    <div className="p-6 sm:p-8 bg-surface border border-border-subtle rounded-xl space-y-3">
                        <h2 className="text-xs font-mono text-accent uppercase tracking-wider">
              // Detailed Description & Methodology
                        </h2>
                        <div className="text-sm text-secondary-text leading-relaxed whitespace-pre-line">
                            {project.description}
                        </div>
                    </div>
                )}

                {/* Extra Image */}
                {project.extra_image_url && (
                    <div className="space-y-2">
                        <span className="text-[11px] font-mono text-secondary-text uppercase tracking-wider">
              // Architecture / Additional Visual
                        </span>
                        <SmartMedia url={project.extra_image_url} alt={`${project.title} extra visual`} />
                    </div>
                )}

                {/* Project Video (Upload, YouTube, or Link) */}
                {project.video_url && (
                    <div className="space-y-2">
                        <span className="text-[11px] font-mono text-secondary-text uppercase tracking-wider">
              // Video Demonstration
                        </span>
                        <SmartMedia url={project.video_url} alt={`${project.title} video demo`} />
                    </div>
                )}

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-border-subtle">
                        <h3 className="text-xs font-mono text-secondary-text uppercase tracking-wider">
                            Technologies & Tools
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech: string) => (
                                <SkillBadge key={tech} name={tech} />
                            ))}
                        </div>
                    </div>
                )}
            </Container>
        </main>
    );
}