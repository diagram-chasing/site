import nlp from 'compromise';

async function generateDiagramData(targetUrl) {
  console.log(`Fetching markdown for: ${targetUrl}...`);

  const cleanUrl = targetUrl.replace(/^https?:\/\//, '');
  const response = await fetch(`https://defuddle.md/${cleanUrl}`);
  const rawText = await response.text();

  console.log('Cleaning markdown noise...');
  const cleanText = rawText
    .replace(/^---[\s\S]*?---/, '')
    .replace(/<svg[\s\S]*?<\/svg>/g, '')
    .replace(/\|.*\|/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/(http|https):\/\/[^\s]+/g, '');

  const doc = nlp(cleanText);

  // Added days of the week and email artifacts to the trash bin
  const stopWords = new Set([
    'data', 'people', 'number', 'time', 'part', 'way', 'days', 'hours',
    'commuters', 'commute', 'passengers', 'station', 'stations', 'line', 'lines',
    'percent', 'areas', 'locations', 'city', 'metro', 'week', 'toilet', 'routes',
    'the', 'each', 'over', 'later', 'this', 'that', 'there', 'which', 'what', 'who',
    'more', 'most', 'some', 'any', 'all', 'many', 'much', 'other', 'another',
    'these', 'those', 'such', 'only', 'just', 'even', 'also', 'very', 'too', 'well',
    'then', 'now', 'here', 'where', 'when', 'why', 'how', 'because', 'while',
    'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun', 'transaction', 'id', 'person'
  ]);

  const candidates = doc.nouns().not('#Pronoun').not('#Date').not('#Value').out('frequency');

  const cleanWord = (w) => {
    return w.toLowerCase()
      .replace(/^(the|a|an|each|every|some|all|many|much|this|that|those|these)\s+/i, '')
      .trim();
  };

  // 1. Gather a larger pool of valid candidates (Top 25)
  const pool = [];
  for (const c of candidates) {
    const w = cleanWord(c.normal);
    if (w.split(' ').length <= 2 && !stopWords.has(w) && !w.match(/[0-9]/) && w.length > 2 && !pool.includes(w)) {
      pool.push(w);
    }
    if (pool.length === 25) break;
  }

  console.log('Mapping network connectivity...');

  // 2. Map all possible edges within the pool
  const sentences = doc.sentences();
  const allPossibleEdges = [];

  for (let i = 0; i < pool.length; i++) {
    for (let j = i + 1; j < pool.length; j++) {
      const shared = sentences.if(pool[i]).if(pool[j]);
      if (shared.found) {
        const verbs = shared.eq(0).verbs().out('array');
        let verbLabel = verbs.length > 0 ? verbs[0].toLowerCase() : 'relates to';
        if (['is', 'are', 'was', 'were', 'have', 'has', 'be', 'been', 'had'].includes(verbLabel)) verbLabel = 'connects';

        allPossibleEdges.push({ source: pool[i], target: pool[j], label: verbLabel });
      }
    }
  }

  // 3. Filter the pool: Only keep nodes that have at least one edge!
  const connectedNodes = new Set();
  allPossibleEdges.forEach(e => {
    connectedNodes.add(e.source);
    connectedNodes.add(e.target);
  });

  // Take the top 9 most frequent from the *connected* nodes
  const finalNodes = pool.filter(n => connectedNodes.has(n)).slice(0, 9);

  console.log('\n--- Extracted Connected Nodes ---');
  console.log(finalNodes);

  // 4. Rebuild the edges using the final index numbers for Svelte
  const edgeDefs = [];
  const edgeLabels = [];
  const existingEdges = new Set();

  allPossibleEdges.forEach(edge => {
    const sIdx = finalNodes.indexOf(edge.source);
    const tIdx = finalNodes.indexOf(edge.target);

    // If both nodes survived the Top 9 cut
    if (sIdx !== -1 && tIdx !== -1) {
      const edgeKey = `${sIdx}-${tIdx}`;
      if (!existingEdges.has(edgeKey)) {
        existingEdges.add(edgeKey);
        edgeDefs.push([sIdx, tIdx]);
        edgeLabels.push({ source: sIdx, target: tIdx, label: edge.label });
      }
    }
  });

  const gridPositions = [
    [0, 0], [1, 0], [2, 0],
    [0, 1], [1, 1], [2, 1],
    [0, 2], [1, 2], [2, 2]
  ];

  const svelteData = {
    gridPositions: gridPositions.slice(0, finalNodes.length),
    edgeDefs: edgeDefs,
    nodeLabels: finalNodes,
    edgeLabels: edgeLabels
  };

  console.log('\n--- Svelte Component Data ---');
  console.log(JSON.stringify(svelteData, null, 2));

  return svelteData;
}

generateDiagramData('diagramchasing.fun/2025/how-bangalore-uses-the-metro');