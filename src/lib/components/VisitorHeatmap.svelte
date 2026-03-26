<script lang="ts">
	import { scaleSequential } from 'd3-scale';
	import { interpolateRgb } from 'd3-interpolate';
	import { max } from 'd3-array';

	const DAYS = 7;
	const HOURS = 24;
	const CELL = 8;
	const GAP = 2;
	const W = HOURS * (CELL + GAP) - GAP;
	const H = DAYS * (CELL + GAP) - GAP;

	// grid[day][hour] — 7 days × 24 hours
	let grid: number[][] = $state(Array.from({ length: DAYS }, () => Array(HOURS).fill(0)));

	const colorScale = $derived.by(() => {
		const peak = max(grid.flat()) ?? 1;
		return scaleSequential()
			.domain([0, Math.max(peak, 1)])
			.interpolator(interpolateRgb('#E6E4D9', '#AF3029'));
	});

	$effect(() => {
		fetch('/api/visits')
			.then((r) => (r.ok ? r.json() : null))
			.then((data) => {
				if (data?.grid) grid = data.grid;
			})
			.catch(() => {});

		if (!sessionStorage.getItem('v')) {
			sessionStorage.setItem('v', '1');
			navigator.sendBeacon('/api/visits');
		}
	});
</script>

<svg viewBox="0 0 {W} {H}" class="heatmap" aria-hidden="true">
	{#each { length: DAYS } as _, day}
		{#each { length: HOURS } as _, hour}
			<rect
				x={hour * (CELL + GAP)}
				y={day * (CELL + GAP)}
				width={CELL}
				height={CELL}
				fill={colorScale(grid[day][hour])}
			/>
		{/each}
	{/each}
</svg>

<style>
	.heatmap {
		display: block;
		width: 100%;
		max-width: 320px;
	}

	rect {
		transition: fill 0.3s ease;
	}
</style>
