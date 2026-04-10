import { postsAPI } from '$lib/utils/posts';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
    const [friends, funding] = await Promise.all([
        postsAPI.getSupportFriends(),
        postsAPI.getSupportFunding(fetch)
    ]);
    return { friends, funding };
};
