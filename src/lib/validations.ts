import { z } from 'zod';

export const projectSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    slug: z
        .string()
        .min(3, 'Slug is required')
        .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
    summary: z.string().min(10, 'Short summary must be at least 10 characters'),
    description: z.string().optional().default(''),
    imageUrl: z.string().optional().default(''),
    extraImageUrl: z.string().optional().default(''),
    videoUrl: z.string().optional().default(''),
    technologies: z.string().transform((val) =>
        val
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
    ),
    githubUrl: z.string().url('Invalid Code URL').optional().or(z.literal('')),
    demoUrl: z.string().url('Invalid Demo URL').optional().or(z.literal('')),
    paperUrl: z.string().url('Invalid Paper URL').optional().or(z.literal('')),
    isFeatured: z.boolean().default(false),
    published: z.boolean().default(false),
});

export const publicationSchema = z.object({
    title: z.string().min(3, 'Publication title must be at least 3 characters'),
    description: z.string().optional().default(''),
    paperUrl: z.string().url('Invalid link URL').optional().or(z.literal('')),
    authors: z
        .string()
        .optional()
        .default('')
        .transform((val) =>
            val
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
        ),
    venue: z.string().optional().default(''),
    year: z
        .string()
        .optional()
        .default('')
        .transform((val) => (val ? Number(val) : null)),
    isFeatured: z.boolean().default(false),
    published: z.boolean().default(true),
});

export const feedPostSchema = z.object({
    caption: z.string().min(1, 'Caption cannot be empty').max(3000, 'Caption is too long'),
    imageUrl: z.string().optional().default(''),
    published: z.boolean().default(true),
});

export const commentSchema = z.object({
    activityId: z.string().uuid('Invalid post ID'),
    authorName: z.string().min(1, 'Name is required').max(80, 'Name is too long'),
    content: z.string().min(1, 'Comment cannot be empty').max(1000, 'Comment is too long'),
    honeypot: z.string().max(0, 'Spam detected').optional().default(''),
});

export const cvLinkSchema = z.object({
    label: z.string().min(2, 'Label is required (e.g. Academic CV 2026)').max(100),
    url: z.string().url('Please provide a valid URL or upload a PDF'),
    setActive: z.boolean().default(true),
});

export const heroMediaSchema = z.object({
    label: z.string().min(2, 'Label is required (e.g. Lab Portrait 2026)').max(100),
    mediaType: z.enum(['image', 'video']),
    url: z.string().url('Please provide a valid URL or upload a file'),
    setActive: z.boolean().default(true),
});