<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { news } = data;

	const logoFiles = import.meta.glob('$lib/assets/logos/*.png', {
		eager: true,
		query: { w: 104, format: 'webp' },
		import: 'default'
	});

	function getLogo(url: string) {
		try {
			const domain = new URL(url).hostname.replace('www.', '').replace(/\./g, '-');
			const path = `/src/lib/assets/logos/${domain}.png`;
			return (logoFiles[path] as string) || null;
		} catch {
			return null;
		}
	}

	// Group news by source, preserving order of first appearance
	const newsGrouped = news.reduce(
		(acc, item) => {
			const existing = acc.find((g) => g.source === item.source);
			if (existing) {
				existing.items.push(item);
			} else {
				acc.push({ source: item.source, items: [item] });
			}
			return acc;
		},
		[] as { source: string; items: typeof news }[]
	);
</script>

<SEO
	title="About | Diagram Chasing"
	description="Diagram Chasing is an independent data journalism publication producing visual stories, interactive tools, and datasets of public interest."
	keywords="about, data visualization, india, data journalism"
/>

<div class="mx-auto max-w-5xl px-4 py-12">
	<div class="mb-16">
		<h1 class="font-serif text-display font-bold leading-none tracking-tight">About</h1>

		<div class="mt-8 max-w-2xl space-y-4 text-lg leading-relaxed">
			<p>
				Diagram Chasing is an independent publication producing data-driven visual stories,
				interactive tools, and datasets of public interest — focused primarily on India.
			</p>
			<p>
				We believe in making data accessible and meaningful. Our work spans investigative data
				journalism, exploratory data tools, and open datasets that anyone can use.
			</p>
			<p>
				We are made possible by readers like you. If you find our work valuable, consider <a
					href="/support">supporting us</a
				>.
			</p>
		</div>
	</div>

	{#if news.length > 0}
		<section>
			<h2 class="mb-8 font-serif text-2xl font-bold uppercase">As seen in</h2>
			<div class="divide-y divide-border/40">
				{#each newsGrouped as group (group.source)}
					{#if group.items.length === 1}
						{@const item = group.items[0]}
						<div class="group/item relative flex items-center gap-3 py-2.5">
							<div class="flex w-36 shrink-0 items-center gap-2 sm:w-44">
								<div
									class="flex size-15 shrink-0 items-center justify-center overflow-hidden rounded bg-white p-px"
								>
									{#if getLogo(item.url)}
										<img src={getLogo(item.url)} alt="" class="h-full w-full object-contain" />
									{:else}
										<span class="text-[9px] font-bold text-muted-foreground/40"
											>{group.source?.charAt(0)}</span
										>
									{/if}
								</div>
								<span class="font-serif text-sm leading-tight font-bold">{group.source}</span>
							</div>
							<a
								href={item.url}
								target="_blank"
								rel="noopener noreferrer"
								class="flex flex-1 items-start gap-2 no-underline after:absolute after:inset-0"
							>
								<span
									class="flex-1 text-sm leading-snug underline-offset-4 transition-colors group-hover/item:underline"
									>{item.title}</span
								>
								<ArrowUpRight
									size={12}
									class="mt-0.5 shrink-0 text-muted-foreground transition-transform group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5"
								/>
							</a>
						</div>
					{:else}
						<div class="flex items-start gap-3 py-2.5">
							<div class="flex w-36 shrink-0 items-center gap-2 pt-0.5 sm:w-44">
								<div
									class="flex size-15 shrink-0 items-center justify-center overflow-hidden rounded bg-white p-px"
								>
									{#if getLogo(group.items[0].url)}
										<img
											src={getLogo(group.items[0].url)}
											alt=""
											class="h-full w-full object-contain"
										/>
									{:else}
										<span class="text-[9px] font-bold text-muted-foreground/40"
											>{group.source?.charAt(0)}</span
										>
									{/if}
								</div>
								<span class="font-serif text-sm leading-tight font-bold">{group.source}</span>
							</div>
							<ul class="flex-1 space-y-1.5">
								{#each group.items as item (item.url)}
									<li class="group/item relative flex items-start">
										<a
											href={item.url}
											target="_blank"
											rel="noopener noreferrer"
											class="flex flex-1 items-start gap-2 no-underline after:absolute after:inset-0"
										>
											<span
												class="flex-1 text-sm leading-snug underline-offset-4 transition-colors group-hover/item:underline"
												>{item.title}</span
											>
											<ArrowUpRight
												size={12}
												class="mt-0.5 shrink-0 text-muted-foreground transition-transform group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5"
											/>
										</a>
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				{/each}
			</div>
		</section>
	{/if}
</div>
