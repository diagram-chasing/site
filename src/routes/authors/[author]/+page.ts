import { postsAPI } from '$lib/utils/posts';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params }) => {
    try {
        const { author: authorSlug } = params;
        
        // Load the author
        const author = await postsAPI.getAuthor(authorSlug);
        
        if (!author) {
            throw error(404, `Author '${authorSlug}' not found`);
        }
        
        // Load posts by this author
        const posts = await postsAPI.getPostsByAuthor(authorSlug);
        
        return {
            author: { ...author, slug: authorSlug },
            posts
        };
    } catch (err) {
        console.error('Error loading author page:', err);
        throw error(404, 'Author not found');
    }
};