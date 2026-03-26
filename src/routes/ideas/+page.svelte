<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import type { PageData } from './$types';
	import type { Idea } from '$lib/utils/posts';

	let { data }: { data: PageData } = $props();
	const { ideas } = data;

	function parseDataTokens(raw: string): Array<{ type: 'link' | 'text'; text: string; url?: string }> {
		if (!raw?.trim()) return [];
		const URL_RE = /https?:\/\/[^\s,]+/g;
		const result: Array<{ type: 'link' | 'text'; text: string; url?: string }> = [];
		let last = 0, m: RegExpExecArray | null;
		while ((m = URL_RE.exec(raw)) !== null) {
			const pre = raw.slice(last, m.index).replace(/^[\s,]+|[\s,]+$/g, '');
			if (pre) result.push({ type: 'text', text: pre });
			try {
				result.push({ type: 'link', text: new URL(m[0]).hostname.replace('www.', ''), url: m[0] });
			} catch {
				result.push({ type: 'text', text: m[0] });
			}
			last = m.index + m[0].length;
		}
		const tail = raw.slice(last).replace(/^[\s,]+/, '');
		if (tail) result.push({ type: 'text', text: tail });
		return result.filter(t => t.text);
	}

	const STATUS = {
		PUBLISHED: { label: 'Published', color: '#22c55e' },
		WIP:       { label: 'WIP',       color: '#fbbf24' },
		'':        { label: 'Idea',      color: 'hsl(var(--border))' },
	} as const;

	function getStatus(s: string | undefined) {
		return STATUS[(s ?? '') as keyof typeof STATUS] ?? STATUS[''];
	}

	type SortDir = 'desc' | 'asc';
	let sortDir = $state<SortDir>('desc');

	const sorted = $derived(
		[...ideas].sort((a, b) => {
			const cmp = a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
			return sortDir === 'desc' ? -cmp : cmp;
		})
	);
</script>

<SEO
	title="Project Ideas — Diagram Chasing"
	description="A running list of data visualization and journalism ideas we'd like to build someday."
	keywords="data visualization, ideas, projects, india, data journalism"
/>

<div class="mx-auto max-w-5xl px-4 py-12">
	<div class="mb-10 flex max-w-2xl flex-col gap-2">
		<h1 class="font-serif text-3xl font-bold">Ideas</h1>
		<p class="text-muted-foreground">
			A running backlog of things we'd like to build — data stories, tools, games.
		</p>
	</div>

	<div class="mb-4 flex items-center justify-end">
		<button
			onclick={() => (sortDir = sortDir === 'desc' ? 'asc' : 'desc')}
			class="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
		>
			Date {sortDir === 'desc' ? '↓' : '↑'}
		</button>
	</div>

	<div class="table-wrap">
	<Table.Root>
		<Table.Header class="hidden">
			<Table.Row class="m-0 h-0 border-none p-0 hover:bg-transparent">
				<Table.Head></Table.Head>
				<Table.Head class="w-full"></Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each sorted as idea (idea.date + idea.pitch)}
				{@const st = getStatus(idea.status)}
				{@const tokens = parseDataTokens(idea.data ?? '')}
				<Table.Row class="group hover:bg-transparent max-sm:block max-sm:border-b max-sm:py-3">
					<Table.Cell class="py-3 pl-0 align-top max-sm:hidden">
						<div class="flex flex-col items-center gap-1 pt-1.5">
							<div
								class="size-2 shrink-0 rounded-full"
								style="background-color: {st.color};"
								title={st.label}
							></div>
						</div>
					</Table.Cell>

					<Table.Cell class="w-full py-3 pr-0 max-sm:block max-sm:p-0">
						<div class="flex items-baseline gap-2">
							<div
								class="hidden max-sm:block size-2 shrink-0 translate-y-px rounded-full"
								style="background-color: {st.color};"
								title={st.label}
							></div>
							<p class="font-serif text-base font-bold leading-snug">{idea.pitch}</p>
						</div>
						{#if idea.description}
							<p class="mt-1 text-sm leading-relaxed text-muted-foreground">{idea.description}</p>
						{/if}
						{#if tokens.length}
							<p class="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-muted-foreground/70">
								{#each tokens as token, i}
									{#if token.type === 'link'}
										<a
											href={token.url}
											target="_blank"
											rel="noopener noreferrer"
											class="underline underline-offset-2 transition-colors hover:text-muted-foreground"
										>{token.text}</a>
									{:else}
										<span>{token.text}</span>
									{/if}
									{#if i < tokens.length - 1}<span>·</span>{/if}
								{/each}
							</p>
						{/if}
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
	</div>
</div>

<style>
	.table-wrap :global([data-slot="table-container"]) {
		overflow-x: visible;
	}
</style>
