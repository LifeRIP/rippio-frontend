import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { setTimeout } from 'node:timers/promises';

const front = fileURLToPath(new URL('../', import.meta.url));
const back = fileURLToPath(new URL('../../rippio-backend/', import.meta.url));
const children = [];
function start(args, cwd, env = {}) {
  const childEnv = { ...process.env, ...env };
  // Desktop shells can inherit this flag; its presence turns Cypress's Electron into Node.
  delete childEnv.ELECTRON_RUN_AS_NODE;
  const child = spawn(process.execPath, args, {
    cwd, env: childEnv, stdio: 'inherit', windowsHide: true,
  });
  children.push(child);
  return child;
}
async function ready(url, child) {
  for (let attempt = 0; attempt < 240; attempt++) {
    if (child.exitCode !== null) throw new Error(`Test server exited: ${url}`);
    try { if ((await fetch(url)).ok) return; } catch { /* wait for startup */ }
    await setTimeout(250);
  }
  throw new Error(`Test server did not start: ${url}`);
}
function stop() {
  for (const child of children.reverse()) {
    if (!child.pid || child.exitCode !== null) continue;
    if (process.platform === 'win32') {
      spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore', windowsHide: true });
    } else child.kill('SIGTERM');
  }
}
process.once('SIGINT', () => { stop(); process.exit(130); });
process.once('SIGTERM', () => { stop(); process.exit(143); });
try {
  const backend = start(['node_modules/nodemon/bin/nodemon.js', '--watch', 'test/helpers/chat-server.js', '--exec', 'node', 'test/helpers/chat-server.js'], back);
  await ready('http://127.0.0.1:4010/healthCheck', backend);
  const vite = start(['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5175', '--strictPort'], front, {
    VITE_FIREBASE_API_KEY: '', VITE_FIREBASE_PROJECT_ID: '', VITE_FIREBASE_STORAGE_BUCKET: '',
    VITE_API_URL: 'http://127.0.0.1:4010',
    VITE_API_URL_GRAPHQL: 'http://127.0.0.1:4010/graphql',
    VITE_API_URL_GRAPHQL_WS: 'ws://127.0.0.1:4010/graphql',
  });
  await ready('http://127.0.0.1:5175', vite);
  const cypress = start(['node_modules/cypress/bin/cypress', 'run', '--config', 'baseUrl=http://127.0.0.1:5175,video=false', ...process.argv.slice(2)], front);
  process.exitCode = await new Promise((resolve, reject) => {
    cypress.once('error', reject);
    cypress.once('exit', code => resolve(code ?? 1));
  });
} finally { stop(); }
