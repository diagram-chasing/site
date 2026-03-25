<script lang="ts">
	import type { Snippet } from 'svelte';

	// SVG sticker filter technique: https://codepen.io/jh3y/pen/OPJyVGb

	interface Props {
		children: Snippet;
		outlineColor?: string;
		radius?: number;
	}

	let { children, outlineColor = '#ffffff', radius = 2 }: Props = $props();

	const uid = Math.random().toString(36).slice(2, 9);
	const id = `sticker-${uid}`;
</script>

<!-- Hidden filter defs — zero-size so it doesn't affect layout -->
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
				baseFrequency="0.03"
				seed="1"
				numOctaves="3"
				type="turbulence"
				result="turb"
			/>
			<feComposite in="turb" in2="dilate" operator="in" result="outline" />
			<feComposite in="outlinecolor" in2="dilate" operator="in" result="outlineflat" />
			<!-- Merge: flat outline → rough outline → source -->
			<feMerge result="merged">
				<feMergeNode in="outlineflat" />
				<feMergeNode in="outline" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
			<!-- Specular lighting for glossy sheen -->
			<feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
			<feSpecularLighting
				result="lighting"
				in="blur"
				surfaceScale="5"
				specularConstant="0.5"
				specularExponent="120"
				lighting-color="#ffffff"
			>
				<fePointLight x="50" y="50" z="300" />
			</feSpecularLighting>
			<feComposite in="lighting" in2="SourceAlpha" operator="in" result="composite" />
			<feComposite
				in="merged"
				in2="composite"
				operator="arithmetic"
				k1="0"
				k2="1"
				k3="1"
				k4="0"
				result="litPaint"
			/>
			<!-- Drop shadow -->
			<feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.45" />
		</filter>
	</defs>
</svg>

<span style="filter: url('#{id}'); display: inline-block; overflow: visible;">
	{@render children()}
</span>
