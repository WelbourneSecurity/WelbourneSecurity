# Welbourne Security

Static portfolio site for GitHub Pages.

## Structure

- `index.html`: page structure
- `styles.css`: site styling
- `main.js`: UI logic, writeup loader, and browser tools
- `content.js`: editable profile links and site content
- `persona-data.js`: data source for the persona generator
- `src/`: local certification badge images

## Writeups

The site loads writeups from the public repository configured in `content.js`.

Current source:

- owner: `WelbourneSecurity`
- repo: `CTF-Writeups`
- branch: `main`
- folders: `HTB`, `THM`, `CTF`

Add markdown files to those folders in the writeups repo and push to GitHub. The site will pick them up automatically.

## Deploy

1. Push this portfolio repo to GitHub.
2. Enable GitHub Pages for the repository.
3. Serve from the default branch root.

No build step is required.

## Local Preview

Open `index.html` directly or run a simple static server:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`.
