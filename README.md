# Panther Streams Windows v0.4.0 (verification preview)

This Windows Electron application preserves the Live TV, Movies and Series demonstration screens from v0.3.0.

## What's new

- Uses your existing Supabase `panther_get_services` RPC to list service names.
- The **Sign In** action now calls the existing `panther-web-auth` HTTPS Supabase Edge Function via Electron's main process.
- Never saves passwords, echoes tokens to the UI, or connects directly to provider HTTP endpoints.
- Displays clear errors for missing credentials, secure-provider configuration problems and unavailable services.
- Clears the password field after every attempt.

## Known limitations

The Edge Function currently refuses HTTP-only provider URLs. This build does **not** bypass that protection. Even a positive verification response does not yet open a customer catalogue; catalogue and playback are still demo-only. The function's success response shape should be verified before enabling real customer access. A Windows PC is needed for actual runtime testing.

## Building

Keep your existing `.github/workflows/build-windows.yml` file in the GitHub repository. Upload only the seven root files from this ZIP, commit to `main`, and check Actions. No workflow changes are required.

Local checks: `npm run check`. Windows CI: `npm run dist:win -- --publish never`.
