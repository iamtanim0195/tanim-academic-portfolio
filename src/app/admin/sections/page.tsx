import React from 'react';
import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';

export default async function AdminSectionsPage() {
    const supabase = await createServerSupabaseClient();
    const { data: sections } = await supabase
        .from('site_sections')
        .select('*')
        .order('order_index', { ascending: true });

    async function toggleSection(id: string, current: boolean) {
        'use server';
        const sb = await createServerSupabaseClient();
        await sb.from('site_sections').update({ is_enabled: !current }).eq('id', id);
        revalidatePath('/');
        revalidatePath('/admin/sections');
    }

    async function moveSection(id: string, newIndex: number) {
        'use server';
        const sb = await createServerSupabaseClient();
        await sb.from('site_sections').update({ order_index: newIndex }).eq('id', id);
        revalidatePath('/');
        revalidatePath('/admin/sections');
    }

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h1 className="text-2xl font-extrabold text-primary-text">Homepage Sections</h1>
                <p className="text-xs font-mono text-accent mt-1">// ENABLE, DISABLE & REORDER PUBLIC SECTIONS</p>
            </div>

            <div className="bg-surface border border-border-subtle rounded-xl divide-y divide-border-subtle">
                {(sections || []).map((section) => (
                    <div key={section.id} className="p-4 flex items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-xs text-accent">#{section.order_index}</span>
                                <h3 className="text-sm font-bold text-primary-text">{section.title}</h3>
                            </div>
                            <p className="text-xs text-secondary-text">{section.subtitle}</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <form action={moveSection.bind(null, section.id, Math.max(1, section.order_index - 1))}>
                                <button
                                    type="submit"
                                    title="Move Up"
                                    className="p-2 rounded-lg bg-background border border-border-subtle text-secondary-text hover:text-accent"
                                >
                                    <ArrowUp size={14} />
                                </button>
                            </form>

                            <form action={moveSection.bind(null, section.id, section.order_index + 1)}>
                                <button
                                    type="submit"
                                    title="Move Down"
                                    className="p-2 rounded-lg bg-background border border-border-subtle text-secondary-text hover:text-accent"
                                >
                                    <ArrowDown size={14} />
                                </button>
                            </form>

                            <form action={toggleSection.bind(null, section.id, section.is_enabled)}>
                                <button
                                    type="submit"
                                    className={`px-3 py-1.5 rounded-lg text-xs font-mono border flex items-center gap-1.5 ${section.is_enabled
                                            ? 'bg-accent/10 text-accent border-accent/30'
                                            : 'bg-background text-secondary-text border-border-subtle'
                                        }`}
                                >
                                    {section.is_enabled ? <Eye size={14} /> : <EyeOff size={14} />}
                                    <span>{section.is_enabled ? 'Visible' : 'Hidden'}</span>
                                </button>
                            </form>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}