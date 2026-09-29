# Portfolio

React + TypeScript + Vite + Tailwind CSS portfolio site, with GSAP/ScrollTrigger
scroll animations and a React Three Fiber 3D hero scene.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- GSAP + ScrollTrigger for scroll-driven reveals
- Three.js / React Three Fiber + drei for the hero 3D piece

## Getting started

```bash
npm install
npm run dev
```

Other scripts: `npm run build`, `npm run preview`, `npm run lint`.

## Structure

- `src/App.tsx` — assembles the page sections
- `src/components/sections/` — Hero, About, Skills, Projects, Contact
- `src/components/canvas/` — the R3F hero scene (`HeroCanvas`, `FloatingModel`)
- `src/hooks/useScrollReveal.ts` — GSAP ScrollTrigger reveal hooks
- `src/data/content.ts` — skills/projects/socials content to edit

The hero 3D object is a procedural placeholder (distorted icosahedron). To
swap in a real model, load it in `FloatingModel.tsx` with drei's `useGLTF`.
