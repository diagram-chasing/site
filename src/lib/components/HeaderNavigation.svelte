<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Logo from './Logo.svelte';
	import Menu from '@lucide/svelte/icons/menu';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	let sheetOpen = $state(false);

	$effect(() => {
		$page.url.pathname;
		sheetOpen = false;
	});

	const primaryLinks = [
		{ href: '/', label: 'Home' },
		{ href: '/about', label: 'About' },
		{ href: '/support', label: 'Support' }
	];

	const allLinks = [
		{ href: '/', label: 'Home' },
		{ href: '/about', label: 'About' },
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
				<div class={$page.url.pathname === '/' ? 'hidden' : 'block'}>
					<a href="/" class="-mt-1 flex items-center justify-center gap-2">
						<Logo size={55} />

						<div>
							<span
								class="m-0 font-serif text-2xl leading-4 font-bold tracking-tight text-foreground md:text-3xl"
							>
								Diagram <br /> Chasing
							</span>
						</div>
					</a>
				</div>
			</div>

			<Sheet.Root bind:open={sheetOpen}>
				<Sheet.Content side="right" class="px-6" preventScroll={false}>
					<nav class="flex flex-col pt-6">
						{#each allLinks as link}
							<a
								href={link.href}
								class="border-b border-border py-4 text-sm font-bold tracking-wide uppercase no-underline transition-colors active:opacity-60
									{isActive(link.href, $page.url.pathname)
									? 'text-foreground'
									: 'text-muted-foreground hover:text-foreground'}"
							>
								{link.label}
							</a>
						{/each}
					</nav>
				</Sheet.Content>

				<!-- Mobile: menu icon trigger -->
				<Sheet.Trigger
					class="flex size-10 items-center justify-center text-foreground transition-transform active:scale-95 md:hidden"
					aria-label="Open menu"
				>
					<Menu size={22} />
				</Sheet.Trigger>

				<!-- Desktop nav -->
				<nav class="hidden items-center gap-6 md:flex">
					{#each primaryLinks as link}
						<a
							href={link.href}
							class="text-sm font-bold tracking-wide uppercase no-underline transition-colors active:opacity-60
								{isActive(link.href, $page.url.pathname)
								? 'text-foreground underline underline-offset-4'
								: 'text-muted-foreground hover:text-foreground'}"
						>
							{link.label}
						</a>
					{/each}
					<DropdownMenu.Root>
						<DropdownMenu.Trigger
							class="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground active:scale-95"
							aria-label="More pages"
						>
							<Menu size={18} />
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="end" class="w-40">
							{#each allLinks.filter((l) => !primaryLinks.some((p) => p.href === l.href)) as link}
								<DropdownMenu.Item
									onSelect={() => goto(link.href)}
									class={isActive(link.href, $page.url.pathname) ? 'font-bold' : ''}
								>
									{link.label}
								</DropdownMenu.Item>
							{/each}
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</nav>
			</Sheet.Root>
		</div>
	</div>
</header>
