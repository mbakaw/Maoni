# Maoni

Maoni is a Nairobi discussion club and third space by Kata Form. This source powers the community site at https://maoni-community.fastcord1.chatgpt.site.

The interface uses soft floating desktop windows, a moving blue background and draggable sticky notes. The tabs are home, the conversations, the maoni wall, our maoni and the community. The essays and sources live in our maoni. Original community photos, event details and the shared Wall are retained.

The separate game opens at https://whats-your-maoni.fastcord1.chatgpt.site.

## Source

The app uses Vinext, TypeScript and vanilla JavaScript. `app/site.html` provides the shell, `public/site.js` provides the routes and `public/desktop.js` provides desktop interactions. `public/retro.css` styles the desktop and pages. The API at `app/api/wall/route.ts` uses the D1 `DB` binding.

Install the locked dependencies with pnpm. Run `pnpm dev` for local development and `pnpm build` for a production build. Sites publication uses the project identity in `.openai/hosting.json` and its managed workflow. Pushing this GitHub mirror alone does not publish the Sites deployment.

Personal sticky notes stay in browser localStorage. Community Wall posts use the shared database. No visitor database or credentials are included in this repository. Ticket checkout still requires the organiser's direct booking link; the event page provides the existing organiser contact flow.
