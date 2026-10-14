import { execSync } from 'node:child_process';
import pkg from '../../package.json';

/**
 * Real build metadata for the footer, the hero's infrastructure layer and
 * `:system`. Every technical annotation on the site must be real data
 * (IMPLEMENTATION_PLAN §7.2), so nothing here is hard-coded.
 */
function git(cmd: string): string | null {
  try {
    return execSync(`git ${cmd}`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() || null;
  } catch {
    return null;
  }
}

const now = new Date();
const sha = git('rev-parse --short HEAD');
const dirty = sha ? Boolean(git('status --porcelain')) : false;
const branch = git('rev-parse --abbrev-ref HEAD');

export const buildInfo = {
  sha: sha ?? 'local',
  dirty,
  branch: branch ?? 'local',
  date: now.toISOString().slice(0, 10),
  stamp: `${now.getUTCFullYear()}.${String(now.getUTCMonth() + 1).padStart(2, '0')}`,
  time: now.toISOString().slice(11, 16) + ' UTC',
  astro: (pkg.dependencies.astro ?? '').replace(/^[^\d]*/, ''),
  react: (pkg.dependencies.react ?? '').replace(/^[^\d]*/, ''),
  host: process.env.CF_PAGES ? 'Cloudflare Pages' : process.env.VERCEL ? 'Vercel' : process.env.NETLIFY ? 'Netlify' : 'local build',
};

export type BuildInfo = typeof buildInfo;
