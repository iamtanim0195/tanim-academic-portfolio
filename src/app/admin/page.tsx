import React from 'react';
import { FolderKanban, BookOpen, Activity, Award } from 'lucide-react';

export default function AdminDashboardPage() {
    const stats = [
        { title: 'Total Projects', count: 2, published: 2, icon: FolderKanban },
        { title: 'Publications', count: 1, published: 1, icon: BookOpen },
        { title: 'Activities', count: 4, published: 3, icon: Activity },
        { title: 'Skills Matrix', count: 10, published: 10, icon: Award },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-text">Dashboard Overview</h1>
                <p className="text-xs font-mono text-accent mt-1">// CONTENT METRICS & DRAFT STATUS</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.title} className="p-6 bg-surface border border-border-subtle rounded-xl space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-secondary-text">{stat.title}</span>
                                <div className="p-2 bg-accent/10 text-accent rounded-lg">
                                    <Icon size={18} />
                                </div>
                            </div>
                            <div className="text-3xl font-extrabold text-primary-text">{stat.count}</div>
                            <p className="text-[11px] text-secondary-text font-mono">
                                {stat.published} Published
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}