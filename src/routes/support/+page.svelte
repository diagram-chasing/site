<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import expensesData from '$lib/data/expenses.json';
	import receivedFundsData from '$lib/data/received-funds.json';

	interface ExpenseItem {
		id: number;
		category: string;
		amount: number | null;
		description: string | null;
		isHeader?: boolean;
		isIndented?: boolean;
		isCovered?: boolean;
	}

	interface ExpenseGroup {
		title: string;
		items: ExpenseItem[];
		total: number;
	}

	interface Friend {
		name: string;
		isPlaceholder?: boolean;
	}

	const expenses = expensesData as ExpenseItem[];
	const receivedFunds = receivedFundsData;
	const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
	const totalReceived = receivedFunds.reduce((sum, fund) => sum + fund.amount, 0);
	const totalRemaining = totalExpenses - totalReceived;

	// Group expenses by category headers
	const expenseGroups: ExpenseGroup[] = [];
	let currentGroup: ExpenseGroup | null = null;

	expenses.forEach((expense) => {
		if (expense.isHeader) {
			if (currentGroup) expenseGroups.push(currentGroup);
			currentGroup = {
				title: expense.category,
				items: [],
				total: 0
			};
		} else if (currentGroup && expense.amount) {
			currentGroup.items.push(expense);
			currentGroup.total += expense.amount;
		}
	});
	if (currentGroup) expenseGroups.push(currentGroup);

	// Friends of the site
	const friends: Friend[] = [
		{ name: 'Gaurav Singh' },
		{ name: 'Divya Ribeiro' },
		{ name: 'Netra K' }
	];

	/**
	 * Formats a number as Indian currency (e.g., ₹1,00,000).
	 */
	const formatCurrency = (value: number | null): string => {
		if (value === null || typeof value === 'undefined') {
			return '';
		}
		return `₹${value.toLocaleString('en-IN')}`;
	};
</script>

<SEO
	title="Support Diagram Chasing"
	description="Support independent data journalism and visualization work in India. Help fund research for public interest projects."
	keywords="support, donate, data journalism, india, public interest, crowdfunding"
/>

