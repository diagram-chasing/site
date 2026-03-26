<script lang="ts">
	import Image from '$lib/components/ui/Image.svelte';
	import type { Post } from '$lib/types/content';

	interface Props {
		post: Post;
		featured?: boolean;
		class?: string;
	}

	let { post, featured = false, class: className = '' }: Props = $props();

	const year = $derived(new Date(post.date).getFullYear());

	const postUrl = $derived.by(() => {
		if (post.external) return post.base_url ?? '#';
		if (post.slug) return `/${year}/${post.slug}`;
		return post.base_url ?? '#';
	});
</script>

{#if featured}
	<!-- Featured: full-bleed image with text box breaking out below -->
	<a
		href={postUrl}
		class="group block no-underline {className}"
		{...post.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}}
	>
		<!-- Image -->
		<div class="aspect-[16/9] overflow-hidden border bg-base-50 sm:aspect-[16/8]">
			<Image
				src={post.image}
				alt={post.title}
				class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
				loading="eager"
				fetchpriority="high"
				sizes="min(1024px, 100vw)"
			/>
		</div>

		<!-- Text block breaking out upward, sticker on top-right corner -->
		<div
			class="relative mx-0 mt-0 border border-border bg-background p-5 sm:mx-8 sm:-mt-14 sm:p-8 md:mx-12 md:-mt-20 md:p-10"
		>
			<span class="text-xs font-medium tracking-widest text-muted-foreground uppercase">
				{year}
			</span>
			<h2
				class="mt-2 font-serif text-2xl leading-tight font-bold text-foreground underline-offset-4 transition-colors group-hover:underline sm:text-3xl md:text-4xl"
			>
				{post.title}
			</h2>
			<p class="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg">
				{post.description}
			</p>
		</div>
	</a>
{:else}
	<!-- Standard card -->
	<a
		href={postUrl}
		class="group block no-underline {className}"
		{...post.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}}
	>
		<div class="aspect-[4/3] overflow-hidden border bg-base-50">
			<Image
				src={post.image}
				alt={post.title}
				class="h-full w-full   object-cover transition-transform duration-300 group-hover:scale-[1.02]"
				loading="lazy"
				sizes="(max-width: 640px) 100vw, 512px"
			/>
		</div>

		<div class="mt-3">
			<span class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
				{year}
			</span>
			<h2
				class="mt-0.5 font-serif text-xl leading-tight font-bold text-foreground transition-colors group-hover:text-primary"
			>
				{post.title}
			</h2>
			<p class="mt-1.5 text-sm leading-relaxed text-muted-foreground">
				{post.description}
			</p>
		</div>
	</a>
{/if}
