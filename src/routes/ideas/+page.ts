import { postsAPI } from '$lib/utils/posts';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const ideas = await postsAPI.getIdeas();
	return { ideas };
};
