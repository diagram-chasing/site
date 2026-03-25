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

<footer class="border-t border-border bg-background">
	<div class="mx-auto max-w-5xl px-4 py-12">
		<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
			<!-- Brand -->
			<div class="flex items-start gap-3">
				<Logo size={40} />
				<div>
					<span class="font-serif text-lg font-bold text-foreground">Diagram Chasing</span>
					<p class="mt-1 text-sm text-muted-foreground">
						Data-driven works of public interest.
					</p>
				</div>
			</div>

			<!-- Pages -->
			<div>
				<h4 class="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
					Pages
				</h4>
				<nav class="flex flex-col gap-2">
					{#each pageLinks as link}
						<a
							href={link.href}
							class="text-sm text-foreground no-underline transition-colors hover:text-muted-foreground"
						>
							{link.name}
						</a>
					{/each}
				</nav>
			</div>

			<!-- Connect -->
			<div>
				<h4 class="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
					Connect
				</h4>
				<nav class="flex flex-col gap-2">
					{#each connectLinks as link}
						<a
							href={link.href}
							{...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
							class="flex items-center gap-1.5 text-sm text-foreground no-underline transition-colors hover:text-muted-foreground"
						>
							<link.icon size={14} />
							{link.name}
						</a>
					{/each}
				</nav>
			</div>
		</div>

		<!-- Copyright -->
		<div class="mt-10 border-t border-border pt-6">
			<p class="text-xs text-muted-foreground">
				&copy; {currentYear} Diagram Chasing
			</p>
		</div>
	</div>
</footer>
