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
	<!-- Featured: large hero with gallery strip and prominent text -->
	<a
		href={postUrl}
		class="group block no-underline {className}"
		{...post.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}}
	>
		<!-- Main image + text side by side -->
		<div class="grid grid-cols-1 gap-6 md:grid-cols-5">
			<!-- Image column: hero + thumbnails -->
			<div class="md:col-span-3">
				<div class="aspect-[16/10] overflow-hidden bg-base-50">
					<Image
						src={post.image}
						alt={post.title}
						class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
						loading="eager"
						sizes="(max-width: 768px) 100vw, 60vw"
					/>
				</div>
			</div>

			<!-- Text column -->
			<div class="flex flex-col justify-end md:col-span-2">
				<span class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
					{year}
				</span>
				<h2
					class="mt-2 font-serif text-3xl leading-tight font-bold text-foreground transition-colors group-hover:text-primary md:text-4xl"
				>
					{post.title}
				</h2>
				<p class="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
					{post.description}
				</p>
			</div>
		</div>
	</a>
{:else}
	<!-- Standard card -->
	<a
		href={postUrl}
		class="group block no-underline {className}"
		{...post.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}}
	>
		<div class="aspect-[4/3] overflow-hidden bg-base-50">
			<Image
				src={post.image}
				alt={post.title}
				class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
				loading="lazy"
				sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
			/>
		</div>

		<div class="mt-3">
			<span class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
				{year}
			</span>
			<h2
				class="mt-0.5 font-serif text-xl leading-relaxed font-bold text-foreground transition-colors group-hover:text-primary"
			>
				{post.title}
			</h2>
			<p class="mt-1.5 text-sm leading-relaxed text-muted-foreground">
				{post.description}
			</p>
		</div>
	</a>
{/if}
