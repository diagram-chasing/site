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
<div class="@container w-full max-w-full font-sans {className}">
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
						<span>{author}{i < post.authors.length - 1 ? ', ' : ''}</span>
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

		<!-- Additional Images -->
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
	.gallery-grid {
		display: grid;
		height: 70vh;
		width: 100%;
		gap: 0.5rem;
		grid-template-columns: 1fr;
		grid-template-rows: auto 1fr auto;
	}

	.gallery-title {
		display: flex;
		flex-direction: column;
		justify-content: end;
		gap: 0.75rem;
		grid-area: title;
	}

	.gallery-year {
		font-size: 0.75rem;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: rgb(100 116 139);
	}

	.gallery-heading {
		font-family: var(--font-serif, Georgia, serif);
		font-size: 2rem;
		line-height: 1.1;
		font-weight: 900;
		letter-spacing: -0.025em;
		color: var(--foreground);
	}

	.gallery-content {
		max-width: 65ch;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.gallery-description {
		font-size: 0.875rem;
		line-height: 1.6;
		color: rgb(100 116 139);
	}

	.gallery-authors {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--foreground);
	}

	.gallery-buttons {
		display: flex;
		gap: 0.5rem;
	}

	.gallery-featured,
	.gallery-image {
		position: relative;
		overflow: hidden;
		border-radius: 0.125rem;
		background-color: rgb(248 250 252);
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
	}

	.gallery-featured {
		grid-area: featured;
	}

	/* Tablet Layout */
	@container (min-width: 768px) {
		.gallery-grid {
			height: 70vh;
			gap: 0.75rem;
			grid-template-columns: repeat(8, 1fr);
			grid-template-rows: repeat(4, 1fr);
		}

		.gallery-year {
			font-size: 0.8rem;
		}

		.gallery-heading {
			font-size: 2.25rem;
		}

		.gallery-description {
			font-size: 1rem;
		}

		.gallery-authors {
			font-size: 0.875rem;
		}

		.gallery-buttons {
			gap: 1rem;
		}

		.gallery-1 {
			grid-template-areas: 
				"featured featured featured featured featured title title title"
				"featured featured featured featured featured title title title"
				"featured featured featured featured featured . . ."
				"featured featured featured featured featured . . .";
		}

		.gallery-2 {
			grid-template-areas:
				"featured featured featured featured featured image-1 image-1 image-1"
				"featured featured featured featured featured image-1 image-1 image-1"
				"featured featured featured featured featured title title title"
				"featured featured featured featured featured title title title";
		}

		.gallery-3 {
			grid-template-areas:
				"featured featured featured featured featured image-1 image-1 image-2"
				"featured featured featured featured featured image-1 image-1 image-2"
				"featured featured featured featured featured title title title"
				"featured featured featured featured featured title title title";
		}

		.gallery-4 {
			grid-template-areas:
				"featured featured featured featured image-1 image-1 image-2 image-2"
				"featured featured featured featured image-1 image-1 image-2 image-2"
				"featured featured featured featured title title title title"
				"featured featured featured featured image-3 image-3 image-3 image-3";
		}

		.gallery-5 {
			grid-template-areas:
				"featured featured featured featured image-1 image-1 image-2 image-2"
				"featured featured featured featured image-1 image-1 image-2 image-2"
				"featured featured featured featured image-3 image-3 image-4 image-4"
				"featured featured featured featured title title title title";
		}

		.gallery-6 {
			grid-template-areas:
				"featured featured featured featured image-1 image-1 image-2 image-2"
				"featured featured featured featured image-1 image-1 image-2 image-2"
				"featured featured featured featured image-3 image-3 image-4 image-4"
				"featured featured featured featured image-5 image-5 title title";
		}
	}

	/* Desktop Layout - Preserve exact current appearance */
	@container (min-width: 900px) {
		.gallery-grid {
			height: 80vh;
			gap: 1rem;
			grid-template-columns: repeat(12, 1fr);
			grid-template-rows: repeat(5, 1fr);
		}

		.gallery-year {
			font-size: 0.875rem;
		}

		.gallery-heading {
			font-size: 3rem;
		}

		.gallery-description {
			font-size: 1.125rem;
			line-height: 1.6;
		}

		.gallery-authors {
			font-size: 0.875rem;
		}

		.gallery-title {
			gap: 0.25rem;
		}
	}

	@container (min-width: 1280px) {
		.gallery-heading {
			font-size: 3.75rem;
		}

		.gallery-description {
			font-size: 1.125rem;
		}
	}

	/* Layout-specific grid areas */
	.gallery-1 {
		grid-template-areas:
			'title'
			'featured'
			'featured';
	}

	@container (min-width: 900px) {
		.gallery-1 {
			grid-template-areas:
				'featured featured featured featured featured featured . . . . . .'
				'featured featured featured featured featured featured . title title title title title'
				'featured featured featured featured featured featured . title title title title title'
				'featured featured featured featured featured featured . . . . . .'
				'featured featured featured featured featured featured . . . . . .';
		}
	}

	.gallery-2 {
		grid-template-areas:
			'title'
			'featured'
			'featured'
			'image-1';
	}

	@container (min-width: 900px) {
		.gallery-2 {
			grid-template-areas:
				'featured featured featured featured featured featured . . . image-1 image-1 image-1'
				'featured featured featured featured featured featured . . . image-1 image-1 image-1'
				'featured featured featured featured featured featured . title title image-1 image-1 image-1'
				'featured featured featured featured featured featured . title title image-1 image-1 image-1'
				'featured featured featured featured featured featured . title title image-1 image-1 image-1';
		}
	}

	.gallery-3 {
		grid-template-areas:
			'title'
			'featured'
			'featured'
			'image-1'
			'image-2';
	}

	@container (min-width: 900px) {
		.gallery-3 {
			grid-template-areas:
				'featured featured featured featured featured featured image-1 image-1 image-1 image-2 image-2 image-2'
				'featured featured featured featured featured featured image-1 image-1 image-1 image-2 image-2 image-2'
				'featured featured featured featured featured featured image-1 image-1 image-1 image-2 image-2 image-2'
				'featured featured featured featured featured featured title title title image-2 image-2 image-2'
				'featured featured featured featured featured featured title title title image-2 image-2 image-2';
		}
	}

	.gallery-4 {
		grid-template-areas:
			'title'
			'featured'
			'featured'
			'image-1'
			'image-2'
			'image-3';
	}

	@container (min-width: 900px) {
		.gallery-4 {
			grid-template-areas:
				'featured featured featured featured featured featured featured image-1 image-1 image-2 image-2 image-2'
				'featured featured featured featured featured featured featured image-1 image-1 image-2 image-2 image-2'
				'featured featured featured featured featured featured featured title title image-3 image-3 image-3'
				'featured featured featured featured featured featured featured title title image-3 image-3 image-3'
				'featured featured featured featured featured featured featured title title image-3 image-3 image-3';
		}
	}

	.gallery-5 {
		grid-template-areas:
			'title'
			'featured'
			'featured'
			'image-1'
			'image-2'
			'image-3'
			'image-4';
	}

	@container (min-width: 900px) {
		.gallery-grid.gallery-5 {
			grid-template-rows: repeat(6, 1fr);
		}

		.gallery-5 {
			grid-template-areas:
				'featured featured featured featured featured featured image-1 image-1 image-1 image-2 image-2 image-2'
				'featured featured featured featured featured featured image-1 image-1 image-1 image-2 image-2 image-2'
				'featured featured featured featured featured featured image-3 image-3 image-3 image-4 image-4 image-4'
				'featured featured featured featured featured featured image-3 image-3 image-3 image-4 image-4 image-4'
				'featured featured featured featured featured featured title title title title title title'
				'featured featured featured featured featured featured title title title title title title';
		}
	}

	.gallery-6 {
		grid-template-areas:
			'title'
			'featured'
			'featured'
			'image-1'
			'image-2'
			'image-3'
			'image-4'
			'image-5';
	}

	@container (min-width: 900px) {
		.gallery-grid.gallery-6 {
			grid-template-rows: repeat(6, 1fr);
		}

		.gallery-6 {
			grid-template-areas:
				'image-1 image-1 image-2 image-2 image-3 image-3 featured featured featured featured featured featured'
				'image-1 image-1 image-2 image-2 image-3 image-3 featured featured featured featured featured featured'
				'image-4 image-4 image-4 image-5 image-5 image-5 featured featured featured featured featured featured'
				'image-4 image-4 image-4 image-5 image-5 image-5 featured featured featured featured featured featured'
				'title title title title title title . . . . . .'
				'title title title title title title . . . . . .';
		}
	}

	/* Apply grid areas to elements */
	.gallery-title {
		grid-area: title;
	}
	.gallery-featured {
		grid-area: featured;
	}
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
</style>
