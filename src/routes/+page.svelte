<script lang="ts">
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const { posts, press } = data;

	const featuredPost = $derived(posts[0]);
	const remainingPosts = $derived(posts.slice(1));
</script>

<SEO
	title="Diagram Chasing"
	description="Data-driven works of various interests, shared once in a while"
	keywords="data visualization, india, data journalism, interactive graphics"
/>

<div class="mx-auto max-w-5xl px-4 py-12">
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

	<!-- Press & Talks -->
	{#if press.length > 0}
		<section class="mt-20 border-t border-border pt-10">
			<h2 class="mb-6 text-xs font-medium uppercase tracking-widest text-muted-foreground">
				Press & Talks
			</h2>
			<div class="divide-y divide-border">
				{#each press as item}
					<a
						href={item.url}
						target="_blank"
						rel="noopener noreferrer"
						class="group flex flex-wrap items-baseline gap-x-4 gap-y-1 py-4 no-underline"
					>
						<span class="text-xs uppercase tracking-wide text-muted-foreground">
							{item.type ?? 'press'}
						</span>
						<span class="font-serif text-base font-bold leading-tight">
							{item.source}
						</span>
						<span class="basis-full text-sm leading-relaxed text-muted-foreground transition-colors group-hover:text-foreground sm:basis-auto sm:flex-1">
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
