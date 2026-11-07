import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SkillBadge } from '@/components/ui/SkillBadge';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Github, ExternalLink, FileText } from 'lucide-react';

interface ProjectDetailPageProps {
    params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
    const { slug } = await params;

    return (
        <main className="py-12">
            <Container className="max-w-4xl space-y-8">
                <Link href="/projects" className="inline-flex items-center gap-2 text-xs font-mono text-secondary-text hover:text-accent">
                    <ArrowLeft size={14} /> Back to All Projects
                </Link>

                <div className="space-y-4">
                    <span className="px-3 py-1 rounded-full text-xs font-mono bg-accent/10 border border-accent/30 text-accent">
                        Project Overview: {slug}
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-primary-text">
                        ROS2 Autonomous Mobile Robot Navigation
                    </h1>
                    <p className="text-secondary-text text-base leading-relaxed">
                        Detailed breakdown of kinematics modeling, sensor integration, trajectory optimization, and ROS2 node deployment.
                    </p>
                </div>

                <div className="p-6 bg-surface border border-border-subtle rounded-xl space-y-4">
                    <h2 className="text-sm font-mono text-accent uppercase tracking-wider">// Methodology & Problem Statement</h2>
                    <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
                        This research addresses trajectory deviation in tight indoor corridors under sensor noisy conditions. We introduced an extended Kalman filter algorithm combined with real-time adaptive costmaps in Nav2.
                    </p>
                </div>

                <div className="space-y-3">
                    <h3 className="text-xs font-mono text-secondary-text uppercase tracking-wider">Technologies Used</h3>
                    <div className="flex flex-wrap gap-2">
                        {['ROS2', 'C++', 'Python', 'Nav2', 'Gazebo', 'Linux'].map((tech) => (
                            <SkillBadge key={tech} name={tech} />
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-border-subtle">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                        <Button variant="accent" size="md" className="gap-2">
                            <Github size={16} /> View Code
                        </Button>
                    </a>
                    <a href="https://arxiv.org" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="md" className="gap-2">
                            <FileText size={16} /> Read Paper
                        </Button>
                    </a>
                </div>
            </Container>
        </main>
    );
}