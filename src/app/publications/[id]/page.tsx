import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Container } from '@/components/ui/Container';
import { PublicationForm } from '@/components/admin/PublicationForm';
import { ArrowLeft } from 'lucide-react';

interface EditPublicationPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditPublicationPage({ params }: EditPublicationPageProps) {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: publication } = await supabase
        .from('publications')
        .select('*')
        .eq('id', id)
        .single();

    if (!publication) {
        notFound();
    }

    return (
        <Container className="max-w-4xl space-y-6">
            <Link
                href="/publications"
                className="inline-flex items-center gap-2 text-xs font-mono text-secondary-text hover:text-accent"
            >
                <ArrowLeft size={14} /> Back to Publications
            </Link>

            <div>
                <h1 className="text-2xl font-extrabold text-primary-text">Edit Publication</h1>
                <p className="text-xs font-mono text-accent mt-1">// {publication.title}</p>
            </div>

            <PublicationForm initialData={publication} />
        </Container>
    );
}