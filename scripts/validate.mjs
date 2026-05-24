import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const indexPath = path.join(root, 'index.html');
const html = readFileSync(indexPath, 'utf8');

const requiredSnippets = [
  'data-state="wrapped"',
  "root.dataset.state = 'peeling'",
  "root.dataset.state = 'open'",
  'prefers-reduced-motion: reduce',
  'is-unwrapping',
  '@keyframes unwrap-cover',
  '@keyframes film-top-lift',
  '@keyframes film-bottom-lift',
  '@keyframes seal-open',
  'class="seal"',
  'backdrop-filter',
  'UNICORN_SCENE_URL',
  'id="unicornScene"',
  'albumUnwrapper.addEventListener',
  "event.key === 'Enter'",
  "event.key === ' '",
  'audioPlayer.play()',
  'trackList.addEventListener'
];

const missing = requiredSnippets.filter((snippet) => !html.includes(snippet));

if (missing.length > 0) {
  throw new Error(`Missing required implementation details: ${missing.join(', ')}`);
}

const forbiddenSnippets = [
  'top-nav',
  'pull-tab',
  'rip-line',
  'Peel to open',
  'Plastic Wrap Material.jpeg',
  '--red',
  'var(--red'
];

const presentForbidden = forbiddenSnippets.filter((snippet) => html.includes(snippet));

if (presentForbidden.length > 0) {
  throw new Error(`Found removed visual elements: ${presentForbidden.join(', ')}`);
}

const localSources = [
  ...html.matchAll(/(?:src|cover): ['"]([^'"]+)['"]/g),
  ...html.matchAll(/<img[^>]+src="([^"]+)"/g)
].map((match) => match[1]).filter((source) => !source.startsWith('http') && !source.startsWith('data:'));

const unavailable = [...new Set(localSources)]
  .map((source) => ({ source, file: path.resolve(root, source) }))
  .filter(({ file }) => !existsSync(file));

const unavailableAudio = unavailable.filter(({ source }) => source.endsWith('.wav'));
const unavailableRequired = unavailable.filter(({ source }) => !source.endsWith('.wav'));

if (unavailableRequired.length > 0) {
  throw new Error(`Missing local assets: ${unavailableRequired.map(({ source }) => source).join(', ')}`);
}

if (unavailableAudio.length > 0) {
  console.warn(`Missing prototype audio assets: ${unavailableAudio.map(({ source }) => source).join(', ')}`);
}

const unicornPath = path.join(root, 'unicorn.html');
const unicornHtml = existsSync(unicornPath) ? readFileSync(unicornPath, 'utf8') : '';

const requiredSceneSnippets = [
  "from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js'",
  'new THREE.TorusGeometry',
  'new THREE.ShaderMaterial',
  'crossPattern',
  '#0081f7',
  'requestAnimationFrame(render)'
];

const missingSceneSnippets = requiredSceneSnippets.filter((snippet) => !unicornHtml.includes(snippet));

if (missingSceneSnippets.length > 0) {
  throw new Error(`unicorn.html is missing local WebGL scene details: ${missingSceneSnippets.join(', ')}`);
}

const allowedExternalUrls = new Set([
  'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js'
]);

const unexpectedExternalUrls = [...html.matchAll(/https?:\/\/[^'")\s]+/g)]
  .map((match) => match[0])
  .filter((url) => !allowedExternalUrls.has(url));

if (unexpectedExternalUrls.length > 0) {
  throw new Error(`Unexpected external network assets in index.html: ${unexpectedExternalUrls.join(', ')}`);
}

const unexpectedUnicornExternalUrls = [...unicornHtml.matchAll(/https?:\/\/[^'")\s]+/g)]
  .map((match) => match[0])
  .filter((url) => !allowedExternalUrls.has(url));

if (unexpectedUnicornExternalUrls.length > 0) {
  throw new Error(`Unexpected external network assets in unicorn.html: ${unexpectedUnicornExternalUrls.join(', ')}`);
}

console.log('radio-prototype validation passed');
