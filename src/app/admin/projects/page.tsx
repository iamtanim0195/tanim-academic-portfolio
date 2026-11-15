import React from 'react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createProjectAction, toggleProjectPublishAction, deleteProjectAction } from '@/app/admin/actions';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react';

export default async function AdminProjectsPage() {
    const supabase = await createServerSupabaseClient();
    const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-8 max-w-6xl">
            <div>
                <h1 className="text-2xl font-extrabold text-primary-text">Manage Projects</h1>
                <p className="text-xs font-mono text-accent mt-1">// RESEARCH & ENGINEERING PORTFOLIO</p>
            </div>

            {/* Add Project Form */}
            <form
                action={async (formData) => {
                    'use server';
                    await createProjectAction(formData);
                }}
                className="p-6 bg-surface border border-border-subtle rounded-xl space-y-4"
            >
                <h2 className="text-sm font-mono uppercase tracking-wider text-accent font-semibold flex items-center gap-2">
                    <Plus size={16} /> Add New Project
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-mono text-secondary-text">Project Title *</label>
                        <input
                            name="title"
                            required
                            placeholder="e.g. Autonomous SLAM Drone"
                            className="w-full px-3 py-2 bg-background border border-border-subtle rounded-lg text-sm text-primary-text focus:border-accent focus:outline-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-mono text-secondary-text">URL Slug *</label>
                        <input
                            name="slug"
                            required
                            placeholder="e.g. autonomous-slam-drone"
                            className="w-full px-3 py-2 bg-background border border-border-subtle rounded-lg text-sm text-primary-text focus:border-accent focus:outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-mono text-secondary-text">Short Summary *</label>
                    <textarea
                        name="summary"
                        rows={2}
                        required
                        placeholder="Brief description of the project objectives and outcomes..."
                        className="w-full px-3 py-2 bg-background border border-border-subtle rounded-lg text-sm text-primary-text focus:border-accent focus:outline-none"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-mono text-secondary-text">Technologies (comma-separated)</label>
                        <input
                            name="technologies"
                            placeholder="Python, PyTorch, ROS2, C++"
                            className="w-full px-3 py-2 bg-background border border-border-subtle rounded-lg text-sm text-primary-text focus:border-accent focus:outline-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-mono text-secondary-text">GitHub Repository URL</label>
                        <input
                            name="githubUrl"
                            placeholder="https://github.com/..."
                            className="w-full px-3 py-2 bg-background border border-border-subtle rounded-lg text-sm text-primary-text focus:border-accent focus:outline-none"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 text-xs text-primary-text cursor-pointer">
                        <input type="checkbox" name="isFeatured" className="accent-[#C4F269]" />
                        <span>Feature on Homepage</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-primary-text cursor-pointer">
                        <input type="checkbox" name="published" className="accent-[#C4F269]" />
                        <span>Publish Immediately</span>
                    </label>
                </div>

                <Button type="submit" variant="accent" size="md">
                    Save Project
                </Button>
            </form>

            {/* Projects List Table */}
            <div className="bg-surface border border-border-subtle rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border-subtle text-[11px] font-mono uppercase text-secondary-text bg-background/40">
                                <th className="p-4">Title</th>
                                <th className="p-4">Slug</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle text-xs">
                            {!projects || projects.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-secondary-text">
                                        No projects found. Add your first project above.
                                    </td>
                                </tr>
                            ) : (
                                projects.map((project) => (
                                    <tr key={project.id} className="hover:bg-background/30 transition-colors">
                                        <td className="p-4 font-semibold text-primary-text">{project.title}</td>
                                        <td className="p-4 font-mono text-secondary-text">{project.slug}</td>
                                        <td className="p-4">
                                            <StatusBadge published={project.published} />
                                        </td>
                                        <td className="p-4 flex items-center justify-end gap-2">
                                            <form
                                                action={async () => {
                                                    'use server';
                                                    await toggleProjectPublishAction(project.id, project.published);
                                                }}
                                            >
                                                <button
                                                    type="submit"
                                                    title={project.published ? 'Unpublish' : 'Publish'}
                                                    className="p-2 rounded-lg bg-background border border-border-subtle text-secondary-text hover:text-accent"
                                                >
                                                    {project.published ? <EyeOff size={14} /> : <Eye size={14} />}
                                                </button>
                                            </form>

                                            <form
                                                action={async () => {
                                                    'use server';
                                                    await deleteProjectAction(project.id);
                                                }}
                                            >
                                                <button
                                                    type="submit"
                                                    title="Delete"
                                                    className="p-2 rounded-lg bg-background border border-border-subtle text-secondary-text hover:text-red-400"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}