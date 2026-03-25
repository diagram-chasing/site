<script lang="ts">
	import { onMount } from 'svelte';
	import SEO from '$lib/components/SEO.svelte';

	onMount(() => {
		const script = document.createElement('script');
		script.src = 'https://tally.so/widgets/embed.js';
		script.onload = () => {
			if (typeof (window as any).Tally !== 'undefined') {
				(window as any).Tally.loadEmbeds();
			}
		};
		document.body.appendChild(script);

		return () => {
			document.body.removeChild(script);
		};
	});
</script>

<SEO
	title="Join Diagram Chasing's Community"
	description="Collaborate with us on data journalism and visualization projects"
	keywords="data journalism, collaboration, diagram chasing, join community"
/>

<div class="mx-auto max-w-3xl px-4 py-12">
	<div class="mb-10">
		<h1 class="font-serif" style="font-size: var(--text-display);">Community</h1>
		<p class="mt-3 text-lg text-muted-foreground">
			Collaborate with us on data journalism and visualization projects.
		</p>
	</div>

	<iframe
		data-tally-src="https://tally.so/embed/nGNPl2?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
		loading="lazy"
		width="100%"
		height="1768"
		frameborder="0"
		marginheight="0"
		marginwidth="0"
		title="Join Diagram Chasing's Community"
	></iframe>
</div>
