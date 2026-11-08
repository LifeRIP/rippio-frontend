// Run explicitly to refresh the bundled reference photos; never needed at runtime.
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const directory = new URL('../public/media/food/', import.meta.url);
const photos = {
    pizza: '1513104890138-7c749659a591', burger: '1568901346375-23c9450c58cd',
    sushi: '1579871494447-9811cf80d66c', salad: '1512621776951-a57141f2eefd',
    rice: '1512058564366-18510be2db19', pasta: '1551183053-bf91a1d81141',
    fish: '1467003909585-2f8a72700288', sandwich: '1539252554453-80ab65ce3586',
    chicken: '1567620832903-9fc6debc209f', dessert: '1551024506-0bccd828d307',
    drink: '1544145945-f90425340c7e', restaurant: '1517248135467-4c7edcad34c4',
    table: '1414235077428-338989a2e8c0', city: '1480714378408-67cf0d13bc1b',
};
await fs.mkdir(directory, { recursive: true });
const entries = Object.entries(photos);
const sources = [];
// Limit simultaneous downloads and verify that every response is an actual WebP.
for (let i = 0; i < entries.length; i += 3) {
    const batch = await Promise.all(entries.slice(i, i + 3).map(async ([name, id]) => {
        const source = `https://images.unsplash.com/photo-${id}`;
        const url = `${source}?fit=crop&w=${['city', 'table', 'restaurant'].includes(name) ? 1600 : 1000}&q=80&fm=webp`;
        const response = await fetch(url, { signal: AbortSignal.timeout(60000) });
        if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
        const bytes = Buffer.from(await response.arrayBuffer());
        if (bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WEBP') {
            throw new Error(`${name}: expected WebP image`);
        }
        await fs.writeFile(new URL(`${name}.webp`, directory), bytes);
        console.log(`${name}.webp: ${(bytes.length / 1024).toFixed(0)} KB`);
        return { file: `food/${name}.webp`, source, download: url, license: 'https://unsplash.com/license' };
    }));
    sources.push(...batch);
}
await fs.writeFile(new URL('../sources.json', directory), JSON.stringify(sources, null, 2) + '\n');
console.log(`Saved ${sources.length} reference photos to ${fileURLToPath(directory)}`);
