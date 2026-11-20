import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { PublicationForm } from '@/components/admin/PublicationForm';
import { ArrowLeft } from 'lucide-react';

export default function NewPublicationPage() {
    return (
        <Container className="max-w-4xl space-y-6">
            <Link
                href="/publications"
                className="inline-flex items-center gap-2 text-xs font-mono text-secondary-text hover:text-accent"
            >
                <ArrowLeft size={14} /> Back to Publications
            </Link>

            <div>
                <h1 className="text-2xl font-extrabold text-primary-text">Add New Publication</h1>
                <p className="text-xs font-mono text-accent mt-1">// ADD RESEARCH PAPER OR PREPRINT</p>
            </div>

            <PublicationForm />
        </Container>
    );
}