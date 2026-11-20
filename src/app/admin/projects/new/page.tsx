import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { ArrowLeft } from 'lucide-react';

export default function NewProjectPage() {
    return (
        <Container className="max-w-4xl space-y-6">
            <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-xs font-mono text-secondary-text hover:text-accent"
            >
                <ArrowLeft size={14} /> Back to Projects
            </Link>

            <div>
                <h1 className="text-2xl font-extrabold text-primary-text">Add New Project</h1>
                <p className="text-xs font-mono text-accent mt-1">// CREATE RESEARCH OR ENGINEERING PROJECT</p>
            </div>

            <ProjectForm />
        </Container>
    );
}