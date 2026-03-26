import { postsAPI } from '$lib/utils/posts';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => {
	try {
		const [posts, authors, news] = await Promise.all([
			postsAPI.getPublishedPosts(),
			postsAPI.getAllAuthors(),
			postsAPI.getnews()
		]);

		return {
			posts,
			authors,
			news,
			diagramTerms: data.diagramTerms
		};
	} catch (error) {
		console.error('Error loading posts:', error);
		return {
			posts: [],
			authors: [],
			news: [],
			diagramTerms: data.diagramTerms
		};
	}
};
