import { z } from 'zod';

export const projectSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    slug: z
        .string()
        .min(3, 'Slug is required')
        .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
    summary: z.string().min(10, 'Summary must be at least 10 characters'),
    researchProblem: z.string().optional(),
    methodology: z.string().optional(),
    technologies: z.string().transform((val) =>
        val
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
    ),
    githubUrl: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
    demoUrl: z.string().url('Invalid Demo URL').optional().or(z.literal('')),
    paperUrl: z.string().url('Invalid Paper URL').optional().or(z.literal('')),
    isFeatured: z.boolean().default(false),
    published: z.boolean().default(false),
});

export const publicationSchema = z.object({
    title: z.string().min(5, 'Title is required'),
    authors: z.string().transform((val) =>
        val
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
    ),
    venue: z.string().min(2, 'Venue is required'),
    year: z.coerce.number().int().min(2000).max(2035),
    doi: z.string().optional(),
    paperUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
    isFeatured: z.boolean().default(false),
    published: z.boolean().default(false),
});

export const activitySchema = z.object({
    title: z.string().min(3, 'Title is required'),
    slug: z
        .string()
        .min(3)
        .regex(/^[a-z0-9-]+$/, 'Slug must be URL-safe'),
    summary: z.string().min(10, 'Summary is required'),
    content: z.string().optional(),
    category: z.enum(['research_update', 'milestone', 'publication', 'achievement', 'learning']),
    published: z.boolean().default(false),
});