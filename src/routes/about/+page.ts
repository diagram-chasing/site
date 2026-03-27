import { postsAPI } from '$lib/utils/posts';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	try {
		const news = await postsAPI.getnews();
		return { news };
	} catch (error) {
		console.error('Error loading news:', error);
		return { news: [] };
	}
};
