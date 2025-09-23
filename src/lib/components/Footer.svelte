<script lang="ts">
	import Logo from './Logo.svelte';
	import RssIcon from '@lucide/svelte/icons/rss';

	const currentYear = new Date().getFullYear();

	const links = [
		{ name: 'Authors', href: '/authors' },
		{ name: 'Support', href: '/support' },
		{ name: 'RSS', href: '/rss.xml', icon: true },
		{ name: 'GitHub', href: 'https://github.com/diagram-chasing', external: true }
	];
</script>

<footer class="border-t bg-background/50 backdrop-blur-sm">
	<div class="mx-auto max-w-4xl px-4 py-8">
		<div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
			<!-- Left side - Brand -->
			<div class="flex items-center gap-3">
				<Logo size={50} />
				<div class="space-y-1">
					<h3 class="font-serif text-lg font-bold text-foreground">Diagram Chasing</h3>
				</div>
			</div>

			<!-- Right side - Links -->
			<div class="flex flex-col gap-4 md:items-end">
				<!-- Navigation Links -->
				<nav class="flex flex-wrap gap-4">
					{#each links as link}
						<a
							href={link.href}
							{...link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}}
							class="flex items-center gap-1 text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
						>
							{#if link.icon}
								<RssIcon size={14} />
							{/if}
							{link.name}
						</a>
					{/each}
				</nav>
			</div>
		</div>

		<!-- Bottom - Copyright -->
		<div class="mt-6 border-t pt-6">
			<p class="text-center text-xs text-muted-foreground md:text-left">
				© {currentYear} Diagram Chasing. All rights reserved.
			</p>
		</div>
	</div>
</footer>
