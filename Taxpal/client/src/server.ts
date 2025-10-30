// client/src/server.ts
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Optional: tiny health endpoint for SSR
 */
app.get('/__client_ssr_health', (_req, res) => {
  res.json({ ok: true, srv: 'angular-ssr', folder: browserDistFolder });
});

/**
 * SSR handler (all others fall through to Angular)
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the SSR server only when this file is the main entry.
 * Use CLIENT_PORT (defaults to 4000) to avoid colliding with the backend PORT=3000.
 */
if (isMainModule(import.meta.url)) {
  // Prefer CLIENT_PORT; do NOT reuse PORT to avoid clashing with the backend
  const port = Number(process.env['CLIENT_PORT'] || 4000);

  // Guard against accidental double-starts
  if (!(global as any).__ng_ssr_started) {
    const server = app.listen(port, (error?: unknown) => {
      if (error) throw error;
      (global as any).__ng_ssr_started = true;
      console.log(`Angular SSR listening on http://localhost:${port}`);
    });

    const shutdown = () => server.close(() => process.exit(0));
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } else {
    console.log('[ng-ssr] listen skipped (already started)');
  }
}

/**
 * Request handler exported for CLI / functions environments
 */
export const reqHandler = createNodeRequestHandler(app);
