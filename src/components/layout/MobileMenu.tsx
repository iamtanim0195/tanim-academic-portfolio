'use client';

import React from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { NavItem } from '@/types';
import { SocialLinks } from '@/components/ui/SocialLinks';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    items: NavItem[];
}

export function MobileMenu({ isOpen, onClose, items }: MobileMenuProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-background/80 backdrop-blur-md"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Slide-out Menu */}
            <div className="fixed top-0 right-0 bottom-0 w-full max-w-xs bg-surface border-l border-border-subtle p-6 flex flex-col justify-between shadow-2xl z-50">
                <div>
                    <div className="flex items-center justify-between pb-6 border-b border-border-subtle">
                        <span className="font-mono text-sm font-bold text-accent tracking-wider">// MENU</span>
                        <button
                            onClick={onClose}
                            aria-label="Close navigation menu"
                            className="p-2 text-secondary-text hover:text-primary-text rounded-md hover:bg-background"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <nav className="mt-6 flex flex-col space-y-4">
                        {items.filter(item => item.isEnabled).map((item) => (
                            <Link
                                key={item.id}
                                href={item.href}
                                onClick={onClose}
                                className="text-base font-medium text-secondary-text hover:text-accent transition-colors py-1"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="pt-6 border-t border-border-subtle">
                    <p className="text-xs text-secondary-text mb-3">Connect & Links</p>
                    <SocialLinks />
                </div>
            </div>
        </div>
    );
}