#!/usr/bin/env node

/**
 * CLI Entrypoint for ML / DL Learning Roadmap
 * Allows starting the app on port 5100 from anywhere on the PC.
 */

import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

// Parse optional --port argument (defaults to 5100)
const portArgIdx = process.argv.indexOf('--port');
const defaultPort = 5100;
const PORT = (portArgIdx !== -1 && process.argv[portArgIdx + 1]) 
  ? parseInt(process.argv[portArgIdx + 1], 10) 
  : defaultPort;

async function start() {
  console.log('\n\x1b[1m\x1b[36m🧠 ML / DL Learning Roadmap\x1b[0m');
  console.log(`\x1b[90mStarting server from: ${projectRoot}\x1b[0m\n`);

  try {
    const server = await createServer({
      root: projectRoot,
      server: {
        port: PORT,
        open: true // automatically opens browser
      }
    });

    await server.listen();

    console.log(`\x1b[32m✓ Ready!\x1b[0m App running at: \x1b[1m\x1b[34mhttp://localhost:${PORT}/\x1b[0m`);
    console.log('\x1b[90mPress Ctrl+C anytime to stop the server.\x1b[0m\n');
  } catch (err) {
    console.error('\x1b[31mFailed to launch server:\x1b[0m', err.message);
    process.exit(1);
  }
}

start();
