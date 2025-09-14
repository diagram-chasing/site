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
	<div class="flex items-center justify-between px-4 py-2 lg:justify-center lg:px-6">
		<!-- Logo/Brand on mobile, center on desktop -->
		<div class="flex flex-col gap-4">
			<div class="flex items-center gap-2 text-black md:gap-4">
				<Logo size={60} class="md:size-[80px] lg:size-[100px]" />
				<h1 class="w-fit font-serif text-2xl font-bold tracking-tight md:text-4xl lg:text-5xl">
					Diagram <br /> Chasing
				</h1>
			</div>
			<p class="block w-full max-w-[30ch] text-sm text-black md:hidden md:text-center md:text-base">
				Data-driven works of various interests, shared once in a while
			</p>
		</div>

		{#snippet navLink(href: string, text: string, hasIcon: boolean = false)}
			<NavigationMenu.Item>
				<NavigationMenu.Link>
					{#snippet child()}
						<a
							{href}
							class={cn(
								'bg-transparent p-0 text-xs font-bold tracking-wide text-black uppercase transition-colors duration-200 hover:bg-transparent hover:text-red-400 focus:bg-transparent md:text-sm'
							)}
						>
							{text}
						</a>
					{/snippet}
				</NavigationMenu.Link>
			</NavigationMenu.Item>
		{/snippet}

		<!-- Navigation -->
		<NavigationMenu.Root
			class="mt-2 flex self-end lg:absolute lg:top-2 lg:right-4 lg:mt-0"
			viewport={false}
		>
			<NavigationMenu.List class="flex flex-col items-end justify-end gap-1">
				{@render navLink('/', 'home', true)}
				{@render navLink('/authors', 'authors')}
				{@render navLink('/ideas', 'ideas')}
				{@render navLink('/support', 'support')}
			</NavigationMenu.List>
		</NavigationMenu.Root>
	</div>
	<p class="hidden w-full text-center text-sm text-black md:block md:text-base">
		Data-driven works of various interests, shared once in a while
	</p>
</header>
