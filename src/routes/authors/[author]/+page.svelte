<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import { SiGithub as GithubIcon, SiX as TwitterIcon, SiInstagram as InstagramIcon } from '@icons-pack/svelte-simple-icons';
	import GlobeIcon from '@lucide/svelte/icons/globe';
	import MailIcon from '@lucide/svelte/icons/mail';
	import AtSignIcon from '@lucide/svelte/icons/at-sign';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { author, posts } = data;

	const publishedPosts = $derived(
		posts
			.filter((p) => p.published)
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
	);

	const socialConfig = [
		{ key: 'website', label: 'Website', icon: GlobeIcon },
		{ key: 'github', label: 'GitHub', icon: GithubIcon },
		{ key: 'twitter', label: 'Twitter', icon: TwitterIcon },
		{ key: 'bluesky', label: 'Bluesky', icon: AtSignIcon },
		{ key: 'instagram', label: 'Instagram', icon: InstagramIcon },
		{ key: 'email', label: 'Email', icon: MailIcon }
	] as const;
</script>

<SEO
	title="{author.name} | Diagram Chasing"
	description={author.description}
	keywords="data viz, india data, data storytelling, {author.name}"
/>

<div class="mx-auto max-w-5xl px-4 py-12">
	<!-- Author header -->
	<div class="mb-10">
		<h1 class="font-serif" style="font-size: var(--text-display);">{author.name}</h1>

		<p class="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">
			{author.description}
		</p>

		{#if author.links && Object.values(author.links).some(Boolean)}
			<div class="mt-4 flex flex-wrap gap-4">
				{#each socialConfig as { key, label, icon: Icon }}
					{@const url = author.links?.[key as keyof typeof author.links]}
					{#if url}
						<a
							href={key === 'email' && !url.startsWith('mailto:') ? `mailto:${url}` : url}
							target={key === 'email' ? undefined : '_blank'}
							rel={key === 'email' ? undefined : 'noopener noreferrer'}
							class="flex items-center gap-1.5 text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
						>
							<Icon size={14} />
							<span>{label}</span>
						</a>
					{/if}
				{/each}
			</div>
		{/if}
	</div>

	<!-- Projects -->
	{#if publishedPosts.length > 0}
		<div>
			<h2 class="mb-6 text-xs font-medium uppercase tracking-widest text-muted-foreground">
				Projects
			</h2>
			<div class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
				{#each publishedPosts as post, i}
					<ProjectCard {post} />
				{/each}
			</div>
		</div>
	{:else}
		<p class="text-muted-foreground">No projects yet.</p>
	{/if}
</div>
