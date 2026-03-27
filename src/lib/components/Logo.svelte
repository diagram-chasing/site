<script>
	import Logo from '$lib/assets/dc-logo.png';

	/**
	 * The width of the logo in pixels. Height will scale proportionally.
	 * @type {number}
	 * @default 130
	 */
	export let size = 130;

	const uid = Math.random().toString(36).slice(2, 11);

	const maskId = `mask-${uid}`;
	const vignetteMaskId = `vig-mask-${uid}`;
	const vignetteGradId = `vig-grad-${uid}`;
	const grainId = `grain-${uid}`;
	const pathTopId = `arc-top-${uid}`;
	const pathBottomId = `arc-bot-${uid}`;
</script>

<svg
	class="dc-logo"
	viewBox="0 0 200 200"
	xmlns="http://www.w3.org/2000/svg"
	style="width: var(--logo-size, {size}px); height: var(--logo-size, {size}px);"
>
	<defs>
		<path id={pathTopId} d="M 23 100 a 77 77 0 1 1 154 0" fill="none" />
		<path id={pathBottomId} d="M 23 100 a 77 77 0 0 0 154 0" fill="none" />

		<mask id={maskId}>
			<circle cx="100" cy="100" r="92" fill="white" />
		</mask>

		<radialGradient id={vignetteGradId} cx="50%" cy="50%" r="50%">
			<stop offset="95%" stop-color="white" stop-opacity="1" />
			<stop offset="100%" stop-color="white" stop-opacity="0" />
		</radialGradient>
		<mask id={vignetteMaskId}>
			<circle cx="100" cy="100" r="72" fill="url(#{vignetteGradId})" />
		</mask>

		<filter id={grainId} x="0" y="0" width="100%" height="100%">
			<feTurbulence
				type="fractalNoise"
				baseFrequency="0.75"
				numOctaves="3"
				stitchTiles="stitch"
				result="n"
			/>
			<feColorMatrix type="saturate" values="0" in="n" result="g" />
			<feComponentTransfer in="g" result="a">
				<feFuncA type="linear" slope="0.08" />
			</feComponentTransfer>
			<feBlend in="SourceGraphic" in2="a" mode="multiply" />
		</filter>
	</defs>

	<circle cx="100" cy="100" r="99" fill="#fcfcfc" />

	<circle cx="100" cy="100" r="97" fill="none" stroke="#050e29" stroke-width="3.5" />

	<circle cx="100" cy="100" r="93" fill="none" stroke="#050e29" stroke-width="0.7" opacity="1" />

	<circle cx="100" cy="100" r="73" fill="none" stroke="#050e29" stroke-width="2.2" />

	<image
		href={Logo}
		x="28"
		y="28"
		width="144"
		height="144"
		preserveAspectRatio="xMidYMid slice"
		mask="url(#{vignetteMaskId})"
		class="dc-logo__image"
	/>

	<g class="dc-logo__text" fill="#050e29">
		<text dy="-2">
			<textPath href="#{pathTopId}" startOffset="50%" text-anchor="middle" letter-spacing="2">
				DIAGRAM CHASING
			</textPath>
		</text>

		<text dy="11">
			<textPath href="#{pathBottomId}" startOffset="51%" text-anchor="middle" letter-spacing="2">
				EST. 2024
			</textPath>
		</text>
	</g>

	<circle cx="100" cy="100" r="97" fill="#f0ece4" opacity="0.06" filter="url(#{grainId})" />
</svg>

<style>
	.dc-logo {
		display: block;
		max-width: 100%;
		shape-rendering: geometricPrecision;
		transition: all 0.3s ease;
	}

	.dc-logo__image {
		mix-blend-mode: multiply;
	}

	.dc-logo__text {
		font-family: 'Atkinson Hyperlegible', 'Georgia', serif;
		font-size: 12px;
		font-weight: 900;
	}

	/*
   * Below ~48px the curved text becomes illegible mud.
   * A proper seal system drops text and relies on the iconic mark alone.
   */
	@container (max-width: 208px) {
		.dc-logo__text {
			opacity: 0;
		}
	}

	/* Fallback for environments without container queries */
	@media (max-width: 48px) {
		.dc-logo__text {
			opacity: 0;
		}
	}
</style>
