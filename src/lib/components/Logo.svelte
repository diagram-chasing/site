<script>
	import Logo from '$lib/assets/dc-logo.png';

	/**
	 * The width of the logo in pixels. Height will scale proportionally.
	 * @type {number}
	 * @default 130
	 */
	export let size = 130;

	// Generate a unique ID for this specific component instance
	const uid = Math.random().toString(36).slice(2, 11);

	// Create unique references
	const maskId = `circle-mask-${uid}`;
	const pathTopId = `text-path-top-${uid}`;
	const pathBottomId = `text-path-bottom-${uid}`;
</script>

<svg
	class="logo-svg"
	viewBox="0 0 136 136"
	xmlns="http://www.w3.org/2000/svg"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	style="width: var(--logo-size, {size}px); height: var(--logo-size, {size}px);"
>
	<defs>
		<path id={pathTopId} d="M 16 68 a 52 52 0 1 1 104 0" fill="none" />

		<path id={pathBottomId} d="M 16 68 a 52 52 0 0 0 104 0" fill="none" />

		<mask id={maskId}>
			<circle cx="68" cy="68" r="46" fill="white" />
		</mask>
	</defs>

	<circle cx="68" cy="68" r="64" fill="white" />
	<circle cx="68" cy="68" r="64" fill="none" stroke="#050e29" stroke-width="2" />
	<circle cx="68" cy="68" r="48" fill="none" stroke="#050e29" stroke-width="2" />
	<circle cx="68" cy="68" r="46" fill="none" stroke="#050e29" stroke-width="1" />

	<image
		href={Logo}
		x="22"
		y="22"
		width="92"
		height="92"
		preserveAspectRatio="xMidYMid slice"
		mask="url(#{maskId})"
	/>

	<g
		font-family="'Atkinson Hyperlegible', sans-serif"
		font-size="11"
		font-weight="700"
		fill="#050e29"
	>
		<text dy="0">
			<textPath
				xlink:href="#{pathTopId}"
				startOffset="50%"
				text-anchor="middle"
				letter-spacing="1.5"
			>
				DIAGRAM CHASING
			</textPath>
		</text>

		<text dy="8">
			<textPath
				xlink:href="#{pathBottomId}"
				startOffset="50%"
				text-anchor="middle"
				letter-spacing="1.5"
			>
				• EST 2024 •
			</textPath>
		</text>
	</g>
</svg>

<style>
	.logo-svg {
		display: block;
		max-width: 100%;
		shape-rendering: geometricPrecision;
	}
</style>
