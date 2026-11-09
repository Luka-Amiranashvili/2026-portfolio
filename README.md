# CV Show

My portfolio, built as a game-show interview. Instead of scrolling through a CV, you pick the questions recruiters usually ask and I answer them, with an animated version of me reacting on screen.

**Live:** _link coming after deploy_

If you're in a hurry, the **Plain CV** button (or the `C` key) opens a normal one-page CV at any point.

## What's inside

- **Interview flow.** Question cards fly into the conversation, answers type out word by word, and the page scrolls to each new answer for you. Number keys `1` to `9` ask questions.
- **Rive character.** The cartoon of me is a Rive file driven by a view model: he thinks while an answer is "typing", talks while the words appear, celebrates at the finale, and his face follows your cursor. When the title sign scrolls away, he moves into a small "live cam" in the corner.
- **Sound, off by default.** Every sound, including the background lounge loop and the finale fanfare, is synthesized with the Web Audio API. There are no audio files. The music ducks while answers play and stops when the tab is hidden.
- **Content in one file.** All questions, answers, projects and skills live in [`src/content/profile.ts`](src/content/profile.ts). Questions without an answer stay hidden.
- **Accessibility.** Reduced motion is respected across GSAP, Motion, Lenis and Rive, the start screen and CV sheet are proper dialogs, and everything works from the keyboard.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · GSAP · Motion · Lenis · Rive · Web Audio API

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Project layout

```
src/
  app/          layout, page, icons, link preview image
  components/   Interview, Hero, Answer, QuestionDock, LiveCam, CvSheet, Finale...
  content/      profile.ts: every word on the site
  lib/          sound engine, character mood store, GSAP setup
public/
  luka.riv      the animated character
```

## Credits

Display font: [Bungee](https://fonts.google.com/specimen/Bungee) by David Jonathan Ross, under the SIL Open Font License ([`assets/Bungee-OFL.txt`](assets/Bungee-OFL.txt)).
