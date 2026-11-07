import React from 'react';
import { cn } from '@/lib/utils';

interface SkillBadgeProps {
    name: string;
    className?: string;
}

export function SkillBadge({ name, className }: SkillBadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center px-3 py-1 rounded-md text-xs font-mono font-medium',
                'bg-surface border border-border-subtle text-secondary-text hover:text-accent hover:border-accent/40 transition-colors',
                className
            )}
        >
            {name}
        </span>
    );
}