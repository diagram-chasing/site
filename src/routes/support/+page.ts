import { postsAPI } from '$lib/utils/posts';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
    const friends = await postsAPI.getSupportFriends();
    return { friends };
};
