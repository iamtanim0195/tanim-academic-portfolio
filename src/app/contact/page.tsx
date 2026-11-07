'use client';

import React, { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { Button } from '@/components/ui/Button';
import { Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <main className="py-12">
            <Container className="max-w-4xl space-y-12">
                <SectionHeading
                    eyebrow="GET IN TOUCH"
                    title="Contact & Academic Inquiries"
                    subtitle="Reach out for research collaborations, graduate inquiries, or technical discussion."
                />

                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                    <div className="md:col-span-5 space-y-6">
                        <div className="p-6 bg-surface border border-border-subtle rounded-xl space-y-4">
                            <h3 className="font-mono text-xs text-accent uppercase tracking-wider">// Contact Information</h3>
                            <div className="space-y-3 text-xs">
                                <div>
                                    <p className="text-secondary-text">Primary Email</p>
                                    <p className="font-mono text-primary-text font-medium">sahadatmd195@gmail.com</p>
                                </div>

                            </div>
                        </div>

                        <div className="p-6 bg-surface border border-border-subtle rounded-xl space-y-3">
                            <h3 className="font-mono text-xs text-accent uppercase tracking-wider">// Connect Elsewhere</h3>
                            <SocialLinks />
                        </div>
                    </div>

                    <div className="md:col-span-7">
                        {submitted ? (
                            <div className="p-8 bg-surface border border-accent/40 rounded-xl space-y-4 text-center">
                                <CheckCircle size={40} className="text-accent mx-auto" />
                                <h3 className="text-xl font-bold text-primary-text">Message Sent</h3>
                                <p className="text-xs text-secondary-text">Thank you for your message. I will reply shortly.</p>
                                <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                                    Send Another Message
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="p-6 bg-surface border border-border-subtle rounded-xl space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-mono text-secondary-text">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 bg-background border border-border-subtle rounded-lg text-sm text-primary-text focus:border-accent focus:outline-none"
                                        placeholder="Your Name"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-mono text-secondary-text">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-3 py-2 bg-background border border-border-subtle rounded-lg text-sm text-primary-text focus:border-accent focus:outline-none"
                                        placeholder="your.email@example.com"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-mono text-secondary-text">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full px-3 py-2 bg-background border border-border-subtle rounded-lg text-sm text-primary-text focus:border-accent focus:outline-none"
                                        placeholder="Research inquiry / Scholarship opportunity"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-mono text-secondary-text">Message</label>
                                    <textarea
                                        rows={4}
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-3 py-2 bg-background border border-border-subtle rounded-lg text-sm text-primary-text focus:border-accent focus:outline-none"
                                        placeholder="Your message details..."
                                    />
                                </div>

                                <Button type="submit" variant="accent" size="md" className="w-full gap-2">
                                    <Send size={16} /> Send Message
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </Container>
        </main>
    );
}