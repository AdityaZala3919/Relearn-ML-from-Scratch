import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const progressFilePath = path.resolve(__dirname, 'data', 'progress.json');

export default defineConfig({
  base: './',
  server: {
    port: 5100,
    open: true
  },
  plugins: [
    {
      name: 'local-file-storage-middleware',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/api/progress') {
            if (req.method === 'GET') {
              try {
                if (fs.existsSync(progressFilePath)) {
                  const content = fs.readFileSync(progressFilePath, 'utf-8');
                  res.setHeader('Content-Type', 'application/json');
                  res.end(content);
                  return;
                }
              } catch (e) {
                console.error('Error reading progress.json:', e);
              }
              res.setHeader('Content-Type', 'application/json');
              res.end('{}');
              return;
            }

            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => { body += chunk; });
              req.on('end', () => {
                try {
                  const dataDir = path.dirname(progressFilePath);
                  if (!fs.existsSync(dataDir)) {
                    fs.mkdirSync(dataDir, { recursive: true });
                  }
                  // Pretty print JSON with 2 spaces for readable git diffs
                  const parsed = JSON.parse(body);
                  parsed.updatedAt = new Date().toISOString();
                  fs.writeFileSync(progressFilePath, JSON.stringify(parsed, null, 2), 'utf-8');
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: true, savedAt: parsed.updatedAt }));
                } catch (err) {
                  console.error('Error saving progress.json:', err);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: err.message }));
                }
              });
              return;
            }
          }
          next();
        });
      }
    }
  ]
});
