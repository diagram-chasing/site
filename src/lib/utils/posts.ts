import type { Post, Author, newsItem, Idea } from '../types/content';

// Lazy import modules for better performance
const postModules = import.meta.glob('/src/content/posts/*.md');
const authorModules = import.meta.glob('/src/content/authors/*.md');
const postImages = import.meta.glob(
    '/src/content/images/*.{jpg,jpeg,png,webp,avif,gif}',
    {
        import: 'default',
        query: {
            enhanced: true
        }
    }
);

const newsModule = import.meta.glob('/src/content/news.md');
const supportModule = import.meta.glob('/src/content/support.md');
const ideaModules = import.meta.glob('/src/content/ideas/*.md');

class PostsAPI {
    private postsCache: Post[] | null = null;
    private authorsCache: Author[] | null = null;
    private newsCache: newsItem[] | null = null;
    private supportFriendsCache: string[] | null = null;
    private ideasCache: Idea[] | null = null;

    async loadPost(slug: string): Promise<Post | null> {
        const path = `/src/content/posts/${slug}.md`;
        const loader = postModules[path];

        if (!loader) return null;

        try {
            const module = await loader();
            const metadata = (module as any).metadata;

            if (!metadata) return null;

            const post = {
                ...metadata,
                slug,
                tags: Array.isArray(metadata.tags) ? metadata.tags : [],
                authors: Array.isArray(metadata.authors) ? metadata.authors : []
            } as Post;

            // Process main image URL using enhanced images
            if (post.image) {
                const imageName = post.image.replace('/images/', '');
                const imagePath = `/src/content/images/${imageName}`;
                const imageLoader = postImages[imagePath];
                if (imageLoader) {
                    post.image = (await imageLoader()) as string;
                }
            }

            // Process gallery images if they exist
            if (post.gallery && Array.isArray(post.gallery)) {
                const processedGallery = [];
                for (const imagePath of post.gallery) {
                    const imageName = imagePath.replace('/images/', '');
                    const fullImagePath = `/src/content/images/${imageName}`;
                    const imageLoader = postImages[fullImagePath];
                    if (imageLoader) {
                        processedGallery.push((await imageLoader()) as string);
                    } else {
                        processedGallery.push(imagePath);
                    }
                }
                post.gallery = processedGallery;
            }

            return post;
        } catch (error) {
            console.error(`Error loading post ${slug}:`, error);
            return null;
        }
    }

    async loadAuthor(slug: string): Promise<Author | null> {
        const path = `/src/content/authors/${slug}.md`;
        const loader = authorModules[path];

        if (!loader) return null;

        const file = await loader();
        if (file && typeof file === 'object' && 'metadata' in file) {
            const metadata = file.metadata as Author;
            return metadata;
        }

        return null;
    }

    async getAllPosts(): Promise<Post[]> {
        if (this.postsCache) return this.postsCache;

        const posts: Post[] = [];
        for (const path in postModules) {
            const slug = path.split('/').pop()?.replace('.md', '') || '';
            const post = await this.loadPost(slug);
            if (post) {
                posts.push(post);
            }
        }

        // Sort by date (newest first)
        posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        this.postsCache = posts;
        return posts;
    }

    async getAllAuthors(): Promise<Author[]> {
        if (this.authorsCache) return this.authorsCache;

        const authors: Author[] = [];
        for (const path in authorModules) {
            const slug = path.split('/').pop()?.replace('.md', '') || '';
            const author = await this.loadAuthor(slug);
            if (author) {
                authors.push({ ...author, slug: author.slug || slug });
            }
        }

        this.authorsCache = authors;
        return authors;
    }

    async getPost(slug: string): Promise<Post | null> {
        return await this.loadPost(slug);
    }

    async getAuthor(slug: string): Promise<Author | null> {
        return await this.loadAuthor(slug);
    }

    // Filter methods
    async getPublishedPosts(): Promise<Post[]> {
        const posts = await this.getAllPosts();
        return posts.filter(post => post.published);
    }

    async getPostsByType(type: 'interactive' | 'article' | 'stories'): Promise<Post[]> {
        const posts = await this.getAllPosts();
        return posts.filter(post => post.type === type);
    }

    async getPostsByTag(tag: string): Promise<Post[]> {
        const posts = await this.getAllPosts();
        return posts.filter(post => post.tags.includes(tag));
    }

    async getPostsByAuthor(authorSlug: string): Promise<Post[]> {
        const posts = await this.getAllPosts();
        return posts.filter(post => post.authors.includes(authorSlug));
    }

    async getRecentPosts(limit = 5): Promise<Post[]> {
        const posts = await this.getPublishedPosts();
        return posts.slice(0, limit);
    }

    async getnews(): Promise<newsItem[]> {
        if (this.newsCache) return this.newsCache;

        const path = '/src/content/news.md';
        const loader = newsModule[path];
        if (!loader) return [];

        try {
            const module = await loader();
            const metadata = (module as any).metadata;
            if (metadata?.news && Array.isArray(metadata.news)) {
                this.newsCache = metadata.news as newsItem[];
                return this.newsCache;
            }
        } catch (error) {
            console.error('Error loading news items:', error);
        }

        return [];
    }

    async getSupportFriends(): Promise<string[]> {
        if (this.supportFriendsCache) return this.supportFriendsCache;

        const path = '/src/content/support.md';
        const loader = supportModule[path];
        if (!loader) return [];

        try {
            const module = await loader();
            const metadata = (module as any).metadata;
            if (metadata?.friends && Array.isArray(metadata.friends)) {
                this.supportFriendsCache = metadata.friends.map((f: { name: string }) => f.name);
                return this.supportFriendsCache!;
            }
        } catch (error) {
            console.error('Error loading support friends:', error);
        }

        return [];
    }

    async getIdeas(): Promise<Idea[]> {
        if (this.ideasCache) return this.ideasCache;

        const ideas: Idea[] = [];
        for (const path in ideaModules) {
            try {
                const module = await ideaModules[path]();
                const metadata = (module as any).metadata;
                if (metadata) {
                    ideas.push(metadata as Idea);
                }
            } catch (error) {
                console.error(`Error loading idea ${path}:`, error);
            }
        }

        // Sort by date descending
        ideas.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        this.ideasCache = ideas;
        return ideas;
    }

    async searchPosts(term: string): Promise<Post[]> {
        const searchTerm = term.toLowerCase();
        const posts = await this.getAllPosts();
        return posts.filter(
            post =>
                post.title.toLowerCase().includes(searchTerm) ||
                post.description.toLowerCase().includes(searchTerm) ||
                post.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm))
        );
    }
}

// Export singleton instance
export const postsAPI = new PostsAPI();

// Export types for external use
export type { Post, Author, newsItem, Idea };