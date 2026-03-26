<script lang="ts">
	import { scaleLinear } from 'd3-scale';

	//  Arrows flow DOWN toward the content below.
	//  Abstract terms at top, specific at bottom.
	//
	//  ●  →  ●  →  ●                   ← abstract (from description)
	//  ↓     ↓     ↓
	//  ●  →  ●  →  ●  →  ●            ← intermediate
	//        ↓     ↓
	//        ●  →  ●                   ← specific (pointing to projects)

	interface Props {
		terms?: string[];
	}

	let { terms = [] }: Props = $props();

	const NODE_SIZE = 10;

	const grid: [number, number][] = [
		[1, 0], [2, 0], [3, 0],
		[0, 1], [1, 1], [2, 1], [3, 1],
		[1, 2], [2, 2]
	];

	// Horizontal → and vertical ↓
	const edgeDefs: [number, number][] = [
		[0, 1], [1, 2],
		[3, 4], [4, 5], [5, 6],
		[7, 8],
		[0, 4], [1, 5], [2, 6],
		[4, 7], [5, 8]
	];

	const xScale = scaleLinear().domain([0, 3]).range([160, 740]);
	const yScale = scaleLinear().domain([0, 2]).range([20, 120]);

	interface Node {
		x: number;
		y: number;
		label: string;
	}

	const nodes: Node[] = grid.map(([gx, gy], i) => ({
		x: xScale(gx),
		y: yScale(gy),
		label: terms[i] ?? ''
	}));

	interface Arrow {
		path: string;
		length: number;
		source: number;
		target: number;
	}

	const arrows: Arrow[] = edgeDefs.map(([si, ti]) => {
		const s = nodes[si];
		const t = nodes[ti];
		const dx = t.x - s.x;
		const dy = t.y - s.y;
		const len = Math.sqrt(dx * dx + dy * dy);
		const nx = dx / len;
		const ny = dy / len;
		const gap = NODE_SIZE / 2 + 4;
		const tip = NODE_SIZE / 2 + 8;
		const x1 = s.x + nx * gap;
		const y1 = s.y + ny * gap;
		const x2 = t.x - nx * tip;
		const y2 = t.y - ny * tip;

		return {
			path: `M${x1},${y1}L${x2},${y2}`,
			length: Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2),
			source: si,
			target: ti
		};
	});

	// Adjacency for BFS
	const adj: Map<number, { neighbor: number; arrowIdx: number }[]> = new Map();
	for (let i = 0; i < nodes.length; i++) adj.set(i, []);
	arrows.forEach((a, i) => {
		adj.get(a.source)!.push({ neighbor: a.target, arrowIdx: i });
		adj.get(a.target)!.push({ neighbor: a.source, arrowIdx: i });
	});

	let hoveredNode: number | null = $state(null);
	let activeArrows: Set<number> = $state(new Set());
	let activeNodes: Set<number> = $state(new Set());
	let chaseTimers: ReturnType<typeof setTimeout>[] = [];
	let visible = $state(false);
	let svgEl: SVGSVGElement | undefined = $state();

	$effect(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			visible = true;
			return;
		}
		if (!svgEl) return;
		const obs = new IntersectionObserver(
			([e]) => {
				if (e.isIntersecting) {
					visible = true;
					obs.disconnect();
				}
			},
			{ threshold: 0.3 }
		);
		obs.observe(svgEl);
		return () => obs.disconnect();
	});

	function chase(idx: number) {
		clearChase();
		hoveredNode = idx;
		activeNodes = new Set([idx]);
		activeArrows = new Set();
		const visited = new Set([idx]);
		let frontier = [idx];

		function wave() {
			const next: number[] = [];
			const nA = new Set(activeArrows);
			const nN = new Set(activeNodes);
			for (const id of frontier) {
				for (const { neighbor, arrowIdx } of adj.get(id)!) {
					if (!visited.has(neighbor)) {
						visited.add(neighbor);
						next.push(neighbor);
						nA.add(arrowIdx);
						nN.add(neighbor);
					}
				}
			}
			if (next.length) {
				activeArrows = nA;
				activeNodes = nN;
				frontier = next;
				chaseTimers.push(setTimeout(wave, 150));
			}
		}
		chaseTimers.push(setTimeout(wave, 80));
	}

	function clearChase() {
		chaseTimers.forEach(clearTimeout);
		chaseTimers = [];
		hoveredNode = null;
		activeArrows = new Set();
		activeNodes = new Set();
	}

	const uid = Math.random().toString(36).slice(2, 7);
