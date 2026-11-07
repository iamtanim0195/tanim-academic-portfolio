'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, Terminal } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { NavItem } from '@/types';

const defaultNavItems: NavItem[] = [
    { id: '1', label: 'Home', href: '/', order: 1, isEnabled: true },
    { id: '2', label: 'About', href: '/about', order: 2, isEnabled: true },
    { id: '3', label: 'Research', href: '/research', order: 3, isEnabled: true },
    { id: '4', label: 'Projects', href: '/projects', order: 4, isEnabled: true },
    { id: '5', label: 'Publications', href: '/publications', order: 5, isEnabled: true },
    { id: '6', label: 'Feed', href: '/feed', order: 6, isEnabled: true },
    { id: '7', label: 'Contact', href: '/contact', order: 7, isEnabled: true },
];

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur-md border-b border-border-subtle">
            <Container className="flex items-center justify-between h-16">
                {/* Monogram Brand */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="p-1.5 bg-accent/10 border border-accent/30 rounded-lg text-accent group-hover:bg-accent group-hover:text-background transition-all">
                        <Terminal size={18} />
                    </div>
                    <span className="font-mono text-sm font-bold tracking-tight text-primary-text group-hover:text-accent transition-colors">
                        CSE<span className="text-accent">.Lab</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center space-x-6">
                    {defaultNavItems.map((item) => (
                        <Link
                            key={item.id}
                            href={item.href}
                            className="text-xs uppercase tracking-wider font-mono text-secondary-text hover:text-accent transition-colors"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Mobile Toggle Button */}
                <button
                    onClick={() => setMobileMenuOpen(true)}
                    className="p-2 lg:hidden text-secondary-text hover:text-primary-text rounded-lg hover:bg-surface"
                    aria-label="Open menu"
                >
                    <Menu size={20} />
                </button>
            </Container>

            {/* Mobile Menu Drawer */}
            <MobileMenu
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                items={defaultNavItems}
            />
        </header>
    );
}