<script lang="ts">
	import { onMount } from 'svelte';

	// no props needed

	let sentinel: HTMLElement | undefined;

	interface Rect {
		x: number;
		y: number;
		w: number;
		h: number;
		idx?: number;
	}

	let svgW = $state(0);
	let svgH = $state(0);
	let relays: { x: number; y: number }[] = $state([]);
	let edgePaths: string[] = $state([]);

	let headerPath = $state('');
	let headerRelays: { x: number; y: number }[] = $state([]);

	const uid = Math.random().toString(36).slice(2, 7);

	function measure() {
		const containerEl = sentinel?.parentElement;
		if (!containerEl) return;

		svgW = containerEl.offsetWidth;
		svgH = containerEl.offsetHeight;

		const cr = containerEl.getBoundingClientRect();
		const cardEls = Array.from(containerEl.querySelectorAll('[data-diagram-node]'));
		const headerEl = containerEl.querySelector('[data-diagram-header]');

		if (cardEls.length < 2) return;

		const rects: Rect[] = cardEls.map((el, i) => {
			const r = el.getBoundingClientRect();
			return { x: r.left - cr.left, y: r.top - cr.top, w: r.width, h: r.height, idx: i };
		});

		let headerRect: Rect | null = null;
		if (headerEl) {
			const r = headerEl.getBoundingClientRect();
			headerRect = { x: r.left - cr.left, y: r.top - cr.top, w: r.width, h: r.height };
		}

		const [featured, ...grid] = rects;
		if (grid.length === 0) return;

		const cx = (r: Rect) => Math.round(r.x + r.w / 2);
		const cy = (r: Rect) => Math.round(r.y + r.h / 2);
		const top = (r: Rect) => Math.round(r.y);
		const left = (r: Rect) => Math.round(r.x);
		const right = (r: Rect) => Math.round(r.x + r.w);

		// --- Header path ---
		if (headerRect && featured) {
			const hRight = right(headerRect);
			const fTop = top(featured);
			const vx = cx(featured);
			const startY = Math.round(headerRect.y + headerRect.h * 0.55);

			headerPath = `M${vx + vx * 0.3},${startY} H${vx * 1.5} V${fTop}`;
			headerRelays = [{ x: vx + vx * 0.3, y: startY }];
		} else {
			headerPath = '';
			headerRelays = [];
		}

		const rows: Rect[][] = [];
		grid.forEach((card) => {
			const row = rows.find((r) => Math.abs(cy(r[0]) - cy(card)) < 60);
			row ? row.push(card) : rows.push([card]);
		});
		rows.forEach((row) => row.sort((a, b) => a.x - b.x));

		const newPaths: string[] = [];
		const newRelays: { x: number; y: number }[] = [];

		const route = (path: string, ...points: [number, number][]) => {
			newPaths.push(path);
			points.forEach(([x, y]) => {
				if (!newRelays.some((r) => Math.abs(r.x - x) < 4 && Math.abs(r.y - y) < 4)) {
					newRelays.push({ x, y });
				}
			});
		};

		const MARGIN = 140;
		const fMidY = cy(featured);
		const lX = left(featured) - MARGIN;
		const rX = right(featured) + MARGIN;
		const lastRow = rows[rows.length - 1];

		// --- Left spine ---
		if (lX > 8) {
			route(`M${left(featured)},${fMidY} H${lX} V${cy(lastRow[0])}`, [lX, fMidY]);
			rows.forEach((r) => {
				const card = r[0];
				route(`M${lX},${cy(card)} H${left(card)}`, [lX, cy(card)]);
			});
		}

		// --- Right spine ---
		if (rX < svgW - 8) {
			const lastCard = lastRow[lastRow.length - 1];
			route(`M${right(featured)},${fMidY} H${rX} V${cy(lastCard)}`, [rX, fMidY]);
			rows.forEach((r) => {
				const c = r[r.length - 1];
				route(`M${right(c)},${cy(c)} H${rX}`, [rX, cy(c)]);
			});
		}

		relays = newRelays;
		edgePaths = newPaths;
	}

	onMount(() => {
		const containerEl = sentinel?.parentElement;
		if (!containerEl) return;
		measure();
		const ro = new ResizeObserver(() => requestAnimationFrame(measure));
		ro.observe(containerEl);
		return () => ro.disconnect();
	});
</script>

<div bind:this={sentinel} aria-hidden="true" style="display:none"></div>

{#if edgePaths.length || headerPath}
	<svg
		style="position:absolute;inset:0;width:100%;height:{svgH}px;pointer-events:none;z-index:-1"
		viewBox="0 0 {svgW} {svgH}"
		aria-hidden="true"
		class="diagram-svg hidden lg:block"
	>
		{#each edgePaths as d}
			<path {d} stroke="var(--color-base-300)" stroke-width="0.5" fill="none" opacity="0.8" />
		{/each}
		{#each relays as r}
			<rect
				x={r.x - 2.5}
				y={r.y - 2.5}
				width="5"
				height="5"
				fill="white"
				stroke="var(--color-base-300)"
				stroke-width="0.5"
				opacity="1"
				stroke-opacity="0.8"
			/>
		{/each}

		{#if headerPath}
			<path
				d={headerPath}
				stroke="var(--color-base-300)"
				stroke-width="0.5"
				fill="none"
				opacity="0.8"
			/>
			{#each headerRelays as r}
				<rect
					x={r.x - 2.5}
					y={r.y - 2.5}
					width="5"
					height="5"
					fill="white"
					stroke="var(--color-base-300)"
					stroke-width="0.5"
					stroke-opacity="0.8"
				/>
			{/each}
		{/if}
	</svg>
{/if}

<style>
	.diagram-svg {
		animation: diagram-fade 0.4s ease-out both;
	}

	@keyframes diagram-fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
