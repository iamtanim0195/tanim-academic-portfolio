"use client"
import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SocialLinks } from '@/components/ui/SocialLinks';

export function Footer() {
    return (
        <footer className="w-full bg-surface border-t border-border-subtle mt-auto py-12">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-border-subtle">

                    {/* Identity Column */}
                    <div className="space-y-3">
                        <div className="font-mono text-sm font-bold text-primary-text">
                            ACADEMIC & RESEARCH PORTFOLIO
                        </div>
                        <p className="text-xs text-secondary-text max-w-sm leading-relaxed">
                            Targeting international research programs & fully funded Master&apos;s scholarships in Robotics, Computer Vision, and Reinforcement Learning.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-2">
                        <h3 className="font-mono text-xs uppercase tracking-widest text-accent font-semibold">
                            Navigation
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-xs text-secondary-text">
                            <Link href="/research" className="hover:text-primary-text transition-colors">Research Focus</Link>
                            <Link href="/projects" className="hover:text-primary-text transition-colors">Projects</Link>
                            <Link href="/publications" className="hover:text-primary-text transition-colors">Publications</Link>
                            <Link href="/feed" className="hover:text-primary-text transition-colors">Activity Feed</Link>
                            <Link href="/about" className="hover:text-primary-text transition-colors">CV & Bio</Link>
                            <Link href="/contact" className="hover:text-primary-text transition-colors">Contact</Link>
                        </div>
                    </div>

                    {/* Social & Contact */}
                    <div className="space-y-3">
                        <h3 className="font-mono text-xs uppercase tracking-widest text-accent font-semibold">
                            Connect
                        </h3>
                        <SocialLinks />
                        <p className="text-xs text-secondary-text">
                            Open for research collaborations and graduate opportunities.
                        </p>
                    </div>

                </div>

                <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-secondary-text gap-4">
                    <p>© {new Date().getFullYear()} CSE Academic Portfolio. Built with Next.js & Supabase.</p>
                    <div className="flex items-center gap-4">
                        <Link href="/admin/login" className="hover:text-accent font-mono text-[11px] transition-colors">
                            [Admin Portal]
                        </Link>
                    </div>
                </div>
            </Container>
        </footer>
    );
}