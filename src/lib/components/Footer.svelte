<script lang="ts">
	import Logo from './Logo.svelte';
	import RssIcon from '@lucide/svelte/icons/rss';
	import GithubIcon from '@lucide/svelte/icons/github';

	const currentYear = new Date().getFullYear();

	const pageLinks = [
		{ name: 'Work', href: '/' },
		{ name: 'Authors', href: '/authors' },
		{ name: 'Support', href: '/support' },
		{ name: 'Community', href: '/community' }
	];

	const connectLinks = [
		{ name: 'RSS Feed', href: '/rss.xml', icon: RssIcon },
		{ name: 'GitHub', href: 'https://github.com/diagram-chasing', icon: GithubIcon, external: true }
	];
</script>

<footer
	class="mx-0 mb-0 px-0 py-8 text-center text-lg leading-normal text-foreground antialiased max-sm:px-5 max-sm:py-10 max-sm:text-base"
>
	<!-- Logo -->
	<div class="mb-3.5 flex justify-center">
		<a href="/" class="inline-flex flex-col items-center gap-2 text-foreground no-underline">
			<Logo size={48} />
			<span class="font-serif text-xl font-bold tracking-tight">Diagram Chasing</span>
		</a>
	</div>

	<!-- Nav links -->
	<ul class="mt-5 mb-[15px] flex flex-wrap justify-center gap-x-4 gap-y-1 list-none p-0">
		{#each pageLinks as link}
			<li class="my-0 p-0">
				<a
					href={link.href}
					class="text-base leading-[1.6em] tracking-[0.125em] text-foreground uppercase no-underline transition-colors hover:text-muted-foreground max-sm:text-sm"
					>{link.name}</a
				>
			</li>
		{/each}
	</ul>

	<!-- Copyright -->
	<p class="mt-2 p-0 text-base leading-normal text-muted-foreground">
		&copy; {currentYear} Diagram Chasing
	</p>

	<!-- Social/connect icon links -->
	<ul class="mt-3 list-none p-0 px-5 text-center">
		{#each connectLinks as link}
			<li class="mx-1.5 my-0 inline-block p-0 leading-[1.6em]">
				<a
					href={link.href}
					{...link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}}
					class="inline-flex items-center text-foreground no-underline transition-colors hover:text-muted-foreground"
					aria-label={link.name}
				>
					<link.icon size={24} class="opacity-80 max-sm:h-5 max-sm:w-5" />
				</a>
			</li>
		{/each}
	</ul>
</footer>
