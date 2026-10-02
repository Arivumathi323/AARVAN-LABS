# Aarvan Labs

A complete responsive static website using semantic HTML, eight stylesheets, and five JavaScript files. No framework or installation is required.

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

## Added motion and search metadata

`css/enhancements.css` and `js/enhancements.js` add section reveals, staggered cards, counters, SVG circuit pulses, a scroll progress line, hero particles, and mascot interaction without changing the original animation, navigation, mascot, or contact scripts. The hero uses 50 particles on desktop and at most 20 on mobile/coarse-pointer devices. Canvas resolution is capped at 1.5 DPR; animation stops while the tab is hidden or the hero is offscreen. Transforms and opacity drive the reveals; temporary `will-change` hints are removed after transitions.

The existing Pause motion button and system reduced-motion preference also stop the added effects. Counters keep readable final values when motion is disabled or GSAP is unavailable. The mascot tilt is applied to a wrapper so it can coexist with the original floating image animation. Mobile uses idle sway and no cursor-driven tilt.

The hero video displays a subtle orange loading dot until playback. Media/source errors, rejected playback and a ten-second loading timeout activate the dark gradient fallback. No JavaScript leaves the gradient underneath the video as a static fallback.

`about.html` contains a third-person company profile. The homepage includes the requested FAQ, Organization and FAQPage JSON-LD, primary metadata, canonical URL, Open Graph and Twitter metadata. `sitemap.xml` lists both pages; `robots.txt` allows crawling. Canonical, schema and social image URLs use the supplied `https://aarvanlabs.vercel.app` domain. Deploy this source there for those absolute URLs to resolve; publishing a private Sites preview does not deploy to Vercel or make it indexable. Metadata and FAQ do not guarantee search ranking or answer-engine citations.

`assets/images/og-image.jpg` is the generated social preview card. Build and preview scripts include the new page and crawl files. Run `node check.mjs` for existing source and form checks, and `node check-enhancements.mjs` for added metadata and runtime-state checks.
