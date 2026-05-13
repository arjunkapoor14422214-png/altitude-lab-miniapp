import { spawnSync } from 'node:child_process';

const owner = process.env.GITHUB_REPO_OWNER?.trim() || 'arjunkapoor14422214-png';
const repoName =
  process.env.GITHUB_REPO_NAME?.trim() || 'altitude-lab-miniapp';
const visibility =
  process.env.GITHUB_REPO_VISIBILITY?.trim().toLowerCase() || 'public';
const description =
  process.env.GITHUB_REPO_DESCRIPTION?.trim() ||
  'Telegram Mini App training simulator for crash-style rounds.';

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function runCapture(command, args) {
  const result = spawnSync(command, args, {
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf8',
    shell: process.platform === 'win32',
  });

  if (result.status !== 0) {
    const stderr = result.stderr?.trim();

    if (stderr) {
      console.error(stderr);
    }

    process.exit(result.status ?? 1);
  }

  return result.stdout.trim();
}

const authStatus = spawnSync('gh', ['auth', 'status'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  encoding: 'utf8',
  shell: process.platform === 'win32',
});

if (authStatus.status !== 0) {
  console.error(
    'GitHub CLI is not authenticated. Run "gh auth login -h github.com" and retry.',
  );
  process.exit(1);
}

const currentBranch = runCapture('git', ['branch', '--show-current']) || 'main';
const repoFullName = `${owner}/${repoName}`;
const visibilityFlag = visibility === 'private' ? '--private' : '--public';

run('gh', [
  'repo',
  'create',
  repoFullName,
  visibilityFlag,
  '--description',
  description,
  '--source',
  '.',
  '--remote',
  'origin',
  '--push',
]);

run('gh', ['repo', 'edit', repoFullName, '--default-branch', currentBranch]);

console.log(`Published to https://github.com/${repoFullName}`);
