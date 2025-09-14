<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';

	export let data;
	$: ({ authors } = data);
</script>

<SEO
	title="Authors | Diagram Chasing"
	description="Meet the team behind Diagram Chasing's data-driven stories and interactive tools"
	keywords="data viz, india data, data storytelling, authors, team"
	twitterHandle="@diagram_chasing"
	author="Diagram Chasing"
	ogImage="sharecard.jpg"
/>

<div class="my-4 w-full">
	<main class="mx-auto max-w-2xl space-y-12 px-4">
		<div class="space-y-6">
			<div class="space-y-2">
				<p class="font-mono text-sm text-muted-foreground">$ ~/authors</p>
				<h1 class="font-serif text-4xl font-bold tracking-tight text-foreground md:text-5xl">
					Authors
				</h1>
			</div>

			<p class="max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
				People who have contributed to Diagram Chasing
			</p>
		</div>

		<div class="flex flex-col gap-3">
			{#each authors as author}
				<a
					href="/authors/{author.slug}"
					class="group block space-y-4 rounded-lg border bg-card p-6 transition-all hover:bg-muted/50"
				>
					<div class="space-y-2">
						<h2
							class="font-serif text-xl font-bold text-foreground transition-colors group-hover:text-foreground/80"
						>
							{author.name}
						</h2>
					</div>
				</a>
			{/each}
		</div>
	</main>
</div>

<style>
	a {
		text-decoration: none;
	}
</style>