<div class="my-8 w-full">
	<main class="mx-auto max-w-4xl space-y-12 px-6">
		<div class="space-y-12">
			<!-- Support CTA - Float Right on Desktop, Hidden on Mobile -->
			<div class="md:float-right md:mb-6 md:ml-8 md:w-64 border border-foreground/20 p-6 hidden md:block">
				<div class="mb-2">
					<div class="font-mono text-xl font-bold">
						{formatCurrency(Math.max(0, totalRemaining))}
					</div>
					<div class="mt-1 text-sm">Amount Remaining</div>
				</div>
				<form class="mb-2">
					<script
						src="https://checkout.razorpay.com/v1/payment-button.js"
						data-payment_button_id="pl_QTZ3rX1jlkGMR8"
						async
					>
					</script>
				</form>
				<p class="text-xs">UPI and all major cards via Razorpay.</p>
			</div>

			<!-- Main Content -->
			<div class="space-y-8">
				<h1 class="font-serif text-4xl font-bold tracking-tight md:text-5xl">
					Support Diagram Chasing
				</h1>

				<div class="space-y-6 text-lg leading-relaxed">
					<p>
						Independent data journalism creating stories, interactive tools, and open datasets of
						public interest. We've been building and sharing this work for one year.
					</p>
					<p>
						We've
						<a target="_blank" rel="noopener" href="https://diagramchasing.fun/2024/votes-in-a-name"
							>uncovered electoral confusion</a
						>,
						<a target="_blank" rel="noopener" href="https://diagramchasing.fun/2024/blr-water-log"
							>mapped Bangalore's drainage</a
						>, made
						<a
							target="_blank"
							rel="noopener"
							href="https://diagramchasing.fun/2025/time-use-explorer"
							>India's Time Use Survey searchable</a
						>, and created the largest
						<a target="_blank" rel="noopener" href="https://cbfc.watch">film censorship dataset</a> in
						India.
					</p>

					<!-- Support CTA - Mobile Version (appears after intro) -->
					<div class="md:hidden border border-foreground/20 p-6">
						<div class="mb-4 text-center">
							<div class="font-mono text-xl font-bold">
								{formatCurrency(Math.max(0, totalRemaining))}
							</div>
							<div class="mt-1 text-sm">Amount Remaining</div>
						</div>
						<form class="mb-3">
							<script
								src="https://checkout.razorpay.com/v1/payment-button.js"
								data-payment_button_id="pl_QTZ3rX1jlkGMR8"
								async
							>
							</script>
						</form>
						<p class="text-xs text-center">UPI and all major cards via Razorpay.</p>
					</div>
					<p>
						Our goal is to build a sustainable publication that pays collaborators fairly and
						commissions original art and design. We never use AI-generated content.
					</p>
					<p>
						We're experimenting with a patron-based model. Once we cover our expenses, we'll pause
						contributions until new costs arise. Supporters become <strong
							>Friends of Diagram Chasing</strong
						>.
					</p>
				</div>
			</div>
		</div>

		<!-- Clear float for next section -->
		<div class="clear-both"></div>

		<!-- Financial Breakdown -->
		<div class="space-y-8">
			<h2 class="font-serif text-2xl font-bold">Where Your Support Goes</h2>

			<!-- Financial Summary -->
			<div class="border-t border-b border-foreground/20 py-2">
				<div class="grid grid-cols-3 gap-1 text-center">
					<div>
						<div class="font-mono text-lg font-bold">{formatCurrency(totalExpenses)}</div>
						<div class="text-sm">Total Expenses</div>
					</div>
					{#if totalReceived > 0}
						<div>
							<div class="font-mono text-lg font-bold">{formatCurrency(totalReceived)}</div>
							<div class="text-sm">Received</div>
						</div>
					{/if}
					<div>
						<div class="font-mono text-xl font-bold">
							{formatCurrency(Math.max(0, totalRemaining))}
						</div>
						<div class="text-sm">Remaining</div>
					</div>
				</div>
			</div>

			<!-- Expense Categories -->
			<div class="grid gap-10 md:grid-cols-2">
				{#each expenseGroups as group}
					<div class="space-y-1">
						<h3 class="text-lg font-bold">{group.title}</h3>
						<div class="space-y-3">
							{#each group.items as item}
								<div class="flex items-start justify-between gap-3">
									<div class="flex-1">
										<div class="font-medium">{item.category}</div>
										{#if item.description}
											<div class="mt-1 text-sm opacity-70">{item.description}</div>
										{/if}
									</div>
									<div class="text-right">
										{#if item.isCovered}
											<span class="mt-1 text-sm text-green-400">✓ Covered</span>
										{:else}
											<div class="font-mono font-medium">
												{formatCurrency(item.amount)}
											</div>
										{/if}
									</div>
								</div>
							{/each}
							<!-- <div class="mt-4 border-t border-foreground/20 pt-3">
								<div class="flex justify-between font-bold">
									<span>Total</span>
									<span class="font-mono">{formatCurrency(group.total)}</span>
								</div>
							</div> -->
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Friends of the Site -->
		<!-- <div class="space-y-4">
			<h2 class="font-serif text-2xl font-bold">Friends of Diagram Chasing</h2>
			<p class="max-w-2xl">
				We're grateful to these wonderful people who support independent data journalism in India.
			</p>

			<div class="border-b border-foreground/20 pb-2">
				{#if friends.some((friend) => !friend.isPlaceholder)}
					<ul class=" list-disc list-inside">
						{#each friends as friend}
							{#if !friend.isPlaceholder}
								<li class="py-1 font-medium text-md">{friend.name}</li>
							{/if}
						{/each}
					</ul>
				{:else}
					<p class="italic">Your name could be here!</p>
				{/if}
			</div>
				<p class="max-w-2xl">
					Financial support is great, but it's not the only way to help. Sharing our work with your
					network, engaging with our stories, or building on our open data are all welcome
					contributions. Thank you!
				</p>
		</div> -->

		<!-- Alternative Support -->
	</main>
</div>

<style>
	a {
		/* font-weight: 600; */
		text-decoration: underline;
		text-underline-offset: 4px;
	}
</style>
