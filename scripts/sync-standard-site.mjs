/**
 * sync-standard-site.mjs
 *
 * Publishes this site to AT Protocol using the Standard.site lexicons
 * (https://standard.site) so Bluesky shows a "View publication" button on
 * links to diagramchasing.fun.
 *
 * What it does, in order:
 *   1. Logs in to the PDS with an app password.
 *   2. Ensures ONE `site.standard.publication` record exists for SITE_ORIGIN
 *      (creates it if missing, updates name/description if changed) and writes
 *      its AT-URI to src/content/standard-site.json and
 *      static/.well-known/site.standard.publication.
 *   3. Lists every `site.standard.document` record that belongs to that
 *      publication and cross-references it against published posts:
 *        - unknown path            -> record deleted
 *        - title/description/etc.  -> record updated
 *        - no record yet           -> record created
 *   4. Writes each document's AT-URI back into the post frontmatter as
 *      `atproto:` so the upstream project apps can emit
 *      <link rel="site.standard.document" href="at://…">.
 *
 * Usage:
 *   pnpm sync-standard-site            # sync
 *   pnpm sync-standard-site --dry-run  # show the plan, change nothing
 *
 * Env (see .env.example): ATPROTO_HANDLE, ATPROTO_APP_PASSWORD, SITE_ORIGIN?
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const POSTS_DIR = join(ROOT, 'src/content/posts');
const AUTHORS_DIR = join(ROOT, 'src/content/authors');
const STATE_FILE = join(ROOT, 'src/content/standard-site.json');
const WELL_KNOWN_FILE = join(ROOT, 'static/.well-known/site.standard.publication');

const DRY = process.argv.includes('--dry-run');
const SITE_ORIGIN = (process.env.SITE_ORIGIN ?? 'https://diagramchasing.fun').replace(/\/+$/, '');
const PUBLICATION = {
	name: 'Diagram Chasing',
	description: 'Data-driven works of various interests, shared once in a while'
};

const PUB_COLLECTION = 'site.standard.publication';
const DOC_COLLECTION = 'site.standard.document';

// ---------------------------------------------------------------------------
// Tiny helpers

loadDotEnv();

function loadDotEnv() {
	const p = join(ROOT, '.env');
	if (!existsSync(p)) return;
	for (const line of readFileSync(p, 'utf8').split('\n')) {
		const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
		if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
	}
}

function splitFrontmatter(raw) {
	const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
	if (!m) return null;
	return { body: m[1], rest: raw.slice(m[0].length), block: m[0] };
}

/** Set (or replace) a scalar key in a frontmatter block without re-serialising the whole thing. */
function setFrontmatterKey(raw, key, value) {
	const fm = splitFrontmatter(raw);
	if (!fm) throw new Error('no frontmatter block found');
	const line = `${key}: ${value}`;
	const re = new RegExp(`^${key}:.*$`, 'm');
	const body = re.test(fm.body) ? fm.body.replace(re, line) : `${fm.body}\n${line}`;
	return `---\n${body}\n---\n${fm.rest}`;
}

// TID: 13-char base32-sortable timestamp id, as required by `key: tid` records.
const B32 = '234567abcdefghijklmnopqrstuvwxyz';
let lastTid = 0n;
function tid() {
	let t = BigInt(Date.now()) * 1000n;
	if (t <= lastTid) t = lastTid + 1n;
	lastTid = t;
	const v = (t << 10n) | BigInt(Math.floor(Math.random() * 1024));
	let s = '';
	for (let i = 12; i >= 0; i--) s += B32[Number((v >> BigInt(i * 5)) & 31n)];
	return s;
}

function samePayload(a, b) {
	return JSON.stringify(sortKeys(a)) === JSON.stringify(sortKeys(b));
}
function sortKeys(o) {
	if (Array.isArray(o)) return o.map(sortKeys);
	if (o && typeof o === 'object') return Object.fromEntries(Object.keys(o).sort().map((k) => [k, sortKeys(o[k])]));
	return o;
}

// ---------------------------------------------------------------------------
// Minimal atproto client (fetch only; no third-party packages)

async function xrpc(base, nsid, { method = 'GET', params, body, token } = {}) {
	const url = new URL(`/xrpc/${nsid}`, base);
	for (const [k, v] of Object.entries(params ?? {})) if (v !== undefined) url.searchParams.set(k, v);
	const res = await fetch(url, {
		method,
		headers: {
			...(body ? { 'content-type': 'application/json' } : {}),
			...(token ? { authorization: `Bearer ${token}` } : {})
		},
		body: body ? JSON.stringify(body) : undefined
	});
	const text = await res.text();
	const json = text ? JSON.parse(text) : {};
	if (!res.ok) throw new Error(`${nsid} ${res.status}: ${json.message ?? json.error ?? text}`);
	return json;
}

async function resolveHandle(handle) {
	const { did } = await xrpc('https://public.api.bsky.app', 'com.atproto.identity.resolveHandle', {
		params: { handle }
	});
	return did;
}

async function pdsFor(did) {
	const url = did.startsWith('did:web:')
		? `https://${did.slice(8)}/.well-known/did.json`
		: `https://plc.directory/${did}`;
	const doc = await (await fetch(url)).json();
	const svc = doc.service?.find((s) => s.id === '#atproto_pds');
	if (!svc) throw new Error(`no #atproto_pds service in DID document for ${did}`);
	return svc.serviceEndpoint;
}

async function login() {
	const handle = process.env.ATPROTO_HANDLE;
	const password = process.env.ATPROTO_APP_PASSWORD;
	if (!handle || !password) throw new Error('Set ATPROTO_HANDLE and ATPROTO_APP_PASSWORD (see .env.example)');
	const did = handle.startsWith('did:') ? handle : await resolveHandle(handle);
	const pds = process.env.ATPROTO_PDS ?? (await pdsFor(did));
	const session = await xrpc(pds, 'com.atproto.server.createSession', {
		method: 'POST',
		body: { identifier: did, password }
	});
	const token = session.accessJwt;
	const repo = session.did;

	const call = (nsid, opts) => xrpc(pds, nsid, { ...opts, token });
	return {
		did: repo,
		async listRecords(collection) {
			const out = [];
			let cursor;
			do {
				const page = await call('com.atproto.repo.listRecords', {
					params: { repo, collection, limit: 100, cursor }
				});
				out.push(...page.records);
				cursor = page.cursor;
			} while (cursor);
			return out;
		},
		createRecord: (collection, record, rkey = tid()) =>
			call('com.atproto.repo.createRecord', { method: 'POST', body: { repo, collection, rkey, record } }),
		putRecord: (collection, rkey, record) =>
			call('com.atproto.repo.putRecord', { method: 'POST', body: { repo, collection, rkey, record } }),
		deleteRecord: (collection, rkey) =>
			call('com.atproto.repo.deleteRecord', { method: 'POST', body: { repo, collection, rkey } })
	};
}

const rkeyOf = (uri) => uri.split('/').pop();

// ---------------------------------------------------------------------------
// Content

function readAuthors() {
	const authors = {};
	for (const file of readdirSync(AUTHORS_DIR).filter((f) => f.endsWith('.md'))) {
		const fm = splitFrontmatter(readFileSync(join(AUTHORS_DIR, file), 'utf8'));
		if (!fm) continue;
		const meta = yaml.load(fm.body) ?? {};
		authors[meta.slug ?? file.replace(/\.md$/, '')] = meta;
	}
	return authors;
}

function readPosts() {
	const posts = [];
	for (const file of readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'))) {
		const abs = join(POSTS_DIR, file);
		const raw = readFileSync(abs, 'utf8');
		const fm = splitFrontmatter(raw);
		if (!fm) continue;
		let meta;
		try {
			meta = yaml.load(fm.body) ?? {};
		} catch (e) {
			console.warn(`⚠︎  ${file}: unparseable frontmatter — ${e.message}`);
			continue;
		}
		if (!meta.published) continue;
		// External posts live on another domain; they are not documents of this publication.
		if (meta.external) continue;
		// Mirror Card.svelte / refresh-galleries: a slug starting with "/" is already a path.
		const slug = String(meta.slug ?? file.replace(/\.md$/, '')).trim();
		const year = new Date(meta.date).getUTCFullYear();
		const path = (slug.startsWith('/') ? slug : `/${year}/${slug}`).replace(/\/+$/, '');
		posts.push({ file: abs, raw, slug, meta, path });
	}
	return posts;
}

