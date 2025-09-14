<script>
	// Import the logo image as specified
	import Logo from '$lib/assets/dc-logo.png';

	/**
	 * The width of the logo in pixels. Height will scale proportionally.
	 * @type {number}
	 * @default 500
	 */
	export let size = 130;
</script>

<!-- A single SVG element to create the entire logo -->
<svg
	class="logo-svg"
	viewBox="0 0 132 132"
	xmlns="http://www.w3.org/2000/svg"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	style={`width: ${size}px;`}
>
	<!-- Outer border rings -->
	<circle cx="66" cy="66" r="65" fill="none" stroke="#000000" stroke-width="4" />
	<circle cx="66" cy="66" r="65" fill="none" stroke="rgb(0,26,98,0.4)" stroke-width="4" />

	<!-- Inner border rings -->
	<circle cx="66" cy="66" r="48" fill="none" stroke="#000000" stroke-width="1" />
	<circle cx="66" cy="66" r="46" fill="none" stroke="#000000" stroke-width="1" />

	<defs>
		<!-- A circular path to place the text on -->
		<path id="text-path" d="M66 126A60 60 0 1 0 66 6a60 60 0 0 0 0 120" fill="none" />
		<!-- A circular clip path to make the image round -->
		<clipPath id="circle-clip">
			<circle cx="66" cy="66" r="46" />
		</clipPath>
	</defs>

	<!-- The image, centered, clipped, and using the imported Logo variable -->
	<image href={Logo} x="20" y="20" width="92" height="92" clip-path="url(#circle-clip)" />

	<!-- The curved text element -->
	<text>
		<textPath
			xlink:href="#text-path"
			font-family="'Atkinson Hyperlegible', sans-serif"
			font-size="10"
			font-weight="600"
			fill="#000000"
			letter-spacing="4"
			startOffset="50%"
			text-anchor="middle"
		>
			• THE DIAGRAM CHASERS OF BLR • EST 2024
		</textPath>
	</text>
</svg>

<style>
	/* Style the SVG to be responsive and scale proportionally */
	.logo-svg {
		height: auto;
		display: block; /* Removes extra space beneath the element */
		max-width: 100%; /* Ensures it doesn't overflow its container */
	}
</style>
