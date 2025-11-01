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
	<div class="header-grid">
		<!-- Title -->
		<div class="header-title flex gap-4 md:flex-row">
			<Logo size={120} />
			<div class="flex flex-col justify-start gap-4">
				<h1
					class="w-fit text-left font-serif text-2xl font-bold tracking-tight text-black md:text-4xl lg:text-5xl"
				>
					Diagram <br /> Chasing
				</h1>
				<p class="w-full pb-2 text-sm text-black md:px-4 md:text-base lg:hidden lg:text-center">
					Data-driven works of various interests, shared once in a while
				</p>
			</div>

			<!-- Mobile Tagline -->
		</div>

		<!-- Navigation -->
		<div class="header-nav">
			<NavigationMenu.Root class="header-nav" viewport={false}>
				<NavigationMenu.List class="flex flex-col items-end justify-end gap-1">
					{@render navLink('/', 'home')}
					{@render navLink('/authors', 'authors')}
					<!-- {@render navLink('/ideas', 'ideas')} -->
					{@render navLink('/support', 'support')}
					{@render navLink('/join', 'join')}
				</NavigationMenu.List>
			</NavigationMenu.Root>
		</div>

		{#snippet navLink(href: string, text: string)}
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
	</div>

	<!-- Tagline -->
	<p class="hidden w-full px-4 pb-2 text-sm text-black md:w-[30ch] md:pl-6 md:text-xl lg:block">
		Data-driven works of various interests, shared once in a while
	</p>
</header>

<style>
	.header-grid {
		display: grid;
		width: 100%;
		padding: 2rem 1rem;
		gap: 1rem;
		grid-template-columns: 1fr;
		grid-template-areas:
			'title'
			'nav';
		align-items: center;
		justify-items: center;
	}

	.header-title {
		grid-area: title;
		text-align: center;
	}

	.header-nav {
		grid-area: nav;
		justify-self: center;
	}

	/* Mobile Layout */
	@media (max-width: 767px) {
		.header-grid {
			grid-template-columns: 1fr auto;
			grid-template-areas: 'title nav';
			justify-items: stretch;
		}

		.header-title {
			text-align: left;
			justify-self: start;
		}

		.header-nav {
			justify-self: end;
		}
	}

	/* Desktop Layout - 12 column grid */
	@media (min-width: 900px) {
		.header-grid {
			grid-template-columns: repeat(12, 1fr);
			grid-template-areas: ' title title title title title . . . . . . . nav';
			padding: 1rem 1.5rem;
			gap: 1rem;
			align-items: center;
		}

		.header-title {
			justify-self: start;
		}

		.header-title h1 {
			font-size: 3rem;
		}

		.header-nav {
			justify-self: end;
		}
	}

	@media (min-width: 1280px) {
		.header-title h1 {
			font-size: 3.75rem;
		}
	}
</style>