</script>

<svg bind:this={svgEl} viewBox="0 0 900 165" class="diagram" aria-hidden="true">
	<defs>
		<marker id="a-{uid}" viewBox="0 0 6 6" refX="5" refY="3"
			markerWidth="5" markerHeight="5" orient="auto-start-reverse">
			<path d="M0,0.5L5,3L0,5.5" fill="var(--color-base-300)" />
		</marker>
		<marker id="ar-{uid}" viewBox="0 0 6 6" refX="5" refY="3"
			markerWidth="5" markerHeight="5" orient="auto-start-reverse">
			<path d="M0,0.5L5,3L0,5.5" fill="var(--color-red-600)" />
		</marker>
		<marker id="af-{uid}" viewBox="0 0 6 6" refX="5" refY="3"
			markerWidth="5" markerHeight="5" orient="auto-start-reverse">
			<path d="M0,0.5L5,3L0,5.5" fill="var(--color-base-150)" />
		</marker>
	</defs>

	{#each arrows as arrow, i}
		{@const active = activeArrows.has(i)}
		{@const faded = hoveredNode !== null && !active}
		<path
			d={arrow.path}
			stroke={active ? 'var(--color-red-600)' : faded ? 'var(--color-base-150)' : 'var(--color-base-300)'}
			stroke-width="1.2"
			fill="none"
			marker-end={active ? `url(#ar-${uid})` : faded ? `url(#af-${uid})` : `url(#a-${uid})`}
			class="arrow"
			class:draw-in={visible}
			style:--len="{arrow.length}"
			style:--delay="{i * 70}ms"
		/>
	{/each}

	{#each nodes as node, i}
		{@const active = activeNodes.has(i)}
		{@const faded = hoveredNode !== null && !active}
		<rect
			x={node.x - NODE_SIZE / 2}
			y={node.y - NODE_SIZE / 2}
			width={NODE_SIZE}
			height={NODE_SIZE}
			fill={active ? 'var(--color-red-600)' : 'none'}
			stroke={active ? 'var(--color-red-600)' : faded ? 'var(--color-base-150)' : 'var(--color-base-300)'}
			stroke-width="1.2"
			class="node"
			class:show={visible}
			role="presentation"
			onmouseenter={() => chase(i)}
			onmouseleave={clearChase}
		/>
		{#if node.label}
			<text
				x={node.x}
				y={node.y + NODE_SIZE / 2 + 13}
				text-anchor="middle"
				class="label"
				class:show={visible}
				fill={active ? 'var(--color-red-600)' : faded ? 'var(--color-base-150)' : 'var(--color-base-500)'}
			>
				{node.label}
			</text>
		{/if}
	{/each}
</svg>

<style>
	.diagram {
		display: block;
		width: 100%;
		max-height: 165px;
	}

	.arrow {
		stroke-dasharray: var(--len);
		stroke-dashoffset: var(--len);
		transition: stroke 0.3s ease;
	}

	.arrow.draw-in {
		animation: draw 0.5s ease-out var(--delay, 0ms) forwards;
	}

	@keyframes draw {
		to { stroke-dashoffset: 0; }
	}

	.node {
		opacity: 0;
		transition: fill 0.3s ease, stroke 0.3s ease, opacity 0.4s ease;
		cursor: pointer;
	}

	.node.show {
		opacity: 1;
	}

	.label {
		font-family: 'Atkinson Hyperlegible', sans-serif;
		font-size: 9px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		opacity: 0;
		transition: fill 0.3s ease, opacity 0.5s ease;
		pointer-events: none;
	}

	.label.show {
		opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		.arrow { stroke-dashoffset: 0; animation: none; }
		.node, .label { opacity: 1; }
	}
</style>
