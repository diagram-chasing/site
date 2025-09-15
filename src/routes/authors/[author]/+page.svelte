<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import Image from '$lib/components/ui/Image.svelte';

	export let data;
	$: ({ author, posts } = data);
</script>

<SEO
	title="{author.name} | Diagram Chasing"
	description="{author.description}"
	keywords="data viz, india data, data storytelling, gis, data blog, {author.name}"
	twitterHandle="@diagram_chasing"
	author={author.name}
	ogImage="sharecard.jpg"
/>
<div class="my-4 w-full">
	<main class="mx-auto max-w-2xl space-y-12 px-4">
		<!-- Author Header -->
		<div class="space-y-6">
			<div class="space-y-2">
				<p class="font-mono text-sm text-muted-foreground">
					$ ~/authors/{author.slug}
				</p>
				<h1 class="font-serif text-4xl font-bold tracking-tight text-foreground md:text-5xl">
					{author.name}
				</h1>
			</div>

			<p class="max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
				{author.description}
			</p>

			{#if author.links && Object.keys(author.links).length > 0}
				<div class="space-y-2">
					<p class="text-sm font-medium text-foreground">Connect:</p>
					<div class="flex flex-wrap gap-4">
						{#each Object.entries(author.links) as [platform, url]}
							{#if url}
								<a
									href={url}
									target="_blank"
									rel="noopener noreferrer"
									class="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
								>
									{platform}: {url.replace(/^https?:\/\//, '')}
								</a>
							{/if}
						{/each}
					</div>
				</div>
			{/if}
		</div>

		<!-- Projects Section -->
		{#if posts.length > 0}
			<div class="space-y-6">
				<div class="space-y-2">
					<p class="font-mono text-sm text-muted-foreground">
						$ ~/authors/{author.slug} ls
					</p>
					<h2 class="font-serif text-2xl font-bold tracking-tight text-foreground md:text-3xl">
						Projects
					</h2>
				</div>

				<div class="grid gap-6 md:gap-8">
					{#each posts
						.filter((post) => post.published)
						.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) as post}
						<a
							href="/{post.slug}"
							class="group block overflow-hidden rounded-lg border bg-card transition-all hover:bg-muted/50"
						>
							<div class="grid gap-0 md:grid-cols-3">
								<!-- Featured Image -->
								<div class="aspect-[4/3] overflow-hidden md:aspect-square">
									<Image
										src={post.image}
										alt={post.title}
										class="h-full w-full object-cover transition-transform group-hover:scale-105"
										loading="lazy"
										sizes="(max-width: 768px) 100vw, 33vw"
									/>
								</div>

								<!-- Project Info -->
								<div class="space-y-3 p-6 md:col-span-2">
									<div class="space-y-2">
										<div class="flex items-center gap-2 text-xs text-muted-foreground">
											<span>{new Date(post.date).getFullYear()}</span>
											<span>•</span>
											<span class="capitalize">{post.type}</span>
										</div>
										<h3
											class="font-serif text-xl font-bold text-foreground transition-colors group-hover:text-foreground/80"
										>
											{post.title}
										</h3>
									</div>

									<p class="text-sm leading-relaxed text-muted-foreground">
										{post.description}
									</p>
								</div>
							</div>
						</a>
					{/each}
				</div>
			</div>
		{:else}
			<div class="py-12 text-center">
				<p class="text-muted-foreground">No projects yet.</p>
			</div>
		{/if}
	</main>
</div>
