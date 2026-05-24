#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const target = path.join(root, '.agents', 'awesome-design-md');
const repo = 'https://github.com/VoltAgent/awesome-design-md.git';

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function dirSize(dir) {
  if (!existsSync(dir)) return 0;
  return statSync(dir).size;
}

async function cloneWithProgress() {
  console.log('awesome-design-md install');
  console.log(`Target: ${target}`);
  console.log('Estimated GitHub size: ~2 MB (shallow clone; full tree may be larger)\n');

  if (existsSync(path.join(target, '.git'))) {
    console.log('[skip] Repository already present. Pulling latest…');
    await runGit(['-C', target, 'pull', '--ff-only', '--progress']);
    reportDone();
    return;
  }

  await runGit([
    'clone',
    '--depth',
    '1',
    '--progress',
    repo,
    target,
  ]);
  reportDone();
}

function reportDone() {
  const size = dirSize(target);
  const designCount = existsSync(path.join(target, 'design-md'))
    ? 'design-md catalog ready'
    : 'clone finished';
  console.log(`\n[done] ${designCount}`);
  console.log(`Install path: ${target}`);
  if (size) console.log(`Root entry size hint: ${formatBytes(size)}`);
  console.log('\nUse DESIGN.md from design-md/<brand>/ or copy one into the project root.');
}

function runGit(args) {
  return new Promise((resolve, reject) => {
    const child = spawn('git', args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let lastLine = '';

    const onProgress = (chunk) => {
      const text = chunk.toString();
      process.stderr.write(text);
      const match = text.match(/Receiving objects:\s+(\d+)%\s*\((\d+)\/(\d+)\)|Resolving deltas:\s+(\d+)%\s*\((\d+)\/(\d+)\)/);
      if (match) {
        const pct = match[1] || match[4];
        const cur = match[2] || match[5];
        const total = match[3] || match[6];
        const line = `[progress] ${pct}% (${cur}/${total})`;
        if (line !== lastLine) {
          lastLine = line;
          process.stdout.write(`\r${line.padEnd(40)}`);
        }
      }
    };

    child.stderr.on('data', onProgress);
    child.stdout.on('data', onProgress);
    child.on('error', reject);
    child.on('close', (code) => {
      process.stdout.write('\n');
      if (code === 0) resolve();
      else reject(new Error(`git exited with code ${code}`));
    });
  });
}

cloneWithProgress().catch((error) => {
  console.error('\nInstall failed:', error.message);
  process.exit(1);
});
