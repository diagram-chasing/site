import { postsAPI } from '$lib/utils/posts';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
    try {
        const [posts, authors, press] = await Promise.all([
            postsAPI.getPublishedPosts(),
            postsAPI.getAllAuthors(),
            postsAPI.getPress()
        ]);

        return {
            posts,
            authors,
            press
        };
    } catch (error) {
        console.error('Error loading posts:', error);
        return {
            posts: [],
            authors: [],
            press: []
        };
    }
};
