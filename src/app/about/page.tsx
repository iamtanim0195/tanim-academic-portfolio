import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { Download, GraduationCap, Award, Target } from 'lucide-react';

export default function AboutPage() {
    return (
        <main className="py-12">
            <Container className="space-y-12">
                <SectionHeading
                    eyebrow="BIOGRAPHY"
                    title="About Me"
                    subtitle="Computer Science & Engineering student aiming for advanced research in autonomous intelligent systems."
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-6 text-sm sm:text-base text-secondary-text leading-relaxed">
                        <p>
                            I am an undergraduate Computer Science and Engineering student with a core academic focus on <strong className="text-primary-text">Robotics, Deep Reinforcement Learning, and Computer Vision</strong>. My work centers on creating adaptive control algorithms and perception systems capable of operating under unmapped, dynamic environments.
                        </p>
                        <p>
                            Currently preparing applications for fully funded Master&apos;s degree research programs, including prestigious international opportunities such as Erasmus Mundus Joint Master Degrees. I aspire to bridge the gap between theoretical machine learning models and real-time physical robotic deployment.
                        </p>

                        <div className="p-6 bg-surface border border-border-subtle rounded-xl space-y-3">
                            <div className="flex items-center gap-2 text-accent font-mono text-xs font-bold">
                                <Target size={16} />
                                <span>RESEARCH OBJECTIVE</span>
                            </div>
                            <p className="text-xs sm:text-sm text-primary-text font-medium">
                                Developing robust sample-efficient reinforcement learning frameworks combined with spatial vision perception for multi-agent autonomous robotic navigation.
                            </p>
                        </div>

                        <div className="pt-4 flex items-center gap-4">
                            <a href="#cv" download>
                                <Button variant="accent" size="md" className="gap-2">
                                    <Download size={16} />
                                    <span>Download Full Academic CV</span>
                                </Button>
                            </a>
                            <Link href="/contact">
                                <Button variant="outline" size="md">
                                    Get in Touch
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <div className="p-6 bg-surface border border-border-subtle rounded-xl space-y-4">
                            <h3 className="font-mono text-xs uppercase tracking-wider text-accent font-semibold flex items-center gap-2">
                                <GraduationCap size={16} />
                                <span>Academic Status</span>
                            </h3>
                            <div className="space-y-2 text-xs">
                                <div>
                                    <p className="text-secondary-text">Degree Program</p>
                                    <p className="font-semibold text-primary-text">B.Sc. in Computer Science & Eng.</p>
                                </div>
                                <div>
                                    <p className="text-secondary-text">Focus Area</p>
                                    <p className="font-semibold text-primary-text">Robotics & Artificial Intelligence</p>
                                </div>
                                <div>
                                    <p className="text-secondary-text">Target Goal</p>
                                    <p className="font-semibold text-accent">Erasmus Mundus & MS Scholarships</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-surface border border-border-subtle rounded-xl space-y-4">
                            <h3 className="font-mono text-xs uppercase tracking-wider text-accent font-semibold flex items-center gap-2">
                                <Award size={16} />
                                <span>Key Milestones</span>
                            </h3>
                            <ul className="space-y-2 text-xs text-secondary-text">
                                <li className="flex items-start gap-2">
                                    <span className="text-accent">•</span>
                                    <span>Robotics Lab Research Assistant</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-accent">•</span>
                                    <span>Published Conference Co-Author</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-accent">•</span>
                                    <span>National Robotics Contest Finalist</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </Container>
        </main>
    );
}