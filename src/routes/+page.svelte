<script lang="ts">
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import * as Table from '$lib/components/ui/table/index.js';
	import type { PageData } from './$types';
	import Logo from '$lib/components/Logo.svelte';
	import Sticker from '$lib/components/Sticker.svelte';
	import CommutativeDiagram from '$lib/components/CommutativeDiagram.svelte';
	import VisitorHeatmap from '$lib/components/VisitorHeatmap.svelte';
	let { data }: { data: PageData } = $props();

	const { posts, news, diagramTerms } = data;

	const featuredPost = $derived(posts[0]);
	const remainingPosts = $derived(posts.slice(1));
</script>

<SEO
	title="Diagram Chasing"
	description="Data-driven works of various interests, shared once in a while"
	keywords="data visualization, india, data journalism, interactive graphics"
/>

<div
	class="mx-auto mb-6 flex max-w-5xl flex-col items-center gap-4 px-4 sm:flex-row sm:items-center sm:gap-8 sm:px-0 sm:py-0"
>
	<div class="[--logo-size:72px] sm:[--logo-size:150px]">
		<Sticker>
			<Logo size={150} />
		</Sticker>
	</div>

	<div class="flex flex-col gap-2">
		<p
			class="m-0 mx-auto w-fit font-serif text-[34px] leading-none
						 font-bold tracking-tight sm:mx-0 sm:text-[50px]
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
<!--
<div class="mx-auto max-w-5xl px-4 sm:px-0">
	<CommutativeDiagram terms={diagramTerms} />
</div> -->

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
		<section class="mt-16 border-t border-border pt-6">
			<h2 class="my-4 font-serif font-bold uppercase">Seen Around</h2>
			<Table.Root class="overflow-clip">
				<Table.Header class="hidden">
					<Table.Row class="m-0 h-0 border-none p-0 hover:bg-transparent">
						<Table.Head class="pl-0 text-xs tracking-wide uppercase"></Table.Head>
						<Table.Head class="text-xs tracking-wide uppercase"></Table.Head>
						<Table.Head class="w-full text-xs tracking-wide uppercase"></Table.Head>
						<Table.Head></Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each news as item}
						<Table.Row
							class="group relative hover:bg-transparent max-sm:block max-sm:border-b max-sm:py-3"
						>
							<Table.Cell
								class="pl-0 text-xs font-medium tracking-wide text-muted-foreground uppercase max-sm:inline-block max-sm:p-0 max-sm:pr-3"
							>
								{item.type ?? 'news'}
							</Table.Cell>
							<Table.Cell
								class="font-serif text-base leading-tight font-bold max-sm:inline-block max-sm:p-0"
							>
								{item.source}
							</Table.Cell>
							<Table.Cell
								class="w-full text-sm leading-relaxed whitespace-normal text-muted-foreground transition-colors group-hover:text-foreground max-sm:mt-1 max-sm:block max-sm:p-0"
							>
								<a
									href={item.url}
									target="_blank"
									rel="noopener noreferrer"
									class="no-underline after:absolute after:inset-0"
								>
									{item.title}
								</a>
							</Table.Cell>
							<Table.Cell class="pr-0 text-right max-sm:hidden">
								<ArrowUpRight
									size={14}
									class="ml-auto text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
								/>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</section>
	{/if}

	<!-- <div class="mt-16 flex justify-center border-t border-border pt-8">
		<VisitorHeatmap />
	</div> -->
</div>
