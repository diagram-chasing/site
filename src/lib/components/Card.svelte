<script lang="ts">
	import Image from '$lib/components/ui/Image.svelte';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import type { Post } from '$lib/types/content';

	interface Props {
		post: Post;
		featured?: boolean;
		class?: string;
	}

	let { post, featured = false, class: className = '' }: Props = $props();

	const year = $derived(new Date(post.date).getFullYear());

	const postUrl = $derived.by(() => {
		if (post.link) return post.link;
		if (post.external) return post.base_url ?? '#';
		if (post.slug) return `/${year}/${post.slug}`;
		return post.base_url ?? '#';
	});

	// Pages inside the post (one per state, say). They sit outside the card's own link,
	// since a link cannot hold other links.
	const subpages = $derived(post.subpages ?? []);
</script>

{#if featured}
	<!-- Featured: full-bleed image with text box breaking out below -->
	<div class={className}>
		<a
			href={postUrl}
			class="group block no-underline transition-transform duration-150 ease-out active:scale-[0.995]"
			{...post.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}}
		>
			<!-- Image -->
			<div
				class="aspect-[16/9] overflow-hidden border border-foreground/50 bg-base-50 sm:aspect-[16/8]"
			>
				<Image
					src={post.image}
					alt={post.title}
					class="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
					loading="eager"
					fetchpriority="high"
					sizes="min(1024px, 100vw)"
				/>
			</div>

			<!-- Text block breaking out upward, sticker on top-right corner -->
			<div
				class="relative mx-0 mt-0 border border-foreground/50 bg-background p-5 sm:mx-8 sm:-mt-14 sm:p-8 md:mx-12 md:-mt-20 md:p-10"
			>
				<span class="text-xs font-medium tracking-widest text-foreground uppercase tabular-nums">
					{year}
				</span>
				<h2
					class="font-serif text-2xl leading-tight font-bold text-foreground underline-offset-4 transition-colors group-hover:underline sm:text-3xl md:text-4xl"
				>
					{post.title}
				</h2>
				<p class="page-prose mt-1 leading-relaxed sm:text-base md:text-lg">
					{post.description}
				</p>
			</div>
		</a>
		{#if subpages.length > 0}
			<!-- Subpages hang from the text block's bottom edge, sharing its border -->
			<nav aria-label="Pages in {post.title}" class="mx-0 flex flex-wrap pl-px sm:mx-8 md:mx-12">
				{#each subpages as sub (sub.url)}
					<a
						href={sub.url}
						class="group/sub -mt-px -ml-px inline-flex flex-1 items-center justify-between gap-3 border border-foreground/50 bg-background px-5 py-3 text-base font-medium text-foreground no-underline transition-colors duration-150 ease-out hover:bg-foreground hover:text-background active:scale-[0.99] sm:flex-none sm:justify-start sm:px-6 md:text-lg"
					>
						<span>
							{sub.label}{#if sub.note}<span
									class="ml-2 text-sm font-normal text-muted-foreground transition-colors group-hover/sub:text-background/70"
									>{sub.note}</span
								>{/if}
						</span>
						<ArrowRight
							class="size-4 shrink-0 transition-transform duration-150 ease-out group-hover/sub:translate-x-0.5"
							aria-hidden="true"
						/>
					</a>
				{/each}
			</nav>
		{/if}
	</div>
{:else}
	<!-- Standard card -->
	<div class={className}>
		<a
			href={postUrl}
			class="group block no-underline transition-transform duration-150 ease-out active:scale-[0.995]"
			{...post.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}}
		>
			<div class="aspect-[4/3] overflow-hidden border bg-base-50">
				<Image
					src={post.image}
					alt={post.title}
					class="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
					loading="lazy"
					sizes="(max-width: 640px) 100vw, 512px"
				/>
			</div>

			<div class="mt-3">
				<span
					class="text-xs font-medium tracking-wide text-muted-foreground uppercase tabular-nums"
				>
					{year}
				</span>
				<h2
					class="mt-0.5 font-serif text-2xl leading-tight font-bold text-foreground underline-offset-4 transition-colors group-hover:underline"
				>
					{post.title}
				</h2>
				<p class="page-prose mt-1.5 leading-relaxed">
					{post.description}
				</p>
			</div>
		</a>
		{#if subpages.length > 0}
			<!-- Subpages as a row of small inline buttons under the description -->
			<nav aria-label="Pages in {post.title}" class="mt-3 flex flex-wrap gap-2">
				{#each subpages as sub (sub.url)}
					<a
						href={sub.url}
						class="group/sub inline-flex items-center gap-1.5 border border-foreground/40 bg-background px-2.5 py-1 text-sm font-medium text-foreground no-underline transition-colors duration-150 ease-out hover:border-foreground hover:bg-foreground hover:text-background active:scale-[0.98]"
					>
						{sub.label}{#if sub.note}<span
								class="font-normal text-muted-foreground transition-colors group-hover/sub:text-background/70"
								>{sub.note}</span
							>{/if}
						<ArrowRight
							class="size-3.5 shrink-0 transition-transform duration-150 ease-out group-hover/sub:translate-x-0.5"
							aria-hidden="true"
						/>
					</a>
				{/each}
			</nav>
		{/if}
	</div>
{/if}
