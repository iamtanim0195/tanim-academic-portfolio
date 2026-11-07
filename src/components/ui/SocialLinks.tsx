import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { HiAcademicCap, HiMail } from 'react-icons/hi';
import { cn } from '@/lib/utils';

interface SocialLinksProps {
    githubUrl?: string;
    linkedinUrl?: string;
    googleScholarUrl?: string;
    email?: string;
    className?: string;
    iconSize?: number;
}

export function SocialLinks({
    githubUrl = 'https://github.com',
    linkedinUrl = 'https://linkedin.com',
    googleScholarUrl = 'https://scholar.google.com',
    email = 'academic@example.com',
    className,
    iconSize = 18,
}: SocialLinksProps) {
    const links = [
        { label: 'GitHub', href: githubUrl, icon: FaGithub },
        { label: 'LinkedIn', href: linkedinUrl, icon: FaLinkedin },
        { label: 'Google Scholar', href: googleScholarUrl, icon: HiAcademicCap },
        { label: 'Email', href: `mailto:${email}`, icon: HiMail },
    ];

    return (
        <div className={cn('flex items-center gap-3', className)}>
            {links.map((link) => {
                const Icon = link.icon;
                return (
                    <a
                        key={link.label}
                        href={link.href}
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        aria-label={link.label}
                        className="p-2 rounded-lg bg-surface border border-border-subtle text-secondary-text hover:text-accent hover:border-accent/40 transition-all hover:scale-105"
                    >
                        <Icon size={iconSize} />
                    </a>
                );
            })}
        </div>
    );
}