<script lang="ts">
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import * as Table from '$lib/components/ui/table/index.js';
	import type { PageData } from './$types';
	import Logo from '$lib/components/Logo.svelte';
	import Sticker from '$lib/components/Sticker.svelte';
	import PageDiagram from '$lib/components/PageDiagram.svelte';
	let { data }: { data: PageData } = $props();

	let pageContainer: HTMLElement | undefined = $state();
	const logoFiles = import.meta.glob('$lib/assets/logos/*.png', {
		eager: true,
		query: '?url',
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
</script>

<SEO
	title="Diagram Chasing"
	description="Data-driven works of various interests, shared once in a while"
	keywords="data visualization, india, data journalism, interactive graphics"
/>

<div class="relative isolate" bind:this={pageContainer}>
	<PageDiagram containerEl={pageContainer} />

	<div
		class="mx-auto mb-6 flex max-w-5xl flex-col items-center gap-4 px-4 sm:flex-row sm:items-center sm:gap-8 sm:px-0 sm:py-0"
	>
		<div class="[--logo-size:72px] sm:[--logo-size:150px]">
			<Sticker radius={3}>
				<Logo size={150} />
			</Sticker>
		</div>

		<div data-diagram-header class="flex flex-col gap-2">
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
				Data-driven <span class="font-bold underline underline-offset-[0.12em]">visual stories</span
				>
				and
				<span class="font-bold underline underline-offset-[0.12em]">tools</span>, with
				<span class="font-bold underline underline-offset-[0.12em]">datasets</span>
				of public interest
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
				{#each remainingPosts as post}
					<div data-diagram-node>
						<ProjectCard {post} />
					</div>
				{/each}
			</div>
		{/if}

		<!-- news & Talks -->
		{#if news.length > 0}
			<section class="mt-16">
				<h2 class="my-4 text-center font-serif text-2xl font-bold uppercase">As seen in</h2>
				<Table.Root class="overflow-clip">
					<Table.Header class="hidden">
						<Table.Row class="m-0 h-0 border-none p-0 hover:bg-transparent">
							<Table.Head class="text-xs tracking-wide uppercase"></Table.Head>
							<Table.Head class="w-full text-xs tracking-wide uppercase"></Table.Head>
							<Table.Head></Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each news as item}
							<Table.Row
								class="group relative hover:bg-transparent max-sm:block max-sm:border-b max-sm:py-4"
							>
								<Table.Cell class="pl-0 max-sm:p-0">
									<div class="flex items-center gap-3">
										<div
											class="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded border border-border bg-white p-px shadow-sm"
										>
											{#if getLogo(item.url)}
												<img
													src={getLogo(item.url)}
													alt={item.source}
													class="h-full w-full object-contain transition-all group-hover:grayscale-0"
												/>
											{:else}
												<span class="text-[10px] font-bold text-muted-foreground/40">
													{item.source?.charAt(0)}
												</span>
											{/if}
										</div>
										<span class="font-serif text-base leading-tight font-bold">
											{item.source}
										</span>
									</div>
								</Table.Cell>

								<Table.Cell
									class="w-full text-sm leading-relaxed whitespace-normal text-muted-foreground transition-colors group-hover:text-foreground max-sm:mt-1 max-sm:block max-sm:p-0"
								>
									<a
										href={item.url}
										target="_blank"
										rel="noopener noreferrer"
										class="no-underline outline-none after:absolute after:inset-0"
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
	</div>
</div>
<!-- end pageContainer -->
