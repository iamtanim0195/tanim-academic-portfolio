import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
    eyebrow?: string;
    title: string;
    subtitle?: string;
    className?: string;
    align?: 'left' | 'center';
}

export function SectionHeading({
    eyebrow,
    title,
    subtitle,
    className,
    align = 'left',
}: SectionHeadingProps) {
    return (
        <div
            className={cn(
                'mb-10 sm:mb-14 space-y-2',
                align === 'center' && 'text-center',
                className
            )}
        >
            {eyebrow && (
                <span className="text-xs uppercase tracking-widest text-accent font-mono font-semibold">
          // {eyebrow}
                </span>
            )}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary-text tracking-tight">
                {title}
            </h2>
            {subtitle && (
                <p className="text-secondary-text text-base sm:text-lg max-w-3xl leading-relaxed">
                    {subtitle}
                </p>
            )}
        </div>
    );
}