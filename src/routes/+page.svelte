<script lang="ts">
    import Image from '$lib/components/ui/Image.svelte';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    
    const { posts, authors } = data;
    
    function getAuthorName(slug: string) {
        return authors.find(author => author.slug === slug)?.name || slug;
    }
</script>

<div class="container">
    <h1>Diagram Chasing</h1>
    <p>Data visualization and storytelling projects</p>
    
    <div class="posts-grid">
        {#each posts as post}
            <article class="post-card">
                <div class="post-image">
                    <Image 
                        src={post.image} 
                        alt={post.title}
                        class="post-thumbnail"
                        loading="lazy"
                    />
                    <div class="post-type">{post.type}</div>
                </div>
                
                <div class="post-content">
                    <h2 class="post-title">{post.title}</h2>
                    <p class="post-description">{post.description}</p>
                    
                    <div class="post-meta">
                        <div class="post-authors">
                            {#each post.authors as authorSlug, i}
                                <span class="author">
                                    {getAuthorName(authorSlug)}{i < post.authors.length - 1 ? ', ' : ''}
                                </span>
                            {/each}
                        </div>
                        
                        <time class="post-date">{new Date(post.date).toLocaleDateString()}</time>
                    </div>
                    
                    <div class="post-tags">
                        {#each post.tags as tag}
                            <span class="tag">{tag}</span>
                        {/each}
                    </div>
                    
                    {#if post.base_url}
                        <a href={post.base_url} class="post-link" target="_blank" rel="noopener noreferrer">
                            View Project →
                        </a>
                    {/if}
                </div>
            </article>
        {/each}
    </div>
</div>

<style>
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }
    
    .posts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
        margin-top: 2rem;
    }
    
    .post-card {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s ease;
    }
    
    .post-card:hover {
        transform: translateY(-4px);
    }
    
    .post-image {
        position: relative;
    }
    
    .post-image :global(.post-thumbnail) {
        width: 100%;
        height: 200px;
        object-fit: cover;
    }
    
    .post-type {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        text-transform: uppercase;
    }
    
    .post-content {
        padding: 1.5rem;
    }
    
    .post-title {
        margin: 0 0 0.5rem 0;
        font-size: 1.25rem;
        font-weight: 600;
        line-height: 1.3;
    }
    
    .post-description {
        margin: 0 0 1rem 0;
        color: #666;
        line-height: 1.5;
    }
    
    .post-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        font-size: 0.875rem;
        color: #888;
    }
    
    .post-authors {
        font-weight: 500;
    }
    
    .post-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }
    
    .tag {
        background: #f0f0f0;
        color: #666;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
    }
    
    .post-link {
        display: inline-flex;
        align-items: center;
        color: #007acc;
        text-decoration: none;
        font-weight: 500;
    }
    
    .post-link:hover {
        text-decoration: underline;
    }
</style>
