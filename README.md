# Panther Streams Windows v0.6.0 — Provider readiness test

This is an incremental update to v0.5.0. It **does not implement live IPTV login or playback**.

## New
- System Test → **Check provider configuration**: reports whether each Panther Admin service has an HTTPS primary URL, HTTPS backup only, or no HTTPS URL configured.
- Provider domain names, URLs, ports and passwords are not shown in this test, and no provider is contacted.
- Existing system tests, demo content, login form and Windows packaging remain in place.

## Test
1. Install `Panther-Streams-Setup-0.6.0.exe` after building through GitHub Actions.
2. Explore Demo → System Test → Check provider configuration.
3. Take a screenshot of the provider readiness results (no password needed).

**Security:** The existing Supabase login function still rejects HTTP provider logins. A listed HTTPS URL is only a configuration check, not proof that the provider supports valid HTTPS Xtream authentication. Do not ask customers to use real credentials before secure connectivity is verified.

## Phone workflow
Extract this ZIP and upload its seven root files to `panther-streams-windows`, replacing existing files. Keep `.github/workflows` unchanged. Commit to `main`. The existing Actions workflow creates the Windows installer.
