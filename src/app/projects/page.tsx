import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SkillBadge } from '@/components/ui/SkillBadge';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

const mockProjects = [
    {
        id: '1',
        slug: 'autonomous-nav-ros2',
        title: 'ROS2 Autonomous Mobile Robot Navigation',
        summary: 'LIDAR-based SLAM and dynamic trajectory planning for differential drive indoor mobile robots.',
        technologies: ['ROS2', 'C++', 'Python', 'Nav2', 'Gazebo'],
        researchProblem: 'Navigating highly constrained dynamic indoor corridors with low-cost sensors.',
        githubUrl: 'https://github.com',
        demoUrl: 'https://demo.example.com',
    },
    {
        id: '2',
        slug: 'deep-rl-quadruped',
        title: 'Deep RL Locomotion Policy for Quadruped',
        summary: 'PPO policy trained in PyBullet simulation and transferred zero-shot to physical quadruped robot.',
        technologies: ['PyTorch', 'Python', 'PyBullet', 'RLlib', 'CUDA'],
        researchProblem: 'Sim-to-real domain gap in legged robotic locomotion.',
        githubUrl: 'https://github.com',
        paperUrl: 'https://arxiv.org',
    },
];

export default function ProjectsPage() {
    return (
        <main className="py-12">
            <Container className="space-y-10">
                <SectionHeading
                    eyebrow="PORTFOLIO"
                    title="Research & Engineering Projects"
                    subtitle="Explore autonomous systems, reinforcement learning experiments, and computer vision pipelines."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {mockProjects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-surface border border-border-subtle rounded-xl p-6 flex flex-col justify-between space-y-6 hover:border-accent/40 transition-colors"
                        >
                            <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                    <h3 className="text-xl font-bold text-primary-text hover:text-accent transition-colors">
                                        <Link href={`/projects/${project.slug}`}>
                                            {project.title}
                                        </Link>
                                    </h3>
                                    <Link href={`/projects/${project.slug}`} className="text-secondary-text hover:text-accent">
                                        <ArrowUpRight size={20} />
                                    </Link>
                                </div>

                                <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
                                    {project.summary}
                                </p>

                                <div className="p-3 bg-background/60 border border-border-subtle rounded-lg space-y-1">
                                    <span className="text-[11px] font-mono text-accent uppercase tracking-wider">// Research Focus</span>
                                    <p className="text-xs text-primary-text">{project.researchProblem}</p>
                                </div>

                                <div className="flex flex-wrap gap-1.5">
                                    {project.technologies.map((tech) => (
                                        <SkillBadge key={tech} name={tech} />
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-4 border-t border-border-subtle text-xs">
                                {project.githubUrl && (
                                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-secondary-text hover:text-accent">
                                        <FaGithub /> Source Code
                                    </a>
                                )}
                                {project.paperUrl && (
                                    <a href={project.paperUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-secondary-text hover:text-accent">
                                        <ExternalLink size={14} /> Research Paper
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </main>
    );
}