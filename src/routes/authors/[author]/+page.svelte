<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import ProjectCard from '$lib/components/Card.svelte';
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
		<h1 class="font-serif text-display font-bold leading-none tracking-tight">{author.name}</h1>

		<p class="mt-3 max-w-2xl text-lg leading-relaxed">
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
				{#if author.links?.linkedin}
					<a
						href={author.links.linkedin}
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center gap-1.5 text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
							<path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z" />
						</svg>
						<span>LinkedIn</span>
					</a>
				{/if}
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
		<p>No projects yet.</p>
	{/if}
</div>
