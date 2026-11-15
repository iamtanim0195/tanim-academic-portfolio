import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
    published: boolean;
}

export function StatusBadge({ published }: StatusBadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium border',
                published
                    ? 'bg-accent/10 text-accent border-accent/30'
                    : 'bg-background text-secondary-text border-border-subtle'
            )}
        >
            <span
                className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    published ? 'bg-accent' : 'bg-secondary-text'
                )}
            />
            {published ? 'Published' : 'Draft'}
        </span>
    );
}