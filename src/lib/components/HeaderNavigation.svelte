<script lang="ts">
	import { page } from '$app/stores';
	import Logo from './Logo.svelte';
	import Menu from '@lucide/svelte/icons/menu';
	import * as Sheet from '$lib/components/ui/sheet/index.js';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	let sheetOpen = $state(false);

	$effect(() => {
		$page.url.pathname;
		sheetOpen = false;
	});

	const links = [
		{ href: '/', label: 'Work' },
		{ href: '/authors', label: 'Authors' },
		{ href: '/support', label: 'Support' },
		{ href: '/community', label: 'Community' }
	];

	function isActive(href: string, pathname: string): boolean {
		if (href === '/') return pathname === '/';
		return pathname.startsWith(href);
	}
</script>

<header class="w-full bg-background {className}">
	<div class="mx-auto max-w-5xl px-4 py-4">
		<div class="flex items-center justify-between">
			<div class="h-13">
				<div
					class="{$page.url.pathname === '/' ? 'hidden' : 'flex'} items-center justify-center gap-2"
				>
					<a href="/" class="-mt-1">
						<Logo size={55} />
					</a>
					<div>
						<span
							class="m-0 font-serif text-2xl leading-4 font-bold tracking-tight text-foreground md:text-3xl"
						>
							Diagram <br /> Chasing
						</span>
					</div>
				</div>
			</div>

			<!-- Mobile: Sheet trigger -->
			<Sheet.Root bind:open={sheetOpen}>
				<Sheet.Trigger
					class="flex items-center justify-center text-foreground md:hidden"
					aria-label="Open menu"
				>
					<Menu size={22} />
				</Sheet.Trigger>
				<Sheet.Content side="right" class=" px-6" preventScroll={false}>
					<nav class="flex flex-col pt-6">
						{#each links as link}
							<a
								href={link.href}
								class="border-b border-border py-4 text-sm font-bold tracking-wide uppercase no-underline transition-colors
									{isActive(link.href, $page.url.pathname)
									? 'text-foreground'
									: 'text-muted-foreground hover:text-foreground'}"
							>
								{link.label}
							</a>
						{/each}
					</nav>
				</Sheet.Content>
			</Sheet.Root>

			<!-- Desktop nav -->
			<nav class="hidden items-center gap-6 md:flex">
				{#each links as link}
					<a
						href={link.href}
						class="text-sm font-bold tracking-wide uppercase no-underline transition-colors
							{isActive(link.href, $page.url.pathname)
							? 'text-foreground underline underline-offset-4'
							: 'text-muted-foreground hover:text-foreground'}"
					>
						{link.label}
					</a>
				{/each}
			</nav>
		</div>
	</div>
</header>
