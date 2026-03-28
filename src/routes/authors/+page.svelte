<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import {
		SiGithub as GithubIcon,
		SiX as TwitterIcon,
		SiInstagram as InstagramIcon
	} from '@icons-pack/svelte-simple-icons';
	import GlobeIcon from '@lucide/svelte/icons/globe';
	import MailIcon from '@lucide/svelte/icons/mail';
	import AtSignIcon from '@lucide/svelte/icons/at-sign';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { authors, imagesByAuthor } = data;

	const socialIcons = {
		github: GithubIcon,
		twitter: TwitterIcon,
		website: GlobeIcon,
		email: MailIcon,
		instagram: InstagramIcon,
		bluesky: AtSignIcon
	} as const;
</script>

<SEO
	title="Authors | Diagram Chasing"
	description="People who have contributed to our work"
	keywords="data viz, india data, data storytelling, authors, team"
/>

<div class="mx-auto max-w-5xl px-4 py-12">
	<div class="mb-12">
		<h1 class="font-serif text-display leading-none font-bold tracking-tight">Authors</h1>
		<p class="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
			People who have contributed to Diagram Chasing
		</p>
	</div>

	<div class="divide-y divide-border">
		{#each authors as author}
			{@const images = imagesByAuthor[author.slug] ?? []}
			<a
				href="/authors/{author.slug}"
				class="group flex items-start justify-between gap-6 py-8 no-underline transition-opacity first:pt-0 active:opacity-70"
			>
				<div class="max-w-xl">
					<h2
						class="font-serif text-xl font-bold text-foreground group-hover:underline group-hover:underline-offset-[0.12em] md:text-2xl"
					>
						{author.name}
					</h2>

					{#if author.description}
						<p class="mt-2 text-base leading-relaxed">
							{author.description}
						</p>
					{/if}

					{#if author.links}
						<div class="mt-3 flex gap-3">
							{#each Object.entries(author.links) as [platform, url]}
								{#if url && platform in socialIcons}
									{@const Icon = socialIcons[platform as keyof typeof socialIcons]}
									<Icon size={15} class="text-muted-foreground" />
								{/if}
							{/each}
						</div>
					{/if}

					<!-- {#if images.length > 0}
						<div class="mt-3 flex gap-1.5">
							{#each images.slice(0, 5) as img}
								<span
									class="inline-block shrink-0 overflow-hidden rounded border border-border"
									style="height: 1.8em; width: 3.8em;"
									aria-hidden="true"
								>
									<Image src={img} alt="" class="h-full w-full object-cover" loading="lazy" />
								</span>
							{/each}
						</div>
					{/if} -->
				</div>

				<ArrowRight
					size={18}
					class="mt-1 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1"
				/>
			</a>
		{/each}
	</div>
</div>
