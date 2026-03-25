<script lang="ts">
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import type { PageData } from './$types';
	import Logo from '$lib/components/Logo.svelte';
	import { MediaQuery } from 'svelte/reactivity';

	let { data }: { data: PageData } = $props();

	const { posts, news } = data;

	const featuredPost = $derived(posts[0]);
	const remainingPosts = $derived(posts.slice(1));

	const isSmall = new MediaQuery('max-width: 639px', true);
</script>

<SEO
	title="Diagram Chasing"
	description="Data-driven works of various interests, shared once in a while"
	keywords="data visualization, india, data journalism, interactive graphics"
/>

<div
	class="mx-auto mb-6 flex max-w-5xl flex-col items-center gap-4 px-4 sm:flex-row sm:items-center sm:gap-8 sm:px-0 sm:py-0"
>
	<Logo size={isSmall.current ? 72 : 150} />

	<div class="flex flex-col gap-2">
		<p
			class="m-0 text-center font-serif text-[34px] leading-none
						 font-bold tracking-tight sm:text-left sm:text-[50px]
						 lg:text-[54px]"
		>
			Diagram Chasing
		</p>
		<p
			class="text-center text-xl leading-[1.3] -tracking-wide text-balance sm:w-2/3
						  sm:text-left sm:text-[22px] sm:leading-[1.4]
						  lg:text-[28px]"
		>
			Data-driven <span class="font-bold underline underline-offset-[0.12em]">visual stories</span>,
			<span class="font-bold underline underline-offset-[0.12em]">tools</span> and
			<span class="font-bold underline underline-offset-[0.12em]">datasets</span>
			of public interest
		</p>
	</div>
</div>

<div class="mx-auto max-w-5xl px-4 pt-6 pb-12">
	<!-- Featured project -->
	{#if featuredPost}
		<ProjectCard post={featuredPost} featured={true} />
	{/if}

	<!-- Rest of the grid -->
	{#if remainingPosts.length > 0}
		<div class="mt-14 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
			{#each remainingPosts as post}
				<ProjectCard {post} />
			{/each}
		</div>
	{/if}

	<!-- news & Talks -->
	{#if news.length > 0}
		<section class="mt-20 border-t border-border pt-10">
			<h2 class=" font-serif font-bold uppercase">Seen Around</h2>
			<div class="divide-y divide-border">
				{#each news as item}
					<a
						href={item.url}
						target="_blank"
						rel="noopener noreferrer"
						class="group flex flex-wrap items-baseline gap-x-4 gap-y-1 py-4 no-underline"
					>
						<span class="text-xs tracking-wide text-muted-foreground uppercase">
							{item.type ?? 'news'}
						</span>
						<span class="font-serif text-base leading-tight font-bold">
							{item.source}
						</span>
						<span
							class="basis-full text-sm leading-relaxed text-muted-foreground transition-colors group-hover:text-foreground sm:flex-1 sm:basis-auto"
						>
							{item.title}
						</span>
						<ArrowUpRight
							size={14}
							class="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
						/>
					</a>
				{/each}
			</div>
		</section>
	{/if}
</div>
