'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    User,
    FolderKanban,
    BookOpen,
    Activity,
    Award,
    GraduationCap,
    Briefcase,
    Layers,
    Settings,
    Image as ImageIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const adminLinks = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Profile', href: '/admin/profile', icon: User },
    { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
    { label: 'Publications', href: '/admin/publications', icon: BookOpen },
    { label: 'Activity Feed', href: '/admin/activities', icon: Activity },
    { label: 'Education', href: '/admin/education', icon: GraduationCap },
    { label: 'Experience', href: '/admin/experience', icon: Briefcase },
    { label: 'Skills', href: '/admin/skills', icon: Award },
    { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
    { label: 'Sections', href: '/admin/sections', icon: Layers },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-surface border-r border-border-subtle min-h-screen p-4 flex flex-col justify-between shrink-0 hidden md:flex">
            <div className="space-y-6">
                <div className="px-3 py-2 border-b border-border-subtle">
                    <span className="font-mono text-xs font-bold text-accent">// ADMIN PANEL</span>
                    <p className="text-xs text-primary-text font-semibold">Academic CMS</p>
                </div>

                <nav className="space-y-1">
                    {adminLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
                                    isActive
                                        ? 'bg-accent/10 text-accent border border-accent/20'
                                        : 'text-secondary-text hover:text-primary-text hover:bg-background'
                                )}
                            >
                                <Icon size={16} />
                                <span>{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-3 border-t border-border-subtle">
                <Link href="/" className="text-xs font-mono text-secondary-text hover:text-accent">
                    ← Back to Public Site
                </Link>
            </div>
        </aside>
    );
}