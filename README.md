# NTI Hydroponics

A static, Swedish-language project site. No build step, framework or package installation is required.

## Run locally

Open `index.html` in a browser, or serve this directory with a local HTTP server. Keep the existing `media/` folder and filenames unchanged. All stylesheet, script and image paths work from a repository subdirectory as well as a domain root.

## Pages and interactions

- `index.html`: project introduction, interactive component markers on the existing 3D model, opt-in camera player and focus mode.
- `dokumentation.html`: 13 original Google Document links, local title search and category filters.
- `about.html`: project background and expandable ambitions.
- `blogg.html`: the existing under-construction page, refreshed without fabricated posts.
- `styles.css`: purple palette, organic bubble shapes, responsive layouts and reduced-motion support.
- `menu-modal.js`: navigation, component selection, document filters and focus mode.
- `videoscript.js`: opt-in loading and error handling for the original video source.

The older `samlingdokumentationer/` pages, `script.js`, and all original media remain untouched to preserve existing destinations.

## Content and provenance

Project identity, NFT focus, class names and ambitions come from the previous `about.html`. The class names are presented as the project's origins, not a confirmed current team. The 3D image comes from `media/hydroponicssetup.png` and is labeled as a model. Every document title and destination is retained from the previous `dokumentation.html`. Filter categories are navigation labels inferred from those titles; no document-body claims are added.

There are no invented sensor readings, yield or water-saving figures, testimonials, dates, posts or live-status indicators. Images that were labeled as stock in the previous site are not presented as photographs of the project.

## Camera

The original source is `https://hydroponics.ntig.dev/hls/stream.m3u8`. Its availability could not be confirmed during testing: the endpoint failed TLS negotiation from the test environment. The page does not claim the camera is live. It loads the pinned Clappr 0.3.13 player only after Start is pressed, displays connecting/playback/error states, and offers retry after failure. Playback, audio and source availability depend on the external service. The previous DVR-buffer customization is not retained because the service's rewind support is unverified.

## Verification

Chromium checks passed on all four main pages at 320, 390, 768 and 1440px: no horizontal document overflow, broken local images or JavaScript exceptions. Interaction checks covered model selection, search, category filters, empty results, accordions, mobile navigation, Escape handling and focus mode. The pinned player URL returned HTTP 200. A forced library-load failure confirmed the unavailable state and retry button. All 13 document URLs were compared byte-for-byte with the original collection. Google Document permissions were not changed or independently confirmed.

Desktop and mobile screenshots were visually inspected; a mobile camera-width issue was fixed and checked again. This is a redesign proposal, not a production deployment. Review the changes before merging.
