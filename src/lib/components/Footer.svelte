<script lang="ts">
	import Logo from './Logo.svelte';

	const currentYear = new Date().getFullYear();

	const pageLinks = [
		{ name: 'Home', href: '/' },
		{ name: 'About', href: '/about' },
		{ name: 'Authors', href: '/authors' },
		{ name: 'Support', href: '/support' },
		{ name: 'Community', href: '/community' }
	];
</script>

<footer
	class="mx-0 mb-0 px-0 py-8 text-center text-lg leading-normal text-foreground antialiased max-sm:px-5 max-sm:py-10 max-sm:text-base"
>
	<!-- Logo -->
	<div class="mb-3.5 flex justify-center">
		<a
			href="/"
			aria-label="Diagram Chasing — home"
			class="inline-flex flex-col items-center gap-2 text-foreground no-underline"
		>
			<Logo size={100} />
			<!-- <span class="font-serimakf text-xl font-bold tracking-tight">Diagram Chasing</span> -->
		</a>
	</div>

	<!-- Nav links -->
	<ul class="mt-5 mb-[15px] flex list-none flex-wrap justify-center gap-x-4 gap-y-1 p-0">
		{#each pageLinks as link}
			<li class="my-0 p-0">
				<a
					href={link.href}
					class="text-base leading-[1.6em] text-foreground no-underline transition-colors hover:text-muted-foreground max-sm:text-sm"
					>{link.name}</a
				>
			</li>
		{/each}
	</ul>

	<!-- Copyright -->
	<p class="mt-2 p-0 text-base leading-normal text-muted-foreground">
		&copy; {currentYear} Diagram Chasing
	</p>

	<!-- Social/connect icon links -->
	<ul class="mt-3 list-none p-0 px-5 text-center">
		<li class="mx-1.5 my-0 inline-block p-0 leading-[1.6em]">
			<a
				href="/rss.xml"
				class="inline-flex size-10 items-center justify-center text-foreground no-underline opacity-80 transition-colors hover:text-muted-foreground active:scale-95"
				aria-label="RSS Feed"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					class="max-sm:h-5 max-sm:w-5"
					><path
						fill="currentColor"
						d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27zm0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93z"
					/></svg
				>
			</a>
		</li>
		<li class="mx-1.5 my-0 inline-block p-0 leading-[1.6em]">
			<a
				href="https://github.com/diagram-chasing"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex size-10 items-center justify-center text-foreground no-underline opacity-80 transition-colors hover:text-muted-foreground active:scale-95"
				aria-label="GitHub"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					class="max-sm:h-5 max-sm:w-5"
					><path
						fill="currentColor"
						d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
					/></svg
				>
			</a>
		</li>
		<li class="mx-1.5 my-0 inline-block p-0 leading-[1.6em]">
			<a
				href="https://www.instagram.com/diagramchasing"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex size-10 items-center justify-center text-foreground no-underline opacity-80 transition-colors hover:text-muted-foreground active:scale-95"
				aria-label="Instagram"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					class="max-sm:h-5 max-sm:w-5"
					><path
						fill="currentColor"
						d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"
					/></svg
				>
			</a>
		</li>
		<li class="mx-1.5 my-0 inline-block p-0 leading-[1.6em]">
			<a
				href="https://www.linkedin.com/company/diagram-chasing/"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex size-10 items-center justify-center text-foreground no-underline opacity-80 transition-colors hover:text-muted-foreground active:scale-95"
				aria-label="LinkedIn"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					class="max-sm:h-5 max-sm:w-5"
					><path
						fill="currentColor"
						d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"
					/></svg
				>
			</a>
		</li>
	</ul>
</footer>
