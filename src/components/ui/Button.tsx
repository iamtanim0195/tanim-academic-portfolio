import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'accent' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export function Button({
    variant = 'accent',
    size = 'md',
    children,
    className,
    ...props
}: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50';

    const variants = {
        accent: 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-md font-semibold',
        outline: 'bg-surface border border-border-subtle text-primary-text hover:border-accent/50 hover:text-accent',
        ghost: 'bg-transparent text-secondary-text hover:text-primary-text hover:bg-surface',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {children}
        </button>
    );
}