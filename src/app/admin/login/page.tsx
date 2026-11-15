'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Terminal, Lock, Mail, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const supabase = createClient();
        const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

        router.push('/admin');
        router.refresh();
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-4 bg-background">
            <div className="w-full max-w-md space-y-8 bg-surface border border-border-subtle p-8 rounded-2xl shadow-2xl">
                <div className="text-center space-y-2">
                    <div className="inline-flex p-3 bg-accent/10 border border-accent/30 rounded-xl text-accent mb-2">
                        <Terminal size={28} />
                    </div>
                    <h1 className="text-2xl font-extrabold text-primary-text tracking-tight">Admin Authentication</h1>
                    <p className="text-xs text-secondary-text font-mono">// PORTFOLIO CMS ACCESS</p>
                </div>

                {error && (
                    <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center gap-2 text-xs text-red-400">
                        <AlertCircle size={16} className="shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-mono text-secondary-text">Admin Email</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3 top-3 text-secondary-text" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-background border border-border-subtle rounded-lg text-sm text-primary-text focus:border-accent focus:outline-none"
                                placeholder="admin@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-mono text-secondary-text">Password</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3 top-3 text-secondary-text" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-background border border-border-subtle rounded-lg text-sm text-primary-text focus:border-accent focus:outline-none"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-accent text-accent-foreground font-semibold rounded-lg text-sm hover:bg-accent/90 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
                    </button>
                </form>
            </div>
        </main>
    );
}