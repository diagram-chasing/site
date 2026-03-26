import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const DAYS = 7;
const HOURS = 24;

type Grid = number[][];

function emptyGrid(): Grid {
	return Array.from({ length: DAYS }, () => Array(HOURS).fill(0));
}

// In-memory for dev; Netlify Blobs for production
let memoryGrid: Grid = emptyGrid();

async function getStore() {
	if (typeof globalThis.Netlify !== 'undefined') {
		const { getStore } = await import('@netlify/blobs');
		return getStore('visits');
	}
	return null;
}

async function readGrid(): Promise<Grid> {
	const store = await getStore();
	if (store) {
		const data = await store.get('heatmap', { type: 'json' });
		if (data?.grid) return data.grid;
		return emptyGrid();
	}
	return memoryGrid;
}

async function writeGrid(grid: Grid) {
	const store = await getStore();
	if (store) {
		await store.setJSON('heatmap', { grid });
	} else {
		memoryGrid = grid;
	}
}

export const GET: RequestHandler = async () => {
	const grid = await readGrid();
	return json({ grid });
};

export const POST: RequestHandler = async () => {
	const now = new Date();
	const day = now.getUTCDay(); // 0=Sun
	const hour = now.getUTCHours();

	const grid = await readGrid();
	grid[day][hour]++;
	await writeGrid(grid);

	return new Response(null, { status: 204 });
};
