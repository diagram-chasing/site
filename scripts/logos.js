import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const NEWS_PATH = './src/content/news.md';
const OUTPUT_DIR = './src/lib/assets/logos';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function fetchLogos() {
  try {
    const fileContent = fs.readFileSync(NEWS_PATH, 'utf8');
    const match = fileContent.match(/---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return;

    const data = yaml.load(match[1]);
    const news = data.news || [];

    for (const item of news) {
      if (!item.url) continue;

      const domain = new URL(item.url).hostname.replace('www.', '');
      const filename = `${domain.replace(/\./g, '-')}.png`;
      const filePath = path.join(OUTPUT_DIR, filename);

      if (fs.existsSync(filePath)) {
        console.log(`skipping ${domain}, already exists.`);
        continue;
      }

      console.log(`fetching logo for ${domain}...`);
      const logoUrl = `https://logos.hunter.io/${domain}`;

      try {
        const response = await fetch(logoUrl);
        if (response.ok) {
          const buffer = await response.arrayBuffer();
          fs.writeFileSync(filePath, Buffer.from(buffer));
        }
      } catch (err) {
        console.error(`failed to download ${domain}:`, err.message);
      }
    }
  } catch (e) {
    console.error('Error processing logos:', e);
  }
}

fetchLogos();