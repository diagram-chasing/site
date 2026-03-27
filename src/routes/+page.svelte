<script lang="ts">
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import type { PageData } from './$types';
	import Logo from '$lib/components/Logo.svelte';
	import PageDiagram from '$lib/components/PageDiagram.svelte';
	import Image from '$lib/components/ui/Image.svelte';

	let { data }: { data: PageData } = $props();

	const logoFiles = import.meta.glob('$lib/assets/logos/*.png', {
		eager: true,
		query: { w: 204, format: 'webp' },
		import: 'default'
	});

	const { posts, news } = data;

	// Helper to find the right logo based on the URL
	function getLogo(url: string) {
		try {
			const domain = new URL(url).hostname.replace('www.', '').replace(/\./g, '-');
			const path = `/src/lib/assets/logos/${domain}.png`;
			return (logoFiles[path] as string) || null;
		} catch {
			return null;
		}
	}

	const featuredPost = $derived(posts[0]);
	const remainingPosts = $derived(posts.slice(1));

	// Inline thumbnail cycling — gallery images only (excludes main thumbnail)
	const storyImages = $derived(
		posts
			.filter((p) => p.type === 'stories' || p.type === 'article')
			.flatMap((p) => p.gallery ?? [])
			.filter(Boolean)
	);
	const toolImages = $derived(
		posts
			.filter((p) => p.type === 'interactive')
			.flatMap((p) => p.gallery ?? [])
			.filter(Boolean)
	);

	// Two separate ticks, staggered by half a cycle
	let storyTick = $state(0);
	let toolTick = $state(0);
	const storyIdx = $derived(storyImages.length > 0 ? storyTick % storyImages.length : 0);
	const toolIdx = $derived(toolImages.length > 0 ? toolTick % toolImages.length : 0);

	$effect(() => {
		const t1 = setInterval(() => {
			storyTick++;
		}, 2500);
		let t2: ReturnType<typeof setInterval>;
		const offset = setTimeout(() => {
			t2 = setInterval(() => {
				toolTick++;
			}, 2500);
		}, 1250);
		return () => {
			clearInterval(t1);
			clearInterval(t2);
			clearTimeout(offset);
		};
	});
</script>

{#snippet inlineThumb(images: any[], idx: number)}
	{#if images.length > 0}
		<span
			class="relative mx-2.5 my-0.5 inline-block shrink-0 overflow-hidden rounded border border-border align-middle"
			style="height: 1.8em; width: 3.8em;"
			aria-hidden="true"
		>
			{#each images as img, i (i)}
				<span
					class="absolute inset-0 transition-opacity duration-700"
					style:opacity={i === idx ? 1 : 0}
				>
					<Image src={img} alt="" class="h-full w-full object-cover" loading="lazy" />
				</span>
			{/each}
		</span>
	{/if}
{/snippet}

<SEO
	title="Diagram Chasing"
	description="Data-driven works of various interests, shared once in a while"
	keywords="data visualization, india, data journalism, interactive graphics"
/>

<div class="relative isolate">
	<PageDiagram />

	<div
		class="mx-auto -mt-[56px] flex max-w-5xl flex-col items-center gap-4 px-4 sm:mt-0 sm:mb-6 sm:flex-row sm:items-center sm:gap-8 sm:px-0 sm:py-0"
	>
		<div class="logo-home-wrapper pointer-events-none shrink-0">
			<!-- <Sticker radius={3}> -->
			<Logo size={150} />
			<!-- </Sticker> -->
		</div>

		<div data-diagram-header class="flex flex-col gap-2">
			<p
				class="m-0 mx-auto w-fit font-serif leading-none font-bold tracking-tight sm:mx-0"
				style="font-size: clamp(2.2rem, 3.5vw + 1.2rem, 3.375rem);"
			>
				Diagram Chasing
			</p>
			<p
				class="mx-auto max-w-[450px] leading-8 -tracking-wide sm:mx-0 sm:max-w-none sm:pl-0 sm:text-left md:max-w-[600px]"
				style="font-size: clamp(1.35rem, 1.5vw + 0.6rem, 1.75rem);  text-wrap: balance;"
			>
				<span class="font-bold underline underline-offset-[0.12em]">Visual stories</span
				>{@render inlineThumb(storyImages, storyIdx)}<br class="sm:hidden" />and
				<span class="font-bold underline underline-offset-[0.12em]">tools</span
				>{@render inlineThumb(toolImages, toolIdx)} for <br class="sm:hidden" />
				<span class="font-bold underline underline-offset-[0.12em]">public data</span>
				worth looking at
			</p>
		</div>
	</div>
	<div class="mx-auto max-w-5xl px-4 pt-6 pb-12">
		<!-- Featured project -->
		{#if featuredPost}
			<div data-diagram-node>
				<ProjectCard post={featuredPost} featured={true} />
			</div>
		{/if}

		<!-- Rest of the grid -->
		{#if remainingPosts.length > 0}
			<div class="mt-14 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-2">
				{#each remainingPosts as post (post.slug)}
					<div data-diagram-node>
						<ProjectCard {post} />
					</div>
				{/each}
			</div>
		{/if}

		<!-- As seen in — logo wall -->
		{#if news.length > 0}
			{@const seenSources = [...new Map(news.map((n) => [n.source, n])).values()]}
			<section class="mt-16">
				<h2 class="mb-6 text-center font-serif text-2xl text-muted-foreground/80 lowercase italic">
					...seen in places like
				</h2>
				<a href="/about#press" class="no-underline">
					<div class="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
						{#each seenSources as item (item.source)}
							{@const logo = getLogo(item.url)}
							<div
								class="flex h-14 w-auto max-w-24 items-center justify-center overflow-hidden rounded bg-white p-1 opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0 sm:h-20 sm:max-w-30 sm:p-1.5"
								title={item.source}
							>
								{#if logo}
									<img src={logo} alt={item.source} class="h-full w-full object-contain" />
								{:else}
									<span class="text-[10px] font-bold text-muted-foreground">{item.source}</span>
								{/if}
							</div>
						{/each}
					</div>
				</a>
			</section>
		{/if}
		<div class="mt-8 overflow-hidden border border-border">
			<a
				href="/support"
				class="group relative flex flex-col items-center gap-4 bg-foreground/5 p-5 no-underline sm:flex-row sm:items-center sm:justify-between"
			>
				<p
					class="text-center text-xl leading-[1.3] -tracking-wide text-balance
						sm:text-left sm:text-[22px] sm:leading-[1.4]
						lg:text-[20px]"
				>
					We are an independent publication <span
						class="font-bold underline underline-offset-[0.12em]"
					>
						made possible by readers like you</span
					>
				</p>
				<div
					class="flex w-fit shrink-0 items-center gap-2 border border-transparent bg-card-foreground p-2 text-sm text-background transition-colors"
				>
					<span>Support our work</span>
					<ArrowUpRight
						size={12}
						class="ml-auto shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
					/>
				</div>
			</a>
		</div>
	</div>
</div>

<style>
	@media (max-width: 639px) {
		.logo-home-wrapper {
			--logo-size: 100px;
		}
	}
</style>
