import { postsAPI } from '$lib/utils/posts';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
    try {
        // Load all published posts with images
        const posts = await postsAPI.getPublishedPosts();
        
        // Load all authors
        const authors = await postsAPI.getAllAuthors();
        
        return {
            posts,
            authors
        };
    } catch (error) {
        console.error('Error loading posts:', error);
        return {
            posts: [],
            authors: []
        };
    }
};