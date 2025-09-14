<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';

	const expenses = [
		{
			category: 'Domains',
			amount: null,
			description: null,
			isHeader: true
		},
		{
			category: 'cbfc.watch',
			amount: 2600,
			description: 'Domain registration and maintenance',
			isIndented: true
		},
		{
			category: 'whoismyneta.com',
			amount: 1000,
			description: 'Domain registration and maintenance',
			isIndented: true
		},
		{
			category: 'diagramchasing.fun',
			amount: 2300,
			description: 'Domain registration and maintenance',
			isIndented: true
		},
		{
			category: 'CBFC Watch',
			amount: null,
			description: null,
			isHeader: true
		},
		{
			category: 'Commissioned Art',
			amount: 9000,
			description: 'Art and icons for homepage',
			isIndented: true
		},
		{
			category: 'Research and prototyping costs',
			amount: 5000,
			description: 'LLM prototyping, data cleaning and trials',
			isIndented: true
		},
		{
			category: 'Upcoming Projects',
			amount: null,
			description: null,
			isHeader: true
		},
		{
			category: 'How India Spends Time - Art budget (Estimate)',
			amount: 20000,
			description: 'Artwork for story based on the National Time Use Survey',
			isIndented: true
		}
	];

	const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

	/**
	 * Formats a number as Indian currency (e.g., ₹1,00,000).
	 * @param value The number to format.
	 * @returns A formatted currency string or an empty string if the value is null.
	 */
	const formatCurrency = (value: number | null): string => {
		if (value === null || typeof value === 'undefined') {
			return '';
		}
		return `₹${value.toLocaleString('en-IN')}`;
	};
</script>

<div class="my-4 w-full">
	<main class="mx-auto max-w-4xl space-y-12 px-4">
		<div class="space-y-6">
			<h1 class="font-serif text-4xl font-bold tracking-tight text-foreground md:text-5xl">
				Support Diagram Chasing
			</h1>
			<p class="max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
				Diagram Chasing creates data-driven stories, interactive tools, and open datasets of public
				interest. As of September 2025, we've been building and sharing this work for one year.
			</p>
			<p class="text-lg">
				In that time, we've
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
		</div>

		<div class="space-y-6">
			<p class="text-lg">
				Our goal is to build a sustainable publication that can take on more ambitious projects. We
				are committed to quality, which means paying our collaborators fairly for their work and
				commissioning original art and design. We will never use AI-generated content.
			</p>
			<p class="text-lg">
				Until now, all expenses for infrastructure, research, and commissions have come directly out
				of our own pockets. To make this work sustainable and expand our scope, we need your help.
			</p>
			<p class="text-lg">
				We're experimenting with a patron-based model. We've tallied our expenses to date, plus the
				estimated costs for our next project. Once we cover this amount, we will pause contributions
				until new costs arise. As a token of our gratitude, we'd be proud to list your name as a
				Friend of Diagram Chasing.
			</p>
		</div>

		<div class="space-y-6">
			<p class="text-muted-foreground">Here's where your support goes:</p>

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
							<Table.Row class={expense.isHeader ? 'bg-muted/20' : ''}>
								<Table.Cell
									class={expense.isHeader
										? 'font-bold text-foreground'
										: expense.isIndented
											? 'pl-8 font-medium text-muted-foreground'
											: 'font-medium'}
								>
									{expense.category}
								</Table.Cell>
								<Table.Cell class="text-muted-foreground ">
									{expense.description || ''}
								</Table.Cell>
								<Table.Cell class="text-right font-mono">
									{formatCurrency(expense.amount)}
								</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
					<Table.Footer>
						<Table.Row>
							<Table.Cell colspan={2} class="font-semibold">Total Operating Expenses</Table.Cell>
							<Table.Cell class="text-right font-mono font-semibold"
								>{formatCurrency(totalExpenses)}</Table.Cell
							>
						</Table.Row>
					</Table.Footer>
				</Table.Root>
			</div>
		</div>

		<div class="space-y-6">
			<h2 class="font-serif text-2xl font-bold tracking-tight text-foreground md:text-3xl">
				Become a Supporter
			</h2>
			<p>
				If you find our work valuable, do consider making a contribution. Your support directly
				funds the projects listed above and allows us to keep our work independent and freely
				accessible. We accept payments through Razorpay, which supports UPI and all major cards.
			</p>
			<div class="pt-2">
				<form class="flex w-full">
					<script
						src="https://checkout.razorpay.com/v1/payment-button.js"
						data-payment_button_id="pl_QTZ3rX1jlkGMR8"
						async
					>
					</script>
				</form>
			</div>
		</div>

		<div>
			<p class="max-w-2xl text-muted-foreground">
				Financial support is powerful, but it's not the only way to help. Sharing our work with your
				network, engaging with our stories, or building on our open data are all invaluable
				contributions. Thank you for being part of our effort to make complex information accessible
				and our democracy more transparent.
			</p>
		</div>
	</main>
</div>

<style>
	a {
		/* font-weight: 600; */
		text-decoration: underline;
		text-underline-offset: 4px;
	}
</style>
