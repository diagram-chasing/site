<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';

	let { data } = $props();
	const friends = data.friends;
</script>

<SEO
	title="Support Diagram Chasing"
	description="Support independent data journalism and visualization work in India."
	keywords="support, donate, data journalism, india, public interest"
/>

<div class="mx-auto max-w-5xl px-4 py-12">
	<!-- Heading + narrative -->
	<div class="mb-12 max-w-2xl">
		<h1 class="font-serif text-display leading-none font-bold tracking-tight">Support</h1>
		<p class="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
			We're are independently produced and reader-supported
		</p>
		<div class="page-prose mt-6">
			<p>
				Diagram Chasing creates data-driven stories, interactive tools, and open datasets of public
				interest.
			</p>
			<p>
				In a short span of time, we've
				<a target="_blank" rel="noopener" href="https://diagramchasing.fun/2024/votes-in-a-name"
					>uncovered electoral confusion caused by namesake candidates</a
				>,
				<a target="_blank" rel="noopener" href="https://diagramchasing.fun/2024/blr-water-log"
					>mapped Bangalore's natural drainage systems</a
				>, and made
				<a target="_blank" rel="noopener" href="https://diagramchasing.fun/2025/time-use-explorer"
					>India's 10-million-row Time Use Survey searchable in any browser</a
				>. Our project, CBFC Watch, is the largest analyzable dataset of
				<a target="_blank" rel="noopener" href="https://cbfc.watch">film censorship in India</a>.
				All our code, data, and methods are published on
				<a target="_blank" rel="noopener" href="https://github.com/diagram-chasing">GitHub</a> under
				open licenses.
			</p>
			<p>
				Our goal is to build a sustainable publication that can take on more ambitious projects. We
				are committed to quality, which means paying our collaborators fairly for their work and
				commissioning original art and design. We will never use AI-generated illustrations, art,
				designs, or written content in our work.
			</p>
		</div>
	</div>

	<!-- Donate CTA -->
	<div class="mb-16 max-w-sm border border-border p-6">
		<h2 class="font-serif text-xl font-bold">Donate to help us create more work</h2>
		<form class="mt-4">
			<script
				src="https://checkout.razorpay.com/v1/payment-button.js"
				data-payment_button_id="pl_QTZ3rX1jlkGMR8"
				async
			>
			</script>
		</form>
	</div>

	<!-- Friends -->
	<div>
		<h2 class="font-serif text-3xl font-bold">Friends of Diagram Chasing</h2>
		<p class="mt-2 mb-6 max-w-2xl">
			We're grateful to these people who support independent data journalism in India.
		</p>
		<div class="flex w-fit flex-col flex-wrap gap-1 space-y-1 divide-y divide-border">
			{#each friends as friend}
				<span class="pb-1 text-sm text-foreground">{friend}</span>
			{/each}
		</div>
	</div>
</div>
