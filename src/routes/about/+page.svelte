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
				<a href="/authors/aman">Aman</a> and <a href="/authors/vivek">Vivek</a> started Diagram Chasing
				in 2024 to build the kind of data-driven stories and tools we wished existed for India and our
				part of the world. The name is apt; everything we create begins with a question, an argument,
				a passing theory, or a daily annoyance that we decide to 'chase' down using data and design.
			</p>
			<p>
				We practice full-stack data journalism because we genuinely love every step of the process,
				from collecting datasets and writing analysis pipelines to designing the final interactive
				experience or story. Because we believe in accessible knowledge and transparency, all our
				data and code is released publicly under open licenses.
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
				We are proudly independent, and to our knowledge, the only data publication of its kind in
				India. Our goal is to take often "boring" issues—like elections, climate, economics, and
				bureaucracy—and make them undeniably cool through visual storytelling. These topics can
				sometimes feel dry on paper, but we hope our work feels like listening to a friend excitedly
				explain their latest obsession, and make you care about it too.
			</p>
			<p>
				We are also slow by design. Our projects unfold over weeks and months, ensuring that when we
				finally publish, we are confident about what we produced. To bring these stories to life
				with the care they deserve, we regularly collaborate with talented illustrators, animators,
				writers, and creatives of all kinds.
			</p>

			<h2 id="funding" class="font-serif text-xl font-bold">Who funds us?</h2>
			<p>
				So far, it's been mostly us. We've funded the research, infrastructure, software tools, and
				honorariums for our collaborators straight out of our own pockets. However, our dream is to
				make Diagram Chasing a truly sustainable, community-backed publication. In 2025, we reached
				a big milestone where for the very first time, <a href="/support">reader support</a> covered
				a meaningful portion of our running costs. With your help, it's a model we hope to keep growing.
			</p>

			<h2 id="work-with-us" class="font-serif text-xl font-bold">Work with us</h2>
			<p>
				We love building, and we love helping others do the same. While we're always eager to
				collaborate with fellow creatives on our own stories, we also take on professional
				commissions. Whether you're a newsroom sitting on an unwieldy dataset, an organization
				looking to build data stories or applications, or simply someone who needs a team of
				full-stack data nerds to bring an idea to life, we'd love to connect. <strong
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
