# OBJ — No-Code Blog

This is a ready-to-deploy retro philosophy blog. It uses Vite + React + Tailwind and Decap CMS for a no-code editing experience.

## Features
- Retro early-2000s aesthetic with CRT glow and scanlines.
- Posts use categories, tags, excerpts, cover images.
- Supports image uploads and video embeds (URL or upload).
- Pages collection for static pages.
- RSS feed generated at /feed.xml via build script (set SITE_URL in Netlify environment).
- Mysterious: About section is intentionally blank; site tagline: "An OBJ appeared.".

## Usage
1. Upload this repository to GitHub.
2. Deploy to Netlify via "Import from GitHub" with build command `npm run build` and publish directory `dist`.
3. Enable Netlify Identity and Git Gateway for CMS editing.
4. Set environment variable `SITE_URL` in Netlify to your site URL to generate correct RSS links.
5. Visit /admin to create posts and pages, upload images and videos.