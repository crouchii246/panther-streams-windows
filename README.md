# Panther Streams Windows — starter project

Desktop-first Panther Streams prototype built with Electron. It loads managed provider **names** from the existing Supabase `panther_get_services` RPC. Login and streams are intentionally **not** enabled yet. Do not enter real account passwords into the starter build.

## Build for Windows

1. Install Node.js 22 on Windows.
2. Open a terminal in this folder and run `npm install`.
3. Run `npm start` to preview the Windows app.
4. Run `npm run dist:win` to create an installer in the `dist` folder.

Alternatively push the complete folder contents to a GitHub repository and run the included **Build Panther Streams Windows installer** GitHub Actions workflow, which produces a downloadable `.exe` artifact.

## Security and integration notes

- Only the public Supabase publishable key is embedded. The renderer sees service labels, not provider URLs.
- The Electron renderer has Node integration disabled, context isolation, sandbox, a restrictive content security policy, and a minimal validated IPC surface.
- No provider passwords are sent, saved, or logged in this starter build.
- Adding Xtream HTTP login requires explicit security evaluation: an HTTP provider cannot securely receive credentials, even from a native app. Prefer HTTPS endpoints and licensed content.
- Implement real player and profile sync separately; current content pages are placeholders, not live streams.
- For public distribution, Windows code signing is recommended to reduce SmartScreen warnings.
