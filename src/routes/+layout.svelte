<script lang="ts">
	import '../app.css';
	import HeaderNavigation from '$lib/components/Navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import standardSite from '../content/standard-site.json';
	let { children } = $props();
</script>

<SEO title="Diagram Chasing" />

<svelte:head>
	<link rel="icon" href="/favicon.png" type="image/png" />
	{#if standardSite.publication}
		<link rel="site.standard.publication" href={standardSite.publication} />
	{/if}
</svelte:head>

<div class="min-h-screen flex flex-col">
	<HeaderNavigation />
	<main class="flex-1">
		{@render children?.()}
	</main>
	<Footer />
</div>
