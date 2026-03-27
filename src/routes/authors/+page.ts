import { postsAPI } from '$lib/utils/posts';
import type { PageLoad } from './$types';

const PINNED = ['aman', 'vivek'];

export const load: PageLoad = async () => {
    try {
        const [authors, posts] = await Promise.all([
            postsAPI.getAllAuthors(),
            postsAPI.getAllPosts()
        ]);

        // Map author slug → most recent published post date
        const latestDate: Record<string, number> = {};
        for (const post of posts) {
            if (!post.published) continue;
            for (const authorSlug of post.authors ?? []) {
                const t = new Date(post.date).getTime();
                if (!(authorSlug in latestDate) || t > latestDate[authorSlug]) {
                    latestDate[authorSlug] = t;
                }
            }
        }

        const sorted = [...authors].sort((a, b) => {
            const ai = PINNED.indexOf(a.slug);
            const bi = PINNED.indexOf(b.slug);
            if (ai !== -1 && bi !== -1) return ai - bi; // both pinned, keep order
            if (ai !== -1) return -1;
            if (bi !== -1) return 1;
            // remaining: reverse chronological by most recent project
            return (latestDate[b.slug] ?? -Infinity) - (latestDate[a.slug] ?? -Infinity);
        });

        // Map author slug → ordered list of published post images
        const imagesByAuthor: Record<string, string[]> = {};
        const publishedByDate = posts
            .filter((p) => p.published && p.image)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        for (const post of publishedByDate) {
            for (const authorSlug of post.authors ?? []) {
                if (!imagesByAuthor[authorSlug]) imagesByAuthor[authorSlug] = [];
                imagesByAuthor[authorSlug].push(post.image);
            }
        }

        return { authors: sorted, imagesByAuthor };
    } catch (error) {
        console.error('Error loading authors:', error);
        return { authors: [] };
    }
};