/** A page inside a post that has more than one, such as one state of a multi-state story. */
export interface Subpage {
    label: string;
    url: string;
    /** A word or two shown beside the label, such as "New". */
    note?: string;
}

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
    /** at:// URI of the site.standard.document record, written by scripts/sync-standard-site.mjs */
    atproto?: string;
    /** Where the card links, when it is not /{year}/{slug}. */
    link?: string;
    /** Pages inside the post, shown as buttons on its card. */
    subpages?: Subpage[];
}

export interface Author {
    name: string;
    description: string;
    slug: string;
    image?: string;
    links?: {
        email?: string;
        github?: string;
        twitter?: string;
        bluesky?: string;
        website?: string;
        instagram?: string;
        linkedin?: string;
    };
}

export interface newsItem {
    title: string;
    source: string;
    url: string;
    date: string;
    type?: 'news' | 'talk';
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
export interface Dataset {
    name: string;
    url: string;
    description: string;
    /** slug of the post this dataset was made for, if any */
    used_in?: string;
}
