# Panther Streams Windows v0.5.0 — test build

Built on v0.4.0. This update is intended for the first Windows PC installation and connectivity test.

## Added

- **System Test** page from the sidebar, with local app/version info, Panther Admin service reachability, HTTPS login-function reachability (using invalid empty credentials), and explicit real-playback-not-ready status.
- Tests avoid sending actual IPTV passwords, listing private service URLs, or storing secrets.
- Existing Live TV, Movies and Series demonstration UI and the Supabase verification login from v0.4.0 are preserved.

## Limitations

- This is **not a fully functional IPTV player**. Real catalogue, streaming and playback are not enabled.
- HTTP-only IPTV provider URLs remain blocked by the secure login function. A responding login function does not mean an account is authenticated.
- No Windows runtime test was performed here. Verify using the Windows PC: install, launch, Explore demo, browse Live TV/Movies/Series, use System Test, and verify the login error messages without sharing passwords.
- Please only access content and streams for which you have permission.

## GitHub install/build

Upload the seven files in this archive to the root of your existing `panther-streams-windows` repository, replacing identical filenames. **Do not delete or overwrite `.github/workflows/build-windows.yml`.** Commit to `main`; your existing Actions workflow builds an installer named `Panther-Streams-Setup-0.5.0.exe`. Workflow command should remain `npm run dist:win -- --publish never`.

Run `npm run check` for JavaScript syntax checks. This project uses `electron` and `electron-builder`.
