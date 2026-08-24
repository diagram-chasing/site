/**
 * refresh-galleries.mjs
 *
 * Manually-run pipeline that keeps the homepage headline thumbnails fresh.
 *
 * The headline carousels (`storyImages` / `toolImages` in src/routes/+page.svelte)
 * are $derived from each published post's `gallery` frontmatter. This script
 * regenerates those galleries by visiting each project's LIVE site, screenshotting
 * the largest on-page visual elements (svg / canvas / maps / charts) with heuristic
 * selectors, saving them to src/content/images/, and writing the paths back into the
 * post's frontmatter.
 *
 * Usage:
 *   node scripts/refresh-galleries.mjs           # only posts with `auto_gallery: true`
 *   node scripts/refresh-galleries.mjs --all     # every published post with a live URL
 *   node scripts/refresh-galleries.mjs <slug>... # only the named slug(s)
 *
 * Opt-in: a post is regenerated only if it sets `auto_gallery: true` in frontmatter,
 * OR --all is passed, OR its slug is named on the CLI. This protects hand-curated
 * galleries and keeps every run reviewable as a git diff.
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const POSTS_DIR = join(ROOT, 'src/content/posts');
const IMAGES_DIR = join(ROOT, 'src/content/images');
const REDIRECTS_FILE = join(ROOT, '_redirects');

// Production origin. Projects are captured from their canonical live route on
// this site (e.g. https://diagramchasing.fun/2026/mapping-clouds), which
// `_redirects` proxies to the upstream app — NOT the raw upstream Netlify app.
const SITE_ORIGIN = (process.env.SITE_ORIGIN ?? 'https://diagramchasing.fun').replace(/\/+$/, '');

// ---------------------------------------------------------------------------
// Config — the tuning knobs for heuristic capture.
// ---------------------------------------------------------------------------
const CONFIG = {
	count: 3, // images per project
	waitMs: 3500, // settle delay after load for D3 / canvas / map animations
	minWidth: 220,
	minHeight: 150,
	maxOverlap: 0.6, // reject a candidate overlapping an accepted one by more than this
	viewport: { width: 1440, height: 900 },
	deviceScaleFactor: 2,
	selectors: [
		'canvas',
		'svg',
		'.mapboxgl-canvas',
		'.maplibregl-canvas',
		'.leaflet-container',
		'[class*="chart" i]',
		'[class*="map" i]',
		'[class*="viz" i]',
		'[class*="graph" i]',
		'[class*="plot" i]'
	]
};

// Per-slug overrides for sites the generic heuristic handles poorly.
// e.g. 'time-use-explorer': { waitMs: 6000, count: 4, selectors: [...] }
const OVERRIDES = {};

// ---------------------------------------------------------------------------
// Live-URL resolution: `_redirects` (authoritative) then `base_url` fallback.
// ---------------------------------------------------------------------------
function parseRedirects() {
	const map = new Map();
	let text = '';
	try {
		text = readFileSync(REDIRECTS_FILE, 'utf8');
	} catch {
		return map;
	}
	for (const raw of text.split('\n')) {
		const line = raw.trim();
		if (!line || line.startsWith('#')) continue;
		const [source, target] = line.split(/\s+/);
		if (!source || !target) continue;
		const key = normalizePath(source);
		// Prefer the shortest (root) source for a given target root, so
		// `/2025/x` wins over `/2025/x/analysis`. Only set if unseen.
		if (!map.has(key)) map.set(key, normalizeTarget(target));
	}
	return map;
}

function normalizePath(p) {
	return p.replace(/\/\*$/, '').replace(/\/+$/, '');
}

function normalizeTarget(t) {
	return t.replace(/:splat$/, '').replace(/\/+$/, '');
}

function resolveUrl(post, redirects) {
	const slug = String(post.slug ?? '').trim();
	let key;
	if (slug.startsWith('/')) {
		key = normalizePath(slug);
	} else {
		// js-yaml parses ISO timestamps into Date objects, so read the year
		// off a Date when present and only fall back to string slicing.
		const d = post.date;
		const year = d instanceof Date ? String(d.getUTCFullYear()) : String(d ?? '').slice(0, 4);
		key = normalizePath(`/${year}/${slug}`);
	}
	// Prefer the canonical live route on the production site (proxied via
	// _redirects) over the raw upstream app or a possibly-stale base_url.
	if (redirects.has(key)) return `${SITE_ORIGIN}${key}`;
	const base = String(post.base_url ?? '').trim();
	if (base) return base.replace(/\/+$/, '');
	return null;
}

// ---------------------------------------------------------------------------
// Frontmatter: parse fields, and surgically replace just the `gallery:` block
// so the rest of the file (formatting, comments, key order) stays byte-identical.
// ---------------------------------------------------------------------------
function splitFrontmatter(raw) {
	const m = raw.match(/^(---\n)([\s\S]*?)(\n---\r?\n?)/);
	if (!m) return null;
	return {
		open: m[1],
		body: m[2],
		close: m[3],
		rest: raw.slice(m[0].length)
	};
}

function buildGalleryBlock(paths) {
	return 'gallery:\n' + paths.map((p) => `  - ${p}`).join('\n');
}

function setGallery(raw, paths) {
	const fm = splitFrontmatter(raw);
	if (!fm) throw new Error('no frontmatter block found');
	const block = buildGalleryBlock(paths);
	// Match `gallery:` line plus any following indented YAML list items.
	const galleryRe = /^gallery:[^\n]*(?:\n[ \t]+-[^\n]*)*/m;
	let body;
	if (galleryRe.test(fm.body)) {
		body = fm.body.replace(galleryRe, block);
	} else {
		body = fm.body.replace(/\n?$/, '\n' + block);
	}
	return fm.open + body + fm.close + fm.rest;
}

