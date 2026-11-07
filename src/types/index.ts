export interface NavItem {
    id: string;
    label: string;
    href: string;
    isExternal?: boolean;
    order: number;
    isEnabled: boolean;
}

export interface Profile {
    id: string;
    fullName: string;
    headline: string;
    shortBio: string;
    fullBio?: string;
    avatarUrl: string;
    heroVideoUrl?: string;
    heroMode: 'photo' | 'video';
    cvUrl?: string;
    email: string;
    githubUrl?: string;
    linkedinUrl?: string;
    googleScholarUrl?: string;
}

export interface ResearchInterest {
    id: string;
    title: string;
    description: string;
    iconName?: string;
    order: number;
}

export interface Skill {
    id: string;
    name: string;
    category: 'languages' | 'ml_ai' | 'frameworks' | 'tools' | 'database';
    proficiency?: number;
}

export interface Project {
    id: string;
    slug: string;
    title: string;
    summary: string;
    description?: string;
    imageUrl?: string;
    technologies: string[];
    researchProblem?: string;
    methodology?: string;
    githubUrl?: string;
    demoUrl?: string;
    paperUrl?: string;
    isFeatured: boolean;
    published: boolean;
}

export interface Publication {
    id: string;
    title: string;
    authors: string[];
    venue: string;
    year: number;
    doi?: string;
    paperUrl?: string;
    pdfUrl?: string;
    isFeatured: boolean;
    published: boolean;
}

export interface Activity {
    id: string;
    slug: string;
    title: string;
    summary: string;
    category: 'research_update' | 'milestone' | 'publication' | 'achievement' | 'learning';
    publishedAt: string;
    published: boolean;
}