# Image Folder

Drop image files (`.jpg`, `.jpeg`, `.png`, `.webp`) into this folder.

They will **automatically appear** on the temple website within minutes — no code changes needed.

## How it works
The website fetches this folder's contents via the GitHub API:
```
https://api.github.com/repos/HARAR8B1/Vishnumayadevi-Temple/contents/Image
```
Images are displayed in:
- **Hero slideshow** (home section)
- **Gallery slideshow** (gallery section)

## Supported formats
- `.jpg` / `.jpeg`
- `.png`
- `.webp`
- `.gif`
