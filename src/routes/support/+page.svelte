<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import RazorpayLogo from '$lib/assets/razorpay-logo.svg?raw';

	let { data } = $props();
	const friends = data.friends;
	const funding = data.funding;

	function formatAmount(amount: number, currency: string) {
		return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
	}
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
	{#if funding}
	<div class="mb-16 max-w-2xl">
		<h2 class="font-serif text-3xl font-bold">Fund our work</h2>
		<p class="mt-2 mb-6 text-muted-foreground">We are raising funds to cover our research, commissioning, and infrastructure costs.</p>
		<div class="divide-y divide-border border border-border">
			{#each funding.plans as plan}
			<div class="flex items-start justify-between gap-4 p-4">
				<div>
					<p class="font-medium">{plan.name}</p>
					<p class="mt-1 text-sm text-muted-foreground">{plan.description}</p>
				</div>
				<div class="shrink-0 text-right">
					<p class="font-mono text-sm font-medium">
						{#if plan.amount > 0}
							{formatAmount(plan.amount, plan.currency)}
						{:else}
							Pay what you want
						{/if}
					</p>
					<p class="text-[10px] uppercase tracking-wider text-muted-foreground">
						{plan.frequency === 'yearly' ? 'per year' : plan.frequency === 'monthly' ? 'per month' : plan.frequency}
					</p>
				</div>
			</div>
			{/each}
		</div>
		<a
			href={funding.url}
			target="_blank"
			rel="noopener noreferrer"
			class="mt-4 inline-flex items-center gap-3 border border-border px-5 py-2.5 text-sm font-medium hover:bg-foreground hover:text-background transition-colors group"
		>
			Donate via
			<span class="h-4 w-auto [&>svg]:h-full [&>svg]:w-auto group-hover:[&_path]:fill-background group-hover:[&_polygon]:fill-background">{@html RazorpayLogo}</span>
		</a>

		{#if funding.history && funding.history.length > 0}
		<div class="mt-12">
			<h3 class="font-serif text-xl font-bold italic">History</h3>
			<div class="mt-4 space-y-6">
				{#each funding.history as item}
				<div class="border-l-2 border-border pl-4">
					<div class="flex items-baseline justify-between">
						<span class="font-mono text-sm font-bold">{item.year}</span>
						<span class="font-mono text-xs text-muted-foreground">
							In: {formatAmount(item.income, item.currency)} / Out: {formatAmount(item.expenses, item.currency)}
						</span>
					</div>
					<p class="mt-1 text-sm text-muted-foreground leading-relaxed italic">{item.description}</p>
				</div>
				{/each}
			</div>
		</div>
		{/if}
	</div>
	{/if}

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
