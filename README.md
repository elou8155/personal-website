# personal-website

Emily Lou's personal portfolio website, built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS v4.

## Features

- **Tabbed pages:** About, Experience and Projects, switched from the nav bar with no scrolling between sections.
- **About:** bio, headshot and contact links, under a playable Tetris banner (press Space to play).
- **Experience:** a timeline of roles that fades in as you scroll.
- **Projects:** a grid of image tiles that open a popup with details and GitHub links.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Other scripts: `npm run build`, `npm run start`, `npm run lint`.

## Editing content

- **Bio and links:** `app/components/About.tsx`
- **Roles:** the `EXPERIENCE` list in `app/components/Experience.tsx`
- **Projects:** the `projects` list in `app/components/Projects.tsx`. Images go in `public/images/`.
- **Colors:** the `@theme` block in `app/globals.css`

## Project structure

```
app/
  page.tsx            tab navigation and page layout
  components/         About, Experience, Projects, Tetris banner and game
  lib/tetris.ts       game logic
  globals.css         theme colors and custom styles
public/images/        headshot and project pictures
```

## Deploy

Hosted on Vercel with the Next.js preset and the repo root as the root directory.
