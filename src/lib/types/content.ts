export interface Post {
    title: string;
    description: string;
    base_url?: string;
    slug?: string;
    published: boolean;
    external?: boolean;
    image: string;
    gallery?: string[]; // Array of image paths
    type: 'interactive' | 'article' | 'stories';
    date: string;
    tags: string[];
    authors: string[];
    code?: string;
    body?: string;
}

export interface Author {
    name: string;
    description: string;
    slug: string;
    image?: string;
    links?: {
        github?: string;
        twitter?: string;
        bluesky?: string;
        website?: string;
        instagram?: string;
    };
}

export interface Idea {
    date: string;
    pitch: string;
    originator: string;
    description: string;
    data?: string;
    note_text?: string;
    show_on_page: boolean;
    status?: '' | 'WIP' | 'PUBLISHED';
}