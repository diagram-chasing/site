<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import Image from '$lib/components/ui/Image.svelte';
	import cafesImg from '$lib/assets/cafes.jpg?enhanced';
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
		<h1 class="font-serif text-display leading-none font-bold tracking-tight">About</h1>

		<div class="page-prose mt-8">
			<p>
				Diagram Chasing was started by <a href="/authors/aman">Aman</a> and
				<a href="/authors/vivek">Vivek</a> in 2024 because we had some time on our hands and wanted to
				build the kind of data-driven stories and tools we wanted to see for ourselves. The name feels
				apt: our process always starts with a question, an argument, a quip, a theory, or someone's passing
				annoyance that we decide to 'chase' down with data and visuals.
			</p>
			<p>
				We call it full-stack data journalism because every part of the process makes us feel alive.
				From assembling new datasets and writing analysis pipelines to designing and developing the
				final story or application. Transparency is important to us, so all our data and code is
				released publicly under open licenses.
			</p>
		</div>

		<div class="page-prose mt-8 overflow-hidden">
			<figure class="mb-4 w-full sm:float-right sm:mb-2 sm:ml-8 sm:w-80">
				<div class="overflow-hidden border border-border">
					<Image
						src={cafesImg}
						alt="Person working on a laptop at a cafe in Bangalore"
						class="h-full w-full object-cover object-center"
						loading="lazy"
					/>
				</div>
				<figcaption class="mt-2 text-right text-sm text-balance italic">
					Every project is made nomadically in random cafes around Bangalore
				</figcaption>
			</figure>
			<p>
				As far as we can tell, we're the only independent data publication of its kind in India. We
				want to write stories about our part of the world. We want to understand issues like
				elections, governance, cities, climate, economics, and bureaucracy that affects our lives.
				These topics can often feel tedious on the surface, but just like listening to a friend talk
				excitedly about their latest obsession, we like to think that you'll end up caring about
				them, too.
			</p>
			<p>
				We are slow by design. Our projects develop over weeks and months, and that slowness is a
				conscious choice. When we do put something out into the world, we want to be absolutely
				certain about what we're saying, and we want you to feel the care that went into it. To help
				us do this better, we regularly work alongside illustrators, animators, writers, and
				talented human collaborators of all kinds.
			</p>

			<h2 id="funding" class="font-serif text-xl font-bold">Who funds us?</h2>
			<p>
				Short answer: mostly us. The money for research, server infrastructure, software tools, and
				honorariums for our collaborators has usually come straight out of our own pockets. But our
				long-term goal is to make Diagram Chasing a truly sustainable, independent publication. In
				2025, we hit a milestone when <a href="/support">reader support</a> covered a real portion of
				our running costs for the very first time. It's a model we hope to keep growing.
			</p>

			<h2 id="work-with-us" class="font-serif text-xl font-bold">Work with us</h2>
			<p>
				We love building things, and we love helping other people build things. We are always
				looking to collaborate with fellow creatives on our projects, but we also take on
				professional commissions. Whether you're a newsroom sitting on a massive, unwieldy dataset,
				an organization that wants to create data stories or applications, or someone who needs
				full-stack data nerds to bring an idea to life, we'd love to talk! <strong
					>Shoot us an email at hello@diagramchasing.fun</strong
				>.
			</p>
		</div>
	</div>

	{#if news.length > 0}
		<section id="press">
			<h2 class="font-serif text-2xl font-bold uppercase">Press & Talks</h2>
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
