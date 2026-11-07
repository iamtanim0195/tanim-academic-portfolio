import React from 'react';

export interface TimelineItem {
    id: string;
    title: string;
    subtitle: string;
    period: string;
    location?: string;
    description: string[];
    badges?: string[];
}

interface TimelineProps {
    items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
    return (
        <div className="relative border-l border-border-subtle ml-4 sm:ml-6 space-y-10 my-8">
            {items.map((item) => (
                <div key={item.id} className="relative pl-6 sm:pl-8 group">
                    {/* Node marker */}
                    <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-surface border-2 border-accent group-hover:scale-125 transition-transform" />

                    <div className="space-y-2 bg-surface p-6 rounded-xl border border-border-subtle hover:border-accent/40 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <h3 className="text-lg font-bold text-primary-text">{item.title}</h3>
                            <span className="font-mono text-xs text-accent px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/20 w-fit">
                                {item.period}
                            </span>
                        </div>

                        <p className="text-sm font-medium text-secondary-text">{item.subtitle} {item.location && `• ${item.location}`}</p>

                        <ul className="space-y-1.5 pt-2">
                            {item.description.map((desc, idx) => (
                                <li key={idx} className="text-xs text-secondary-text leading-relaxed flex items-start gap-2">
                                    <span className="text-accent mt-1">•</span>
                                    <span>{desc}</span>
                                </li>
                            ))}
                        </ul>

                        {item.badges && item.badges.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-3">
                                {item.badges.map((badge) => (
                                    <span key={badge} className="px-2 py-0.5 text-[11px] font-mono bg-background border border-border-subtle rounded text-secondary-text">
                                        {badge}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}