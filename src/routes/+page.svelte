<script lang="ts">
	import ProjectGallery from '$lib/components/ProjectGallery.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const { posts, authors } = data;
</script>

<div class="my-4 w-full">
	<main class="mx-auto space-y-8 px-4">
		{#each posts as post}
			<ProjectGallery {post} />
		{/each}
	</main>
</div>
