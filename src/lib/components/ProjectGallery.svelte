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

	// Create array of all images (main + gallery)
	const allImages = $derived.by(() => {
		const images = [post.image];
		if (post.gallery && post.gallery.length > 0) {
			images.push(...post.gallery);
		}
		return images.slice(0, 6); // Max 6 images for better grid layouts
	});

	// Editorial grid layouts with title as separate grid item - full 12 column usage
	const getGridLayout = (imageCount: number) => {
		const layouts = {
			1: {
				grid: 'grid-cols-12 @lg:grid-rows-5 gap-2 @lg:gap-4',
				title: {
					classes: 'col-span-12 @lg:col-span-6 @lg:row-span-2 @lg:col-start-7 @lg:row-start-2'
				},
				featured: { classes: 'col-span-12 @lg:col-span-6 @lg:row-span-5' },
				images: []
			},
			2: {
				grid: 'grid-cols-12 @lg:grid-rows-5 gap-2 @lg:gap-4',
				title: {
					classes: 'col-span-12 @lg:col-span-3 @lg:row-span-3 @lg:col-start-7 @lg:row-start-3'
				},
				featured: { classes: 'col-span-12 @lg:col-span-6 @lg:row-span-5' },
				images: [{ classes: 'col-span-12 @lg:col-span-3 @lg:row-span-5 @lg:col-start-10' }]
			},
			3: {
				grid: 'grid-cols-12 @lg:grid-rows-5 gap-2 @lg:gap-4',
				title: {
					classes: 'col-span-12 @lg:col-span-3 @lg:row-span-3 @lg:col-start-7 @lg:row-start-3'
				},
				featured: { classes: 'col-span-12 @lg:col-span-6 @lg:row-span-5' },
				images: [
					{ classes: 'col-span-6 @lg:col-span-3 @lg:row-span-3 @lg:col-start-7 @lg:row-start-1' },
					{ classes: 'col-span-6 @lg:col-span-3 @lg:row-span-5 @lg:col-start-10' }
				]
			},
			4: {
				grid: 'grid-cols-12 @lg:grid-rows-5 gap-2 @lg:gap-4',
				title: {
					classes: 'col-span-12 @lg:col-span-2 @lg:row-span-5 @lg:col-start-8 @lg:row-start-1'
				},
				featured: { classes: 'col-span-12 @lg:col-span-7 @lg:row-span-5' },
				images: [
					{ classes: 'col-span-4 @lg:col-span-2 @lg:row-span-2 @lg:col-start-8 @lg:row-start-1' },
					{ classes: 'col-span-4 @lg:col-span-3 @lg:row-span-2 @lg:col-start-10 @lg:row-start-1' },
					{ classes: 'col-span-4 @lg:col-span-3 @lg:row-span-3 @lg:col-start-10 @lg:row-start-3 ' }
				]
			},
			5: {
				grid: 'grid-cols-12 @lg:grid-rows-6 gap-2 @lg:gap-4',
				title: {
					classes: 'col-span-12 @lg:col-span-6 @lg:row-span-2 @lg:col-start-7 @lg:row-start-5'
				},
				featured: { classes: 'col-span-12 @lg:col-span-6 @lg:row-span-4' },
				images: [
					{ classes: 'col-span-6 @lg:col-span-3 @lg:row-span-2 @lg:col-start-7 @lg:row-start-1' },
					{ classes: 'col-span-6 @lg:col-span-3 @lg:row-span-2 @lg:col-start-10 @lg:row-start-1' },
					{ classes: 'col-span-6 @lg:col-span-3 @lg:row-span-2 @lg:col-start-7 @lg:row-start-3' },
					{ classes: 'col-span-6 @lg:col-span-3 @lg:row-span-2 @lg:col-start-10 @lg:row-start-3' }
				]
			},
			6: {
				grid: 'grid-cols-12 @lg:grid-rows-6 gap-2 @lg:gap-4',
				title: {
					classes: 'col-span-12 @lg:col-span-6 @lg:row-span-2 @lg:col-start-1 @lg:row-start-5'
				},
				featured: { classes: 'col-span-12 @lg:col-span-6 @lg:row-span-4 @lg:col-start-7' },
				images: [
					{ classes: 'col-span-4 @lg:col-span-2 @lg:row-span-2 @lg:col-start-1 @lg:row-start-1' },
					{ classes: 'col-span-4 @lg:col-span-2 @lg:row-span-2 @lg:col-start-3 @lg:row-start-1' },
					{ classes: 'col-span-4 @lg:col-span-2 @lg:row-span-2 @lg:col-start-5 @lg:row-start-1' },
					{ classes: 'col-span-6 @lg:col-span-3 @lg:row-span-2 @lg:col-start-1 @lg:row-start-3' },
					{ classes: 'col-span-6 @lg:col-span-3 @lg:row-span-2 @lg:col-start-4 @lg:row-start-3' }
				]
			}
		};
		return layouts[imageCount as keyof typeof layouts] || layouts[1];
	};

	const layout = $derived(getGridLayout(allImages.length));
</script>

<!-- Editorial Grid Layout -->
<div class="@container w-full max-w-full font-sans {className}">
	<div class="grid h-[50vh] w-full @lg:h-[80vh] {layout.grid}">
		<!-- Title Block -->
		<div class="relative flex flex-col justify-end space-y-6 @lg:space-y-1 {layout.title.classes}">
			<div class="space-y-1">
				<div
					class="text-xs font-medium tracking-widest text-muted-foreground uppercase @lg:text-sm"
				>
					{new Date(post.date).getFullYear()} —
				</div>
				<h1
					use:balancer
					class="w-[10ch] font-serif text-3xl leading-none font-black tracking-tighter text-foreground @lg:text-6xl @xl:text-6xl"
				>
					{post.title}
				</h1>
			</div>

			<div class="max-w-prose space-y-3">
				<p class="text-base leading-relaxed text-muted-foreground @lg:text-lg @lg:leading-relaxed">
					{post.description}
				</p>

				<div class="flex items-center gap-1 text-sm font-medium text-foreground">
					{#each post.authors as author, i}
						<span class="font-medium first-letter:uppercase"
							>{author}{i < post.authors.length - 1 ? ', ' : ''}</span
						>
					{/each}
				</div>

				<!-- Project Links -->
				<div class="flex gap-4">
					{#if post.base_url}
						<Button href={post.base_url} variant="default" size="default" class="font-medium">
							View Project
						</Button>
					{/if}

					{#if post.code}
						<Button href={post.code} variant="outline" size="default" class="font-medium">
							Source Code
						</Button>
					{/if}
				</div>
			</div>
		</div>

		<!-- Featured Image -->
		<div class="relative overflow-hidden rounded-sm bg-muted shadow-lg {layout.featured.classes}">
			<Image
				src={allImages[0]}
				alt="{post.title} - Featured"
				class="h-full w-full border object-cover transition-all duration-300 ease-out "
				loading="eager"
				sizes="(max-width: 768px) 100vw, (max-width: 1024px) 70vw, 50vw"
			/>
		</div>

		<!-- Additional Images -->
		{#each allImages.slice(1) as image, index}
			{#if layout.images[index]}
				<div
					class="relative overflow-hidden rounded-sm bg-muted shadow-sm {layout.images[index]
						.classes}"
				>
					<Image
						src={image}
						alt="{post.title} - Image {index + 2}"
						class="h-full w-full border object-cover transition-all duration-300 ease-out"
						loading="lazy"
						sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
					/>
				</div>
			{/if}
		{/each}
	</div>
</div>
