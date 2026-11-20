'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Download,
    Pencil,
    X,
    Plus,
    Trash2,
    CheckCircle2,
    ExternalLink,
    Upload,
    Link as LinkIcon,
    AlertCircle,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
    addCvLinkAction,
    setActiveCvAction,
    deleteCvLinkAction,
} from '@/app/cv-actions';
import { Button } from '@/components/ui/Button';

export interface CvLinkItem {
    id: string;
    label: string;
    url: string;
    is_active: boolean;
    created_at: string;
}

interface ViewCvControlProps {
    isAdmin: boolean;
    cvLinks: CvLinkItem[];
}

export function ViewCvControl({ isAdmin, cvLinks }: ViewCvControlProps) {
    const router = useRouter();
    const [modalOpen, setModalOpen] = useState(false);
    const [inputMode, setInputMode] = useState<'link' | 'upload'>('link');
    const [urlInput, setUrlInput] = useState('');
    const [labelInput, setLabelInput] = useState('');
    const [uploadingPdf, setUploadingPdf] = useState(false);
    const [saving, setSaving] = useState(false);
    const [feedback, setFeedback] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const activeCv = cvLinks.find((item) => item.is_active) || cvLinks[0] || null;

    const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingPdf(true);
        setFeedback(null);

        try {
            const supabase = createClient();
            const ext = file.name.split('.').pop() || 'pdf';
            const path = `cv/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;

            const { error } = await supabase.storage
                .from('portfolio-media')
                .upload(path, file);

            if (error) throw error;

            const { data } = supabase.storage.from('portfolio-media').getPublicUrl(path);
            setUrlInput(data.publicUrl);
            if (!labelInput) {
                setLabelInput(file.name.replace(/\.[^/.]+$/, ''));
            }
            setFeedback({ type: 'success', message: 'PDF uploaded! Click "Add CV Link" to save.' });
        } catch (err: unknown) {
            setFeedback({
                type: 'error',
                message: err instanceof Error ? err.message : 'PDF upload failed',
            });
        } finally {
            setUploadingPdf(false);
        }
    };

    const handleAddCv = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        setFeedback(null);

        const formData = new FormData(e.currentTarget);
        const res = await addCvLinkAction(formData);
        setSaving(false);

        if (res?.error) {
            setFeedback({ type: 'error', message: res.error });
            return;
        }

        setLabelInput('');
        setUrlInput('');
        setFeedback({ type: 'success', message: 'CV link saved!' });
        router.refresh();
    };

    const handleSetActive = async (id: string) => {
        setFeedback(null);
        const res = await setActiveCvAction(id);
        if (res?.error) {
            setFeedback({ type: 'error', message: res.error });
            return;
        }
        setFeedback({ type: 'success', message: 'Active CV updated!' });
        router.refresh();
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this CV link?')) return;
        setFeedback(null);
        const res = await deleteCvLinkAction(id);
        if (res?.error) {
            setFeedback({ type: 'error', message: res.error });
            return;
        }
        router.refresh();
    };

    return (
        <>
            <div className="inline-flex items-center gap-1.5">
                {/* Public View CV Button */}
                {activeCv ? (
                    <a
                        href={activeCv.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={activeCv.label}
                    >
                        <Button variant="outline" size="lg" className="gap-2">
                            <Download size={18} />
                            <span>View CV</span>
                        </Button>
                    </a>
                ) : (
                    <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="gap-2 opacity-70 cursor-not-allowed"
                        onClick={() => isAdmin && setModalOpen(true)}
                        title={isAdmin ? 'Click pencil to add your CV link' : 'CV not uploaded yet'}
                    >
                        <Download size={18} />
                        <span>View CV</span>
                    </Button>
                )}

                {/* Admin Pencil Edit Trigger */}
                {isAdmin && (
                    <button
                        type="button"
                        onClick={() => {
                            setFeedback(null);
                            setModalOpen(true);
                        }}
                        title="Manage CV Links"
                        aria-label="Manage CV Links"
                        className="p-3 rounded-lg bg-surface border border-border-subtle text-secondary-text hover:text-accent hover:border-accent/50 transition-colors"
                    >
                        <Pencil size={18} />
                    </button>
                )}
            </div>

            {/* Admin CV Management Modal */}
            {isAdmin && modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
                    <div className="w-full max-w-2xl bg-surface border border-border-subtle rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="p-5 border-b border-border-subtle flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-extrabold text-primary-text">Manage CV Links</h2>
                                <p className="text-[11px] font-mono text-accent">
                  // SELECT ACTIVE CV OR ADD NEW VERSION
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setModalOpen(false)}
                                aria-label="Close modal"
                                className="p-2 rounded-lg text-secondary-text hover:text-primary-text hover:bg-background"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-5 overflow-y-auto space-y-6">
                            {feedback && (
                                <div
                                    className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${feedback.type === 'success'
                                            ? 'bg-accent/10 border-accent/40 text-accent'
                                            : 'bg-red-900/20 border-red-500/40 text-red-400'
                                        }`}
                                >
                                    {feedback.type === 'success' ? (
                                        <CheckCircle2 size={16} />
                                    ) : (
                                        <AlertCircle size={16} />
                                    )}
                                    <span>{feedback.message}</span>
                                </div>
                            )}

                            {/* Existing CV Links List */}
                            <div className="space-y-2.5">
                                <h3 className="text-xs font-mono uppercase tracking-wider text-secondary-text">
                                    Saved CV Versions ({cvLinks.length})
                                </h3>

                                {cvLinks.length === 0 ? (
                                    <p className="p-4 rounded-xl bg-background/60 border border-border-subtle text-xs text-secondary-text text-center">
                                        No CV links added yet. Add your first CV below.
                                    </p>
                                ) : (
                                    <div className="space-y-2">
                                        {cvLinks.map((item) => (
                                            <div
                                                key={item.id}
                                                className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${item.is_active
                                                        ? 'bg-accent/5 border-accent/40'
                                                        : 'bg-background/60 border-border-subtle'
                                                    }`}
                                            >
                                                <div className="min-w-0 space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-primary-text truncate">
                                                            {item.label}
                                                        </span>
                                                        {item.is_active && (
                                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-accent text-accent-foreground font-semibold">
                                                                ACTIVE
                                                            </span>
                                                        )}
                                                    </div>
                                                    <a
                                                        href={item.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[11px] font-mono text-secondary-text hover:text-accent flex items-center gap-1 truncate"
                                                    >
                                                        <span className="truncate">{item.url}</span>
                                                        <ExternalLink size={11} className="shrink-0" />
                                                    </a>
                                                </div>

                                                <div className="flex items-center gap-2 shrink-0">
                                                    {!item.is_active && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSetActive(item.id)}
                                                            className="px-2.5 py-1.5 rounded-lg bg-surface border border-border-subtle text-[11px] font-mono text-secondary-text hover:text-accent hover:border-accent/40 transition-colors"
                                                        >
                                                            Set Active
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(item.id)}
                                                        title="Delete CV Link"
                                                        className="p-1.5 rounded-lg bg-surface border border-border-subtle text-secondary-text hover:text-red-400 transition-colors"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Add New CV Link Form */}
                            <form
                                onSubmit={handleAddCv}
                                className="p-4 rounded-xl bg-background/60 border border-border-subtle space-y-4"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <span className="text-xs font-mono text-accent uppercase tracking-wider flex items-center gap-1.5">
                                        <Plus size={14} /> Add New CV Link
                                    </span>

                                    <div className="inline-flex rounded-lg bg-surface border border-border-subtle p-0.5 text-[11px] font-mono">
                                        <button
                                            type="button"
                                            onClick={() => setInputMode('link')}
                                            className={`px-2.5 py-1 rounded-md flex items-center gap-1 ${inputMode === 'link'
                                                    ? 'bg-accent text-accent-foreground font-semibold'
                                                    : 'text-secondary-text'
                                                }`}
                                        >
                                            <LinkIcon size={11} /> External URL
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setInputMode('upload')}
                                            className={`px-2.5 py-1 rounded-md flex items-center gap-1 ${inputMode === 'upload'
                                                    ? 'bg-accent text-accent-foreground font-semibold'
                                                    : 'text-secondary-text'
                                                }`}
                                        >
                                            <Upload size={11} /> Upload PDF
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-mono text-secondary-text">Version Label *</label>
                                    <input
                                        name="label"
                                        required
                                        value={labelInput}
                                        onChange={(e) => setLabelInput(e.target.value)}
                                        placeholder="e.g. Erasmus Mundus Academic CV (Nov 2026)"
                                        className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-lg text-xs text-primary-text focus:border-accent focus:outline-none"
                                    />
                                </div>

                                {inputMode === 'upload' ? (
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-mono text-secondary-text">
                                            Select PDF File *
                                        </label>
                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            onChange={handlePdfUpload}
                                            disabled={uploadingPdf}
                                            className="w-full px-3 py-1.5 bg-surface border border-border-subtle rounded-lg text-xs text-secondary-text file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-mono file:bg-accent/10 file:text-accent"
                                        />
                                        {uploadingPdf && (
                                            <p className="text-[11px] font-mono text-accent">Uploading PDF...</p>
                                        )}
                                        <input type="hidden" name="url" value={urlInput} />
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        <label className="text-xs font-mono text-secondary-text">
                                            CV Link (Google Drive / Overleaf / Direct PDF URL) *
                                        </label>
                                        <input
                                            name="url"
                                            type="url"
                                            required
                                            value={urlInput}
                                            onChange={(e) => setUrlInput(e.target.value)}
                                            placeholder="https://drive.google.com/file/d/..."
                                            className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-lg text-xs text-primary-text focus:border-accent focus:outline-none"
                                        />
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-1">
                                    <label className="flex items-center gap-2 text-xs text-primary-text cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="setActive"
                                            defaultChecked
                                            className="accent-[#C4F269]"
                                        />
                                        <span>Set as active CV immediately</span>
                                    </label>

                                    <Button
                                        type="submit"
                                        variant="accent"
                                        size="sm"
                                        disabled={saving || uploadingPdf || !urlInput}
                                    >
                                        {saving ? 'Saving...' : 'Add CV Link'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}