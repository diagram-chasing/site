<script lang="ts">
	import Image from '$lib/components/ui/Image.svelte';
	import { Button } from '$lib/components/ui/button';
	import type { Post } from '$lib/types/content';
	import { balancer } from 'svelte-action-balancer';

	interface Props {
		post: Post;
		class?: string;
	}

	let { post, class: className = '' }: Props = $props();

	const allImages = $derived.by(() => {
		const images = [post.image];
		if (post.gallery?.length) images.push(...post.gallery);
		return images.slice(0, 6);
	});

	const gridClass = $derived(`gallery-${allImages.length}`);
</script>

<!-- Editorial Grid Layout -->
<div class="gallery-container w-full max-w-full font-sans {className}">
	<div class="gallery-grid {gridClass}">
		<!-- Title Block -->
		<div class="gallery-title">
			<div class="space-y-1">
				<div class="gallery-year">
					{new Date(post.date).getFullYear()}
				</div>
				<h1 use:balancer class="gallery-heading">
					{post.title}
				</h1>
			</div>

			<div class="gallery-content">
				<p class="gallery-description">
					{post.description}
				</p>

				<div class="gallery-authors">
					{#each post.authors as author, i}
						<a href="/authors/{author}" class="author-link">
							{author.charAt(0).toUpperCase() + author.slice(1)}
						</a>{i < post.authors.length - 1 ? ', ' : ''}
					{/each}
				</div>

				<div class="gallery-buttons">
					{#if post.base_url}
						<Button href={post.base_url} variant="default" size="sm" class="gallery-btn">
							View Project
						</Button>
					{/if}
					{#if post.code}
						<Button href={post.code} variant="outline" size="sm" class="gallery-btn">
							Source Code
						</Button>
					{/if}
				</div>
			</div>
		</div>

		<!-- Featured Image -->
		<div class="gallery-featured">
			<Image
				src={allImages[0]}
				alt="{post.title} - Featured"
				class="h-full w-full border object-cover transition-all duration-300 ease-out"
				loading="eager"
				sizes="(max-width: 768px) 100vw, (max-width: 1024px) 70vw, 50vw"
			/>
		</div>

		<!-- Additional Images for Mobile Only (2 max) -->
		{#if allImages.length > 1}
			<div class="gallery-mobile-grid">
				{#each allImages.slice(1, 3) as image, index}
					<div class="gallery-mobile-image">
						<Image
							src={image}
							alt="{post.title} - Image {index + 2}"
							class="h-full w-full border object-cover transition-all duration-300 ease-out"
							loading="lazy"
							sizes="(max-width: 480px) 50vw, 33vw"
						/>
					</div>
				{/each}
			</div>
		{/if}

		<!-- Desktop Individual Images -->
		{#each allImages.slice(1) as image, index}
			<div class="gallery-image gallery-image-{index + 1}">
				<Image
					src={image}
					alt="{post.title} - Image {index + 2}"
					class="h-full w-full border object-cover transition-all duration-300 ease-out"
					loading="lazy"
					sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
				/>
			</div>
		{/each}
	</div>
</div>

<style>
	/* CSS Custom Properties for Fluid Sizing */
	:root {
		/* Fluid typography using clamp() */
		--gallery-height: clamp(60vh, 70vh + 2vw, 80vh);
		--gallery-gap: clamp(0.5rem, 1vw, 1rem);

		/* Typography scales */
		--text-year: clamp(0.7rem, 0.75rem + 0.1vw, 0.875rem);
		--text-heading: clamp(1.75rem, 2rem + 3vw, 3.75rem);
		--text-description: clamp(0.875rem, 0.9rem + 0.5vw, 1.125rem);
		--text-authors: clamp(0.75rem, 0.8rem + 0.1vw, 0.875rem);
	}

	/* Base Grid Setup */
	.gallery-grid {
		display: grid;
		height: var(--gallery-height);
		width: 100%;
		gap: var(--gallery-gap);
	}

	/* Title Styling */
	.gallery-title {
		display: flex;
		flex-direction: column;
		justify-content: end;
		gap: clamp(0.5rem, 1vw, 0.75rem);
		grid-area: title;
		padding: clamp(0.5rem, 1vw, 1rem);
	}

	.gallery-year {
		font-size: var(--text-year);
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: rgb(100 116 139);
	}

	.gallery-heading {
		font-family: var(--font-serif, Georgia, serif);
		font-size: var(--text-heading);
		line-height: 1.1;
		font-weight: 900;
		letter-spacing: -0.025em;
		color: var(--foreground);
	}

	.gallery-content {
		max-width: 65ch;
		display: flex;
		flex-direction: column;
		gap: clamp(0.5rem, 1vw, 0.75rem);
	}

	.gallery-description {
		font-size: var(--text-description);
		line-height: 1.6;
		color: rgb(100 116 139);
	}

	.gallery-authors {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: var(--text-authors);
		font-weight: 500;
		color: var(--foreground);
	}

	.author-link {
		color: var(--foreground);
		text-decoration: underline;
		text-underline-offset: 2px;
		transition: color 0.2s ease;
	}

	.author-link:hover {
		color: rgb(100 116 139);
	}

	.gallery-buttons {
		display: flex;
		gap: clamp(0.5rem, 1vw, 1rem);
		flex-wrap: wrap;
	}

	/* Image Containers */
	.gallery-featured,
	.gallery-image,
	.gallery-mobile-image {
		position: relative;
		overflow: hidden;
		border-radius: 0.125rem;
		background-color: rgb(248 250 252);
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
	}

	.gallery-featured {
		grid-area: featured;
	}

	/* Mobile Grid for Additional Images */
	.gallery-mobile-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--gallery-gap);
		grid-area: mobile;
	}

	/* Hide desktop images by default on mobile */
	.gallery-image {
		display: none;
	}

	/* =================================
	   MOBILE FIRST: Default Layout
	   ================================= */
	.gallery-grid {
		grid-template-columns: 1fr;
		grid-template-rows: auto 2fr auto;
		grid-template-areas:
			'title'
			'featured'
			'mobile';
	}

	/* Hide mobile grid when no extra images */
	.gallery-1 .gallery-mobile-grid,
	.gallery-2 .gallery-mobile-grid:has(.gallery-mobile-image:nth-child(2):empty) {
		display: none;
	}

	/* =================================
	   TABLET: 640px+
	   ================================= */
	@media (min-width: 640px) {
		.gallery-mobile-grid {
			display: none;
		}

		.gallery-image {
			display: block;
		}

		.gallery-grid {
			grid-template-columns: repeat(6, 1fr);
			grid-template-rows: repeat(4, 1fr);
		}

		/* Grid layouts for different image counts */
		.gallery-1 {
			grid-template-areas:
				'featured featured featured featured title title'
				'featured featured featured featured title title'
				'featured featured featured featured . .'
				'featured featured featured featured . .';
		}

		.gallery-2 {
			grid-template-areas:
				'featured featured featured featured image-1 image-1'
				'featured featured featured featured image-1 image-1'
				'featured featured featured featured title title'
				'featured featured featured featured title title';
		}

		.gallery-3 {
			grid-template-areas:
				'featured featured featured image-1 image-1 image-2'
				'featured featured featured image-1 image-1 image-2'
				'featured featured featured title title title'
				'featured featured featured title title title';
		}

		.gallery-4 {
			grid-template-areas:
				'featured featured featured image-1 image-1 image-2'
				'featured featured featured image-1 image-1 image-2'
				'featured featured featured title title title'
				'featured featured featured image-3 image-3 image-3';
		}

		.gallery-5 {
			grid-template-areas:
				'featured featured featured image-1 image-1 image-2'
				'featured featured featured image-1 image-1 image-2'
				'featured featured featured image-3 image-3 image-4'
				'featured featured featured title title title';
		}

		.gallery-6 {
			grid-template-areas:
				'featured featured featured image-1 image-1 image-2'
				'featured featured featured image-1 image-1 image-2'
				'featured featured featured image-3 image-3 image-4'
				'featured featured featured image-5 title title';
		}
	}

	/* =================================
	   MEDIUM: 768px+
	   ================================= */
	@media (min-width: 768px) {
		.gallery-grid {
			grid-template-columns: repeat(8, 1fr);
			grid-template-rows: repeat(4, 1fr);
		}

		.gallery-1 {
			grid-template-areas:
				'featured featured featured featured featured title title title'
				'featured featured featured featured featured title title title'
				'featured featured featured featured featured . . .'
				'featured featured featured featured featured . . .';
		}

		.gallery-2 {
			grid-template-areas:
				'featured featured featured featured featured image-1 image-1 image-1'
				'featured featured featured featured featured  title title title'
				'featured featured featured featured featured title title title'
				'featured featured featured featured featured title title title';
		}

		.gallery-3 {
			grid-template-areas:
				'featured featured featured featured featured image-1 image-1 image-2'
				'featured featured featured featured featured title title title'
				'featured featured featured featured featured title title title'
				'featured featured featured featured featured title title title';
		}

		.gallery-4 {
			grid-template-areas:
				'featured featured featured featured image-1 image-1 image-2 image-2'
				'featured featured featured featured image-1 image-1 image-2 image-2'
				'featured featured featured featured title title title title'
				'featured featured featured featured image-3 image-3 image-3 image-3';
		}

		.gallery-5 {
			grid-template-areas:
				'featured featured featured featured image-1 image-1 image-2 image-2'
				'featured featured featured featured image-1 image-1 image-2 image-2'
				'featured featured featured featured image-3 image-3 image-4 image-4'
				'featured featured featured featured title title title title';
		}

		.gallery-6 {
			grid-template-areas:
				'featured featured featured featured image-1 image-1 image-2 image-2'
				'featured featured featured featured image-1 image-1 image-2 image-2'
				'featured featured featured featured image-3 image-3 image-4 image-4'
				'featured featured featured featured image-5 image-5 title title';
		}
	}

	/* =================================
	   DESKTOP: 900px+ (Preserved Layouts)
	   ================================= */
	@media (min-width: 900px) {
		.gallery-grid {
			grid-template-columns: repeat(12, 1fr);
			grid-template-rows: repeat(5, 1fr);
		}

		.gallery-1 {
			grid-template-areas:
				'featured featured featured featured featured featured . . . . . .'
				'featured featured featured featured featured featured . title title title title title'
				'featured featured featured featured featured featured . title title title title title'
				'featured featured featured featured featured featured . . . . . .'
				'featured featured featured featured featured featured . . . . . .';
		}

		.gallery-2 {
			grid-template-areas:
				'featured featured featured featured featured featured . . . image-1 image-1 image-1'
				'featured featured featured featured featured featured . . . image-1 image-1 image-1'
				'featured featured featured featured featured featured title title title image-1 image-1 image-1'
				'featured featured featured featured featured featured title title title image-1 image-1 image-1'
				'featured featured featured featured featured featured title title title image-1 image-1 image-1';
		}

		.gallery-3 {
			grid-template-areas:
				'featured featured featured featured featured featured image-1 image-1 image-1 image-2 image-2 image-2'
				'featured featured featured featured featured featured title title title image-2 image-2 image-2'
				'featured featured featured featured featured featured title title title image-2 image-2 image-2'
				'featured featured featured featured featured featured title title title image-2 image-2 image-2'
				'featured featured featured featured featured featured title title title image-2 image-2 image-2';
		}

		.gallery-4 {
			grid-template-areas:
				'featured featured featured featured featured featured featured image-1 image-1 image-2 image-2 image-2'
				'featured featured featured featured featured featured featured title title image-2 image-2 image-2'
				'featured featured featured featured featured featured featured title title image-3 image-3 image-3'
				'featured featured featured featured featured featured featured title title image-3 image-3 image-3'
				'featured featured featured featured featured featured featured title title image-3 image-3 image-3';
		}

		.gallery-5 {
			grid-template-rows: repeat(6, 1fr);
			grid-template-areas:
				'featured featured featured featured featured featured image-1 image-1 image-1 image-2 image-2 image-2'
				'featured featured featured featured featured featured image-1 image-1 image-1 image-2 image-2 image-2'
				'featured featured featured featured featured featured image-3 image-3 image-3 image-4 image-4 image-4'
				'featured featured featured featured featured featured image-3 image-3 image-3 image-4 image-4 image-4'
				'featured featured featured featured featured featured title title title title title title'
				'featured featured featured featured featured featured title title title title title title';
		}

		.gallery-6 {
			grid-template-rows: repeat(6, 1fr);
			grid-template-areas:
				'image-1 image-1 image-2 image-2 image-3 image-3 featured featured featured featured featured featured'
				'image-1 image-1 image-2 image-2 image-3 image-3 featured featured featured featured featured featured'
				'image-4 image-4 image-4 image-5 image-5 image-5 featured featured featured featured featured featured'
				'image-4 image-4 image-4 image-5 image-5 image-5 featured featured featured featured featured featured'
				'title title title title title title . . . . . .'
				'title title title title title title . . . . . .';
		}
	}

	/* Apply grid areas to image elements */
	.gallery-image-1 {
		grid-area: image-1;
	}
	.gallery-image-2 {
		grid-area: image-2;
	}
	.gallery-image-3 {
		grid-area: image-3;
	}
	.gallery-image-4 {
		grid-area: image-4;
	}
	.gallery-image-5 {
		grid-area: image-5;
	}

	/* Fine-tuning for ultra-wide screens */
	@media (min-width: 1280px) {
		:root {
			--text-heading: clamp(2.5rem, 3rem + 2vw, 3.75rem);
		}
		.gallery-4 {
			grid-template-areas:
				'featured featured featured featured featured featured featured image-1 image-1 image-2 image-2 image-2'
				'featured featured featured featured featured featured featured image-1 image-1 image-2 image-2 image-2'
				'featured featured featured featured featured featured featured title title image-3 image-3 image-3'
				'featured featured featured featured featured featured featured title title image-3 image-3 image-3'
				'featured featured featured featured featured featured featured title title image-3 image-3 image-3';
		}

		.gallery-3 {
			grid-template-areas:
				'featured featured featured featured featured featured image-1 image-1 image-1 image-2 image-2 image-2'
				'featured featured featured featured featured featured image-1 image-1 image-1 image-2 image-2 image-2'
				'featured featured featured featured featured featured title title title image-2 image-2 image-2'
				'featured featured featured featured featured featured title title title image-2 image-2 image-2'
				'featured featured featured featured featured featured title title title image-2 image-2 image-2';
		}
	}

	/* Smooth transitions for all interactive elements */
	.gallery-featured,
	.gallery-image,
	.gallery-mobile-image {
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
	}
</style>
