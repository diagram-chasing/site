<script lang="ts">
	interface Props {
		nodeTags?: string[][];
	}
	let { nodeTags = [] }: Props = $props();

	let sentinel = $state<HTMLElement | undefined>();

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
	let edgeLabels: { x: number; y: number; text: string; vertical: boolean }[] = $state([]);

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
		const bottom = (r: Rect) => Math.round(r.y + r.h);
		const left = (r: Rect) => Math.round(r.x);
		const right = (r: Rect) => Math.round(r.x + r.w);

		const newLabels: { x: number; y: number; text: string; vertical: boolean }[] = [];

		const pickTags = (tags: string[]) => tags.slice(0, 1).map((t) => t.toUpperCase());

		const labelV = (x: number, y1: number, y2: number, tags: string[]) => {
			const chosen = pickTags(tags);
			if (!chosen.length) return;
			newLabels.push({
				x: x - 8,
				y: Math.round((y1 + y2) / 2),
				text: chosen.join(' · '),
				vertical: true
			});
		};

		const labelH = (x1: number, x2: number, y: number, tags: string[]) => {
			const chosen = pickTags(tags);
			if (!chosen.length) return;
			newLabels.push({
				x: Math.round((x1 + x2) / 2),
				y: y - 7,
				text: chosen.join(' · '),
				vertical: false
			});
		};

		// --- Header path ---
		if (headerRect && featured) {
			const hRight = right(headerRect);
			const fRight = right(featured);
			const fTop = top(featured);
			const featuredTags = featured.idx != null ? (nodeTags[featured.idx] ?? []) : [];

			headerRelays = [];

			if (fRight - hRight > 9) {
				const startY = Math.round(headerRect.y + headerRect.h * 0.45);
				const startX = hRight - 14;
				const vx = fRight - fRight * 0.2;

				headerPath = `M${startX - startX * 0.25},${startY} H${vx} V${fTop}`;
				headerRelays.push({ x: vx, y: startY });
				labelV(vx, startY, fTop, featuredTags);
			} else {
				const startX = cx(headerRect);
				const startY = bottom(headerRect) + 16;

				headerPath = `M${startX},${startY} V${fTop}`;
				labelV(startX, startY, fTop, featuredTags);
			}
		} else {
			headerPath = '';
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

		const firstRow = rows[0];
		const fBot = bottom(featured);
		const fCx = cx(featured);
		const topGutter = Math.round(fBot + (top(firstRow[0]) - fBot) / 2);

		firstRow.forEach((card) => {
			const gcx = cx(card),
				gTop = top(card);
			if (Math.abs(fCx - gcx) < 6) {
				route(`M${gcx},${fBot} V${gTop}`, [gcx, topGutter]);
			} else {
				route(`M${fCx},${fBot} V${topGutter} H${gcx} V${gTop}`, [fCx, topGutter], [gcx, topGutter]);
			}
		});

		rows.forEach((row, ri) => {
			for (let i = 0; i < row.length - 1; i++) {
				const A = row[i],
					B = row[i + 1];
				const ay = cy(A),
					by = cy(B),
					ax = right(A),
					bx = left(B);
				const gx = Math.round((ax + bx) / 2);
				if (Math.abs(ay - by) < 4) route(`M${ax},${ay} H${bx}`, [gx, ay]);
				else route(`M${ax},${ay} H${gx} V${by} H${bx}`, [gx, ay], [gx, by]);
			}
			const nextRow = rows[ri + 1];
			if (nextRow) {
				const maxBot = Math.max(...row.map(bottom));
				const minTop = Math.min(...nextRow.map(top));
				const gy = Math.round(maxBot + (minTop - maxBot) / 2);
				for (let i = 0; i < Math.min(row.length, nextRow.length); i++) {
					const ax = cx(row[i]),
						bx = cx(nextRow[i]);
					const aBot = bottom(row[i]),
						bTop = top(nextRow[i]);
					if (Math.abs(ax - bx) < 4) route(`M${ax},${aBot} V${bTop}`, [ax, gy]);
					else route(`M${ax},${aBot} V${gy} H${bx} V${bTop}`, [ax, gy], [bx, gy]);
				}
			}
		});

		const MARGIN = 140;
		const fMidY = cy(featured);
		const lX = left(featured) - MARGIN;
		const rX = right(featured) + MARGIN;
		const lastRow = rows[rows.length - 1];

		// --- Left spine + branch labels ---
		if (lX > 8) {
			route(`M${left(featured)},${fMidY} H${lX} V${cy(lastRow[0])}`, [lX, fMidY]);
			rows.forEach((r) => {
				const card = r[0];
				route(`M${lX},${cy(card)} H${left(card)}`, [lX, cy(card)]);
				const tags = card.idx != null ? (nodeTags[card.idx] ?? []) : [];
				labelH(lX, left(card), cy(card), tags);
			});
		}

		// --- Right spine + branch labels ---
		if (rX < svgW - 8) {
			const lastCard = lastRow[lastRow.length - 1];
			route(`M${right(featured)},${fMidY} H${rX} V${cy(lastCard)}`, [rX, fMidY]);
			rows.forEach((r) => {
				const c = r[r.length - 1];
				route(`M${right(c)},${cy(c)} H${rX}`, [rX, cy(c)]);
				const tags = c.idx != null ? (nodeTags[c.idx] ?? []) : [];
				labelH(right(c), rX, cy(c), tags);
			});
		}

		relays = newRelays;
		edgePaths = newPaths;
		edgeLabels = newLabels;
	}

	$effect(() => {
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
		class="diagram-svg"
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

		{#each edgeLabels as lbl}
			{@const tw = lbl.vertical ? 11 : lbl.text.length * 5 + 10}
			{@const th = lbl.vertical ? lbl.text.length * 7 + 4 : 11}
			<rect x={lbl.x - tw / 2} y={lbl.y - th / 2} width={tw} height={th} fill="white" rx="1" />
			<text
				x={lbl.x}
				y={lbl.y}
				style={lbl.vertical ? 'writing-mode: vertical-lr;' : ''}
				font-size="10"
				letter-spacing="0.6"
				fill="var(--color-base-500)"
				text-anchor="middle"
				dominant-baseline="middle">{lbl.text}</text
			>
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
		from { opacity: 0; }
		to   { opacity: 1; }
	}
</style>
