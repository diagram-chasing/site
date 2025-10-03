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
		{ name: 'Netra K' },
		{ name: 'Varini G' },
		{ name: 'Arun Giridhar' },
		{ name: 'Sukheth Kallupalli' },
		{ name: 'Arun Augustine' },
		{ name: 'Dheeraj Reddy' },
		{ name: 'Rishabh Srivastava' }
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
			<div
				class="hidden border border-foreground/20 p-6 md:float-right md:mb-6 md:ml-8 md:block md:w-64"
			>
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
					<p class="max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
						Diagram Chasing creates data-driven stories, interactive tools, and open datasets of
						public interest. As of September 2025, we've been building and sharing this work for one
						year.
					</p>
					<p class="text-lg">
						In that time, we've
						<a target="_blank" rel="noopener" href="https://diagramchasing.fun/2024/votes-in-a-name"
							>uncovered electoral confusion caused by namesake candidates</a
						>,
						<a target="_blank" rel="noopener" href="https://diagramchasing.fun/2024/blr-water-log"
							>mapped Bangalore's natural drainage systems</a
						>, and made
						<a
							target="_blank"
							rel="noopener"
							href="https://diagramchasing.fun/2025/time-use-explorer"
							>India's 10-million-row Time Use Survey searchable in any browser</a
						>. Our project, CBFC Watch, is the largest analyzable dataset of
						<a target="_blank" rel="noopener" href="https://cbfc.watch">film censorship in India</a
						>. All our code, data, and methods are published on
						<a target="_blank" rel="noopener" href="https://github.com/diagram-chasing">GitHub</a> under
						open licenses.
					</p>

					<!-- Support CTA - Mobile Version (appears after intro) -->
					<div class="border border-foreground/20 p-6 md:hidden">
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
						<p class="text-center text-xs">UPI and all major cards via Razorpay.</p>
					</div>

					<div class="max-w-2xl space-y-6">
						<p class="text-lg">
							Our goal is to build a sustainable publication that can take on more ambitious
							projects. We are committed to quality, which means paying our collaborators fairly for
							their work and commissioning original art and design. We will never use AI-generated
							illustrations, art, designs, or written content in our work.
						</p>
						<p class="text-lg">
							Until now, all expenses for infrastructure, research, and commissions have come
							directly out of our own pockets. To make this work sustainable and expand our scope,
							we need your help.
						</p>
						<p class="text-lg">
							We're experimenting with a patron-based model. We've tallied our expenses to date,
							plus the estimated costs for our next project. Once we cover this amount, we will
							pause contributions until new costs arise. As a token of our gratitude, we'd be proud
							to list your name as a Friend of Diagram Chasing.
						</p>
					</div>
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
					<ul class=" list-inside list-disc">
						{#each friends as friend}
							{#if !friend.isPlaceholder}
								<li class="text-md py-1 font-medium">{friend.name}</li>
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
