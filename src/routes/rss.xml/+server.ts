import { Feed } from 'feed';
import { postsAPI } from '$lib/utils/posts';

export const prerender = true;

export async function GET() {
	const feed = new Feed({
		title: 'Diagram Chasing',
		description: "Data-driven works of various interests, shared once in a while",
		id: 'https://diagramchasing.fun/',
		link: 'https://diagramchasing.fun/',
		language: 'en',
		favicon: 'https://diagramchasing.fun/favicon.ico',
		copyright: `© ${new Date().getFullYear().toString()} Diagram Chasing. All rights reserved.`,
		generator: 'Feed for Node.js',
		feedLinks: {
			rss: 'https://diagramchasing.fun/rss.xml'
		},
		author: {
			name: 'Diagram Chasing',
			email: 'hello@diagramchasing.fun',
			link: 'https://diagramchasing.fun/',
		},
        image: 'https://diagramchasing.fun/sharecard.jpg',
		ttl: 60,
	});

	const posts = await postsAPI.getPublishedPosts();

	posts.forEach(post => {
		feed.addItem({
			title: post.title,
            description: post.description,
			link: `https://diagramchasing.fun/${new Date(post.date).getFullYear()}/${post.slug}`,
			date: new Date(post.date),
            enclosure: {
                url: `https://diagramchasing.fun${post.image.sources.avif.split(' ')[0]}`,
                type: 'image/avif',
            },
		});
	});

	return new Response(feed.rss2(), {
		headers: {
            'Cache-Control': 'max-age=0, s-maxage=3600',
			'Content-Type': 'application/rss+xml',
		},
	});
}
