import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Container } from '@/components/ui/Container';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { ArrowLeft } from 'lucide-react';

interface EditProjectPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: project } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

    if (!project) {
        notFound();
    }

    return (
        <Container className="max-w-4xl space-y-6">
            <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-xs font-mono text-secondary-text hover:text-accent"
            >
                <ArrowLeft size={14} /> Back to Projects
            </Link>

            <div>
                <h1 className="text-2xl font-extrabold text-primary-text">Edit Project</h1>
                <p className="text-xs font-mono text-accent mt-1">// {project.title}</p>
            </div>

            <ProjectForm initialData={project} />
        </Container>
    );
}