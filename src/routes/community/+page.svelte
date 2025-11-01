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
			// Cleanup: remove script when component unmounts
			document.body.removeChild(script);
		};
	});
</script>

<SEO
	title="Join Diagram Chasing's Community"
	description="Collaborate with uson data journalism and visualization projects"
	keywords="data journalism, collaboration, diagram chasing, join community"
/>

<iframe
	data-tally-src="https://tally.so/embed/nGNPl2?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
	loading="lazy"
	width="100%"
	height="1768"
	frameborder="0"
	marginheight="0"
	marginwidth="0"
	title="Join Diagram Chasing's Community"
	class="mx-auto mb-18 max-w-3xl"
></iframe>
