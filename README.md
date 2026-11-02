# Panther Streams Windows v0.3.0

Desktop **preview** for Windows 10/11. Includes service-list selection from Panther Admin, nonfunctional login form, fictional Live TV programme guide, fictional Movies & Series catalogue, genre and search filters, episode selection, and locally stored **demo-only favourites**.

## Security and limitations
- The Sign In button does not send or store usernames/passwords. Never enter actual customer passwords into this preview.
- No provider IPTV authentication, movies, streams or playback is connected. All sample programmes/titles are fictional.
- Only public service display names are fetched from Supabase.
- Demo favourites are stored only on this computer in the app's local storage, not synced to Panther accounts.
- The existing GitHub Actions workflow should be retained, including `--publish never` in its build command.

## Build
- `npm install`
- `npm run check`
- `npm run dist:win -- --publish never`

Upload/replace the seven top-level project files in the existing `panther-streams-windows` repo, **not** the `.github` workflow folder. GitHub automatically builds on commits to main.
