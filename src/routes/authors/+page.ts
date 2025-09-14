import { postsAPI } from '$lib/utils/posts';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
    try {
        // Load all authors
        const authors = await postsAPI.getAllAuthors();
        
        return {
            authors
        };
    } catch (error) {
        console.error('Error loading authors:', error);
        return {
            authors: []
        };
    }
};