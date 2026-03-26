import nlp from 'compromise';
import { postsAPI } from '$lib/utils/posts';
import type { PageServerLoad } from './$types';

const STOP = new Set([
	// generic nouns
	'data', 'people', 'number', 'time', 'part', 'way', 'thing', 'total', 'source',
	'figure', 'table', 'image', 'chart', 'section', 'note', 'page', 'example',
	'result', 'order', 'case', 'end', 'set', 'lot', 'use', 'level', 'type', 'area',
	'side', 'point', 'fact', 'look', 'value', 'row', 'person', 'group', 'information',
	'analysis', 'application', 'status', 'wing', 'id', 'transaction', 'bar', 'column',
	'text', 'link', 'view', 'top', 'bottom', 'share', 'change', 'comparison',
	'exploration', 'impact', 'opening', 'rest', 'term', 'count', 'map', 'pair',
	// pronouns
	'you', 'we', 'they', 'it', 'he', 'she', 'one', 'someone', 'everyone',
	// temporal
	'week', 'month', 'day', 'year', 'hour', 'minute', 'date',
	// too generic
	'city', 'town', 'state', 'country', 'place', 'road', 'name',
	// days
	'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun',
	'weekday', 'weekdays', 'weekend', 'weekends',
	// geo
	'bangalore', 'bengaluru', 'india', 'karnataka', 'majestic', 'namma',
	// abbreviations
	'bmrcl', 'rti',
	// transit-generic single words
	'station', 'stations', 'line', 'lines', 'stop', 'stops',
	'commuters', 'commuter', 'passengers', 'passenger',
	'percent', 'locations', 'direction',
	// place indicators
	'hospital', 'park', 'nagar', 'halli', 'pura', 'puram', 'gudi',
	'sai', 'sathya', 'sri', 'cross', 'layout', 'extension',
	// phrase fragments / abbreviations
	'hand', 'other', 'much', 'another', 'bus', 'rate', 'form', 'size', 'kind',
	'ceg', 'avg', 'max', 'min', 'lakh', 'crore'
]);

function clean(raw: string): string {
	return raw
		.trim()
		.replace(/[.,;:!?()"]+$/g, '')
		.replace(/^[.,;:!?()"]+/g, '')
		.replace(/^(the|a|an)\s+/i, '')
		.trim();
}

function extractTerms(rawMarkdown: string): string[] {
	const terms: string[] = [];
	const seen = new Set<string>();

	// Checks if a word already appears in an existing term
	function hasWordOverlap(key: string): boolean {
		const newWords = key.split(' ');
		for (const existing of seen) {
			const exWords = existing.split(' ');
			if (newWords.some((w) => exWords.includes(w))) return true;
		}
		return false;
	}

	function add(raw: string, strict: boolean): boolean {
		const term = clean(raw);
		const key = term.toLowerCase();
		if (!term || key.length <= 2 || seen.has(key)) return false;
		if (/[0-9]/.test(key)) return false;

		const words = key.split(' ');
		if (words.length > 2) return false;

		// Single words: check stop list
		if (words.length === 1 && STOP.has(key)) return false;
		// Multi-word: check exact phrase
		if (STOP.has(key)) return false;

		// Sub-word dedup: skip if this single word is inside an existing multi-word term
		if (words.length === 1) {
			for (const existing of seen) {
				if (existing.split(' ').includes(key)) return false;
			}
		}

		// Strict mode (body terms): reject if any word is stopped or overlaps existing
		if (strict) {
			if (words.some((w) => STOP.has(w))) return false;
			if (hasWordOverlap(key)) return false;
		}

		seen.add(key);
		terms.push(term);
		return true;
	}

	// --- Phase 1: YAML description (editorially curated, most abstract) ---
	const descMatch = rawMarkdown.match(/description:\s*"([^"]+)"/);
	if (descMatch) {
		const dDoc = nlp(descMatch[1]);
		// 2-word noun phrases first
		for (const p of dDoc.match('(#Adjective|#Noun) #Noun').out('array') as string[]) {
			add(p, false);
		}
		// Then single common nouns
		for (const n of dDoc.match('#Noun').not('#ProperNoun').out('array') as string[]) {
			add(n, false);
		}
	}

	if (terms.length >= 9) return terms.slice(0, 9);

	// --- Phase 2: Body text — 2-word common noun phrases by frequency ---
	const body = rawMarkdown
		.replace(/^---[\s\S]*?---/, '')
		.replace(/<svg[\s\S]*?<\/svg>/gi, '')
		.replace(/\|[^\n]*\|/g, '')
		.replace(/```[\s\S]*?```/g, '')
		.replace(/(https?):\/\/[^\s]+/g, '')
		.replace(/<[^>]+>/g, '')
		.replace(/[#*`~_>|]/g, '')
		.trim();

	const bodyDoc = nlp(body);
	const bodyPhrases = bodyDoc
		.match('(#Adjective|#Noun) #Noun')
		.not('#ProperNoun')
		.out('frequency') as { normal: string; count: number }[];

	for (const { normal, count } of bodyPhrases) {
		if (count < 2 || terms.length >= 9) break;
		add(normal, true);
	}

	// --- Phase 3: Frequent single common nouns from body ---
	if (terms.length < 9) {
		const bodyNouns = bodyDoc
			.match('#Noun')
			.not('#ProperNoun')
			.out('frequency') as { normal: string; count: number }[];

		for (const { normal, count } of bodyNouns) {
			if (count < 5 || terms.length >= 9) break;
			add(normal, true);
		}
	}

	return terms.slice(0, 9);
}

export const load: PageServerLoad = async ({ fetch }) => {
	let diagramTerms: string[] = [];

	try {
		const posts = await postsAPI.getPublishedPosts();
		const latest = posts.find((p) => !p.external && p.slug);

		if (latest?.slug) {
			const year = new Date(latest.date).getFullYear();
			const res = await fetch(
				`https://defuddle.md/diagramchasing.fun/${year}/${latest.slug}`,
				{ signal: AbortSignal.timeout(8000) }
			);
			if (res.ok) {
				diagramTerms = extractTerms(await res.text());
			}
		}
	} catch {
		// silent fallback — diagram renders with empty labels
	}

	return { diagramTerms };
};
