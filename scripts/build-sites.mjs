import { cp, mkdir, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sites = [
  { name: 'my-jalna', output: '' },
  { name: 'jalna-investment', output: 'investment' },
];

for (const site of sites) {
  const result = spawnSync('npm', ['run', 'build'], {
    cwd: join(root, site.name),
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const publishDirectory = join(root, 'dist');
await rm(publishDirectory, { recursive: true, force: true });

for (const site of sites) {
  const destination = join(publishDirectory, site.output);
  await mkdir(destination, { recursive: true });
  await cp(join(root, site.name, 'dist'), destination, { recursive: true });
}

console.log('Combined site ready: / for My Jalna and /investment for Jalna Investment.');
