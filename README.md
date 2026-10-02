# Aarvan Labs

A complete responsive static website using semantic HTML, seven stylesheets, and four JavaScript files. No framework or installation is required.

## Preview

Open `index.html` in a browser, or run `node preview.mjs` and visit the printed URL. Stop the server with Ctrl+C.

## Assets

The original supplied files remain untouched in the parent folder. Its `video.mp4` is copied to `assets/video/mascot-video.mp4`, following the explicit path in the brief (the example tree's `hero-video.mp4` name is not used). Its `aarvan logo.png` is copied to `assets/images/logo.png`.

The hero accepts `assets/images/mascot.png` when available. Until then, the supplied Aarvan Labs logo appears.

The project cards use five original AI-generated concept illustrations, not actual product photographs or screenshots:

- `assets/images/projects/thozhan.png`
- `assets/images/projects/nova.png`
- `assets/images/projects/vision-os.png`
- `assets/images/projects/geo-audit.png`
- `assets/images/projects/konsolv.png`

Four matching service illustrations are stored under `assets/images/services/`: `ai-automation.png`, `web-development.png`, `product-building.png`, and `freelance.png`. All nine use a coordinated charcoal, silver, and orange palette. The card layouts reserve image dimensions, load artwork lazily, and use gentle hover zoom with reduced-motion support. Project images can be replaced with authentic photographs or screenshots at the same paths. Named fallbacks remain available if a project image cannot load.

See `IMAGE-PROMPTS.md` for the image-generation prompts and provenance.

## Contact and Fiverr

The contact form validates locally and displays a truthful demo confirmation. It does not send, transmit, or store messages. Before launch, connect a form service or backend, validate input on the server, apply abuse protection, and show success only after a successful server response. No API secret belongs in browser JavaScript.

Replace `href="#"` on `#fiverr-link` with the real profile URL. Until then, clicking it announces that the link is coming soon. The supplied GitHub, YouTube, LinkedIn, and Instagram URLs are included in both social rows.

## Accessibility and motion

Includes labeled controls, inline validation, keyboard focus states, skip navigation, responsive mobile navigation with Escape handling, and a motion pause control. System reduced-motion preferences disable entrance and floating animation and pause the video. If GSAP or fonts cannot load, the page remains readable with static content and system fonts. Footer gray text is slightly brighter than the brief to improve readability.

## File structure

`index.html`, `css/{main,hero,about,services,projects,contact,responsive}.css`, `js/{main,animations,mascot,contact}.js`, and `assets/` form the website. `preview.mjs` is a development-only static server. `build.mjs` copies the public files into `dist/` for static hosting.

Google Fonts supplies Space Grotesk and Inter; GSAP and ScrollTrigger load from cdnjs. The browser needs internet access for those optional resources.
