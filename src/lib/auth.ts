import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function isAdminUser(): Promise<boolean> {
    try {
        const supabase = await createServerSupabaseClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return false;

        const allowedEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
        if (!allowedEmail) return true;

        return user.email?.toLowerCase() === allowedEmail;
    } catch {
        return false;
    }
}
