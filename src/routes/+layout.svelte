<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import HeaderNavigation from '$lib/components/HeaderNavigation.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import SEO from '$lib/components/SEO.svelte';

	let { children } = $props();
</script>

<SEO title="Diagram Chasing" />

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen flex flex-col">
	<HeaderNavigation />
	<main class="flex-1">
		{@render children?.()}
	</main>
	<Footer />
</div>
