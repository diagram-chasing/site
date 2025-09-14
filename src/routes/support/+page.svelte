<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';

	const expenses = [
		{
			category: 'Web Hosting & Infrastructure',
			amount: 240,
			description: 'Domain, CDN, database hosting'
		},
		{
			category: 'Data Sources & APIs',
			amount: 680,
			description: 'Election data, demographic datasets, API subscriptions'
		},
		{
			category: 'Design & Development Tools',
			amount: 420,
			description: 'Software licenses, design assets'
		},
		{
			category: 'Research Materials',
			amount: 180,
			description: 'Books, academic papers, reference materials'
		},
		{
			category: 'Hardware & Equipment',
			amount: 320,
			description: 'Computing resources, backup storage'
		}
	];

	const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
</script>

<div class="my-4 w-full">
	<main class="mx-auto max-w-4xl space-y-12 px-4">
		<!-- Header Section -->
		<div class="space-y-6">
			<h1
				class="font-serif text-3xl leading-tight font-black tracking-tighter text-foreground md:text-5xl lg:text-6xl"
			>
				Support our work
			</h1>
			<p class="max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
				Data-driven storytelling takes time, resources, and dedication. Your support helps us
				continue creating meaningful visualizations and insights that make complex information
				accessible to everyone.
			</p>
		</div>

		<!-- What We Do Section -->
		<div class="space-y-6">
			<h2 class="font-serif text-2xl font-bold tracking-tight text-foreground md:text-3xl">
				What we do
			</h2>
			<div class="grid gap-8 md:grid-cols-2">
				<div class="space-y-4">
					<h3 class="font-serif text-xl font-semibold text-foreground">Research & Analysis</h3>
					<p class="leading-relaxed text-muted-foreground">
						We dive deep into complex datasets, from election results to demographic trends,
						transforming raw numbers into compelling narratives that reveal hidden patterns and
						insights.
					</p>
				</div>
				<div class="space-y-4">
					<h3 class="font-serif text-xl font-semibold text-foreground">Data Visualization</h3>
					<p class="leading-relaxed text-muted-foreground">
						Every chart, map, and interactive element is carefully crafted to make information not
						just accessible, but engaging and memorable for our audience.
					</p>
				</div>
				<div class="space-y-4">
					<h3 class="font-serif text-xl font-semibold text-foreground">Open Source</h3>
					<p class="leading-relaxed text-muted-foreground">
						We believe in transparency. Our methodologies, code, and datasets are shared openly,
						contributing to the broader community of data storytellers.
					</p>
				</div>
				<div class="space-y-4">
					<h3 class="font-serif text-xl font-semibold text-foreground">Educational Impact</h3>
					<p class="leading-relaxed text-muted-foreground">
						Beyond publishing, we create resources that help others understand data literacy,
						statistical thinking, and the art of visual communication.
					</p>
				</div>
			</div>
		</div>

		<!-- Expenses Section -->
		<div class="space-y-6">
			<h2 class="font-serif text-2xl font-bold tracking-tight text-foreground md:text-3xl">
				Ongoing Expenses
			</h2>
			<p class="text-muted-foreground">
				Transparency is important to us. Here's where your support goes:
			</p>

			<div class="rounded-lg border bg-card p-1">
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head class="font-medium">Category</Table.Head>
							<Table.Head class="font-medium">Description</Table.Head>
							<Table.Head class="text-right font-medium">Amount</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each expenses as expense}
							<Table.Row>
								<Table.Cell class="font-medium">{expense.category}</Table.Cell>
								<Table.Cell class="text-muted-foreground">{expense.description}</Table.Cell>
								<Table.Cell class="text-right font-mono">${expense.amount}</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
					<Table.Footer>
						<Table.Row>
							<Table.Cell colspan={2} class="font-semibold">Total Operating Expenses</Table.Cell>
							<Table.Cell class="text-right font-mono font-semibold">${totalExpenses}</Table.Cell>
						</Table.Row>
					</Table.Footer>
				</Table.Root>
			</div>
		</div>

		<!-- Support Section -->
		<div class="space-y-6">
			<h2 class="font-serif text-2xl font-bold tracking-tight text-foreground md:text-3xl">
				How you can help
			</h2>
			<div class="space-y-8">
				<div class="rounded-lg border bg-muted/20 p-6">
					<div class="space-y-4">
						<h3 class="font-serif text-xl font-semibold text-foreground">Monthly Support</h3>
						<p class="leading-relaxed text-muted-foreground">
							Join our community of supporters and help us maintain consistent funding for ongoing
							projects. Every contribution, no matter the size, makes a meaningful difference.
						</p>
						<div class="flex flex-wrap gap-4">
							<Button variant="default" size="lg" class="font-semibold">Support Monthly</Button>
							<Button variant="outline" size="lg" class="font-semibold">One-time Donation</Button>
						</div>
					</div>
				</div>

				<div class="grid gap-6 md:grid-cols-3">
					<div class="space-y-3 text-center">
						<div class="font-serif text-2xl font-bold text-foreground">$10/month</div>
						<div class="text-sm text-muted-foreground">Covers basic hosting and domain costs</div>
					</div>
					<div class="space-y-3 text-center">
						<div class="font-serif text-2xl font-bold text-foreground">$25/month</div>
						<div class="text-sm text-muted-foreground">
							Funds data subscriptions and research tools
						</div>
					</div>
					<div class="space-y-3 text-center">
						<div class="font-serif text-2xl font-bold text-foreground">$50/month</div>
						<div class="text-sm text-muted-foreground">
							Enables new projects and deeper analysis
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Other Ways Section -->
		<div class="space-y-6">
			<h2 class="font-serif text-2xl font-bold tracking-tight text-foreground md:text-3xl">
				Other ways to support
			</h2>
			<div class="grid gap-6 md:grid-cols-2">
				<div class="space-y-3">
					<h3 class="font-semibold text-foreground">Share our work</h3>
					<p class="text-sm text-muted-foreground">
						The most valuable support is spreading awareness. Share our projects with colleagues,
						students, and anyone interested in data storytelling.
					</p>
				</div>
				<div class="space-y-3">
					<h3 class="font-semibold text-foreground">Contribute data or insights</h3>
					<p class="text-sm text-muted-foreground">
						Have interesting datasets or domain expertise? We're always looking for collaboration
						opportunities and fresh perspectives.
					</p>
				</div>
				<div class="space-y-3">
					<h3 class="font-semibold text-foreground">Feedback and suggestions</h3>
					<p class="text-sm text-muted-foreground">
						Your thoughts help us improve. Whether it's technical feedback or ideas for future
						projects, we value your input.
					</p>
				</div>
				<div class="space-y-3">
					<h3 class="font-semibold text-foreground">Professional partnerships</h3>
					<p class="text-sm text-muted-foreground">
						Organizations interested in data visualization consulting or educational workshops can
						reach out for collaboration opportunities.
					</p>
				</div>
			</div>
		</div>

		<!-- Thank You -->
		<div class="rounded-lg bg-muted/30 p-8 text-center">
			<h3 class="mb-4 font-serif text-xl font-semibold text-foreground">Thank you</h3>
			<p class="mx-auto max-w-2xl text-muted-foreground">
				Whether you support us financially, share our work, or simply engage with our content,
				you're part of making complex information more accessible and democracy more transparent.
				We're grateful for your interest and support.
			</p>
		</div>
	</main>
</div>