// ---------------------------------------------------------------------------
// Capture: pick the largest, non-overlapping visual elements and shoot each.
// ---------------------------------------------------------------------------
async function capture(page, url, opts) {
	await page.goto(url, { waitUntil: 'load', timeout: 45000 });
	await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
	await page.waitForTimeout(opts.waitMs);

	const chosen = await page.evaluate(
		({ selectors, minWidth, minHeight, maxOverlap, count }) => {
			const els = new Set();
			for (const sel of selectors) {
				try {
					document.querySelectorAll(sel).forEach((e) => els.add(e));
				} catch {
					/* invalid selector — skip */
				}
			}
			const cands = [];
			for (const el of els) {
				const r = el.getBoundingClientRect();
				const style = getComputedStyle(el);
				if (
					r.width < minWidth ||
					r.height < minHeight ||
					style.visibility === 'hidden' ||
					style.display === 'none' ||
					parseFloat(style.opacity) === 0
				)
					continue;
				const scrollX = window.scrollX || 0;
				const scrollY = window.scrollY || 0;
				cands.push({
					el,
					area: r.width * r.height,
					box: { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height }
				});
			}
			cands.sort((a, b) => b.area - a.area);

			const overlap = (a, b) => {
				const ix = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x));
				const iy = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
				const inter = ix * iy;
				const smaller = Math.min(a.w * a.h, b.w * b.h);
				return smaller > 0 ? inter / smaller : 0;
			};

			const accepted = [];
			for (const c of cands) {
				if (accepted.length >= count) break;
				if (accepted.some((a) => overlap(a.box, c.box) > maxOverlap)) continue;
				accepted.push(c);
			}
			accepted.forEach((c, i) => c.el.setAttribute('data-refresh-shot', String(i)));
			return accepted.length;
		},
		{
			selectors: opts.selectors,
			minWidth: opts.minWidth,
			minHeight: opts.minHeight,
			maxOverlap: opts.maxOverlap,
			count: opts.count
		}
	);

	const shots = [];
	for (let i = 0; i < chosen; i++) {
		const buf = await page
			.locator(`[data-refresh-shot="${i}"]`)
			.screenshot({ timeout: 15000 })
			.catch(() => null);
		if (buf) shots.push(buf);
	}

	// Fallback: nothing usable found — grab the viewport.
	if (shots.length === 0) {
		const buf = await page.screenshot().catch(() => null);
		if (buf) shots.push(buf);
	}
	return shots;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
	const args = process.argv.slice(2);
	const all = args.includes('--all');
	const namedSlugs = args.filter((a) => !a.startsWith('--'));

	const redirects = parseRedirects();
	mkdirSync(IMAGES_DIR, { recursive: true });

	const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));
	const posts = [];
	for (const file of files) {
		const path = join(POSTS_DIR, file);
		const raw = readFileSync(path, 'utf8');
		const fm = splitFrontmatter(raw);
		if (!fm) continue;
		let meta;
		try {
			meta = yaml.load(fm.body) ?? {};
		} catch (e) {
			console.warn(`⚠︎  ${file}: unparseable frontmatter — ${e.message}`);
			continue;
		}
		const fileSlug = file.replace(/\.md$/, '');
		posts.push({ file, path, raw, meta, fileSlug });
	}

	// Select which posts to process.
	const targets = posts.filter((p) => {
		if (!p.meta.published) return false;
		if (namedSlugs.length) return namedSlugs.includes(p.fileSlug) || namedSlugs.includes(p.meta.slug);
		if (all) return true;
		return p.meta.auto_gallery === true;
	});

	if (!targets.length) {
		console.log(
			'No matching posts. Set `auto_gallery: true` on a post, pass a slug, or use --all.'
		);
		return;
	}

	const browser = await chromium.launch();
	const context = await browser.newContext({
		viewport: CONFIG.viewport,
		deviceScaleFactor: CONFIG.deviceScaleFactor
	});

	const summary = [];
	try {
		for (const post of targets) {
			const slug = post.fileSlug;
			const opts = { ...CONFIG, ...(OVERRIDES[slug] ?? {}) };
			const url = opts.url ?? resolveUrl(post.meta, redirects);
			if (!url) {
				console.warn(`⚠︎  ${slug}: no live URL resolved — skipping`);
				summary.push(`skip  ${slug} (no URL)`);
				continue;
			}
			console.log(`→  ${slug}  ${url}`);
			const page = await context.newPage();
			let shots = [];
			try {
				shots = await capture(page, url, opts);
			} catch (e) {
				console.warn(`⚠︎  ${slug}: capture failed — ${e.message}`);
			} finally {
				await page.close();
			}
			if (!shots.length) {
				summary.push(`fail  ${slug} (no shots)`);
				continue;
			}

			// Clear previous auto images for this slug so reruns stay clean.
			for (const f of readdirSync(IMAGES_DIR)) {
				if (f.startsWith(`${slug}-auto-`)) rmSync(join(IMAGES_DIR, f));
			}

			const paths = [];
			shots.forEach((buf, i) => {
				const name = `${slug}-auto-${i + 1}.png`;
				writeFileSync(join(IMAGES_DIR, name), buf);
				paths.push(`/images/${name}`);
			});

			const updated = setGallery(post.raw, paths);
			writeFileSync(post.path, updated);
			console.log(`   ✓ ${paths.length} image(s) → gallery updated`);
			summary.push(`ok    ${slug} (${paths.length})`);
		}
	} finally {
		await browser.close();
	}

	console.log('\n— Summary —');
	summary.forEach((s) => console.log('  ' + s));
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
