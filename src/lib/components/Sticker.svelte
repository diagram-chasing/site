<script lang="ts">
	import type { Snippet } from 'svelte';

	// SVG sticker filter technique: https://codepen.io/jh3y/pen/OPJyVGb

	interface Props {
		children: Snippet;
		outlineColor?: string;
		radius?: number;
	}

	let { children, outlineColor = '#FFF', radius = 2 }: Props = $props();

	const uid = Math.random().toString(36).slice(2, 9);
	const id = `sticker-${uid}`;
</script>

<svg
	aria-hidden="true"
	style="position:absolute;width:0;height:0;overflow:hidden"
>
	<defs>
		<filter
			id={id}
			x="-25%"
			y="-25%"
			width="150%"
			height="150%"
			color-interpolation-filters="sRGB"
		>
			<!-- Dilate alpha for outline shape -->
			<feMorphology in="SourceAlpha" result="dilate" operator="dilate" radius={radius} />
			<!-- Flat outline color -->
			<feFlood flood-color={outlineColor} result="outlinecolor" />
			<!-- Turbulence for rough sticker edge -->
			<feTurbulence
				baseFrequency="0.015"
				seed="103"
				numOctaves="13"
				type="turbulence"
				result="turb"
			/>
			<feComposite in="turb" in2="dilate" operator="in" result="outline" />
			<!-- Desaturate turbulence so the edge noise is subtle, not rainbow -->
			<feColorMatrix in="outline" type="saturate" values="0.15" result="outline" />
			<feComposite in="outlinecolor" in2="dilate" operator="in" result="outlineflat" />
			<!-- Merge: flat outline → rough outline → source -->
			<feMerge result="merged">
				<feMergeNode in="outlineflat" />
				<feMergeNode in="outline" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>

			<!-- Drop shadow -->
			<feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity="0.25" />
		</filter>
	</defs>
</svg>

<span style="filter: url('#{id}'); display: inline-block; overflow: visible;">
	{@render children()}
</span>