/** Resolve author bluesky profiles -> DIDs, cached per run. */
async function contributorsFor(post, authors, cache) {
	const out = [];
	for (const slug of post.meta.authors ?? []) {
		const a = authors[slug];
		if (!a) continue;
		const bsky = a.links?.bluesky?.match(/bsky\.app\/profile\/([^/?#]+)/)?.[1];
		if (!bsky) continue;
		if (!(slug in cache)) {
			try {
				cache[slug] = bsky.startsWith('did:') ? bsky : await resolveHandle(bsky);
			} catch {
				cache[slug] = null;
			}
		}
		if (cache[slug]) out.push({ did: cache[slug], displayName: a.name, role: 'author' });
	}
	return out;
}

function documentRecord(post, pubUri, contributors) {
	const m = post.meta;
	const rec = {
		$type: DOC_COLLECTION,
		site: pubUri,
		path: post.path,
		title: String(m.title),
		publishedAt: new Date(m.date).toISOString()
	};
	if (m.description) rec.description = String(m.description);
	if (Array.isArray(m.tags) && m.tags.length) rec.tags = m.tags.map(String);
	if (contributors.length) rec.contributors = contributors;
	return rec;
}

// ---------------------------------------------------------------------------

async function main() {
	console.log(`${DRY ? '[dry-run] ' : ''}syncing ${SITE_ORIGIN} → standard.site`);
	const repo = await login();

	// 1. Publication -----------------------------------------------------------
	const pubRecord = { $type: PUB_COLLECTION, url: SITE_ORIGIN, ...PUBLICATION };
	const pubs = await repo.listRecords(PUB_COLLECTION);
	let pub = pubs.find((r) => r.value.url?.replace(/\/+$/, '') === SITE_ORIGIN);
	if (!pub) {
		console.log(`+ publication  ${SITE_ORIGIN}`);
		pub = DRY ? { uri: `at://${repo.did}/${PUB_COLLECTION}/dry-run` } : await repo.createRecord(PUB_COLLECTION, pubRecord);
	} else {
		const { icon, ...comparable } = pub.value; // never clobber a hand-uploaded icon
		if (!samePayload(comparable, pubRecord)) {
			console.log(`~ publication  ${SITE_ORIGIN}`);
			if (!DRY) await repo.putRecord(PUB_COLLECTION, rkeyOf(pub.uri), { ...pubRecord, ...(icon ? { icon } : {}) });
		}
	}
	const pubUri = pub.uri;

	// 2. Documents ----------------------------------------------------------------
	const authors = readAuthors();
	const posts = readPosts();
	const didCache = {};

	const existing = (await repo.listRecords(DOC_COLLECTION)).filter((r) => r.value.site === pubUri);
	const byPath = new Map(existing.map((r) => [r.value.path, r]));
	const known = new Set(posts.map((p) => p.path));

	for (const r of existing) {
		if (known.has(r.value.path)) continue;
		console.log(`- document     ${r.value.path}`);
		if (!DRY) await repo.deleteRecord(DOC_COLLECTION, rkeyOf(r.uri));
	}

	for (const post of posts) {
		const contributors = await contributorsFor(post, authors, didCache);
		const record = documentRecord(post, pubUri, contributors);
		const current = byPath.get(post.path);
		let uri = current?.uri;

		if (!current) {
			console.log(`+ document     ${post.path}`);
			if (!DRY) uri = (await repo.createRecord(DOC_COLLECTION, record)).uri;
		} else {
			const { bskyPostRef, coverImage, ...comparable } = current.value; // preserve fields we don't manage
			if (!samePayload(comparable, record)) {
				console.log(`~ document     ${post.path}`);
				if (!DRY)
					await repo.putRecord(DOC_COLLECTION, rkeyOf(current.uri), {
						...record,
						...(bskyPostRef ? { bskyPostRef } : {}),
						...(coverImage ? { coverImage } : {})
					});
			} else {
				console.log(`= document     ${post.path}`);
			}
		}

		if (uri && post.meta.atproto !== uri && !DRY) {
			writeFileSync(post.file, setFrontmatterKey(post.raw, 'atproto', uri));
		}
	}

	// 3. Site-side pointers -----------------------------------------------------------
	if (!DRY) {
		mkdirSync(dirname(WELL_KNOWN_FILE), { recursive: true });
		writeFileSync(WELL_KNOWN_FILE, pubUri + '\n');
		writeFileSync(STATE_FILE, JSON.stringify({ publication: pubUri, did: repo.did }, null, 2) + '\n');
	}
	console.log(`\npublication: ${pubUri}\n${DRY ? 'nothing written.' : 'done — review the git diff and commit.'}`);
}

main().catch((e) => {
	console.error(`✖ ${e.message}`);
	process.exit(1);
});
