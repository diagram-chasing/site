<script lang="ts">
	import * as NavigationMenu from '$lib/components/ui/navigation-menu/index.js';
	import Logo from './Logo.svelte';
	import { cn } from '$lib/utils.js';
	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();
</script>

<header class="w-full text-paper {className}">
	<div class="flex items-center justify-between px-4 py-2 @lg:px-6">
		<!-- Logo/Brand -->
		<div></div>
		<div class="flex items-center justify-center gap-4 text-black">
			<Logo size={100} />
			<h1 class="w-fit font-serif text-5xl font-bold tracking-tight">Diagram <br /> Chasing</h1>
		</div>

		{#snippet navLink(href: string, text: string, hasIcon: boolean = false)}
			<NavigationMenu.Item>
				<NavigationMenu.Link>
					{#snippet child()}
						<a
							{href}
							class={cn(
								'bg-transparent p-0 text-sm font-bold tracking-wide text-black uppercase transition-colors duration-200 hover:bg-transparent hover:text-red-400 focus:bg-transparent'
							)}
						>
							{text}
						</a>
					{/snippet}
				</NavigationMenu.Link>
			</NavigationMenu.Item>
		{/snippet}

		<!-- Navigation -->
		<NavigationMenu.Root class="mt-2 flex self-end" viewport={false}>
			<NavigationMenu.List class="flex flex-col items-end justify-end gap-1">
				{@render navLink('/', 'home', true)}
				{@render navLink('/authors', 'authors')}
				{@render navLink('/ideas', 'ideas')}
				{@render navLink('/support', 'support')}
			</NavigationMenu.List>
		</NavigationMenu.Root>
	</div>
	<p class="text-md w-full text-center text-black">
		Data-driven works of various interests, shared once in a while
	</p>
</header>
