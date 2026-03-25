<script lang="ts">
	import { page } from '$app/stores';
	import Logo from './Logo.svelte';
	import Menu from '@lucide/svelte/icons/menu';
	import X from '@lucide/svelte/icons/x';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	let menuOpen = $state(false);

	$effect(() => {
		$page.url.pathname;
		menuOpen = false;
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
	<!-- Top bar: branding -->
	<div class="mx-auto max-w-5xl px-4 py-4">
		<div class="flex items-center justify-between">
			<div class="h-13">
				<div
					class="{$page.url.pathname === '/' ? 'hidden' : 'flex'} items-center justify-center gap-2"
				>
					<a href="/" class="  -mt-1">
						<Logo size={55} />
					</a>
					<div>
						<span
							class="m-0 font-serif text-2xl leading-0 font-bold tracking-tight text-foreground md:text-3xl"
						>
							Diagram <br /> Chasing
						</span>
					</div>
				</div>
			</div>

			<!-- Right: Mobile hamburger -->
			<button
				class="flex items-center justify-center text-foreground md:hidden"
				onclick={() => (menuOpen = !menuOpen)}
				aria-label={menuOpen ? 'Close menu' : 'Open menu'}
			>
				{#if menuOpen}
					<X size={22} />
				{:else}
					<Menu size={22} />
				{/if}
			</button>

			<!-- Right: Desktop nav -->
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

	<!-- Mobile dropdown -->
	{#if menuOpen}
		<nav class="border-t border-border px-4 py-4 md:hidden">
			<div class="mx-auto flex max-w-5xl flex-col gap-3">
				{#each links as link}
					<a
						href={link.href}
						class="text-sm font-bold tracking-wide uppercase no-underline transition-colors
							{isActive(link.href, $page.url.pathname)
							? 'text-foreground'
							: 'text-muted-foreground hover:text-foreground'}"
					>
						{link.label}
					</a>
				{/each}
			</div>
		</nav>
	{/if}
</header>
