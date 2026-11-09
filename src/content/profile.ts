/**
 * All site content lives here. Edit this file to change what the site says.
 *
 * In answer text, wrap words in *asterisks* to highlight them in the accent color.
 * Questions with `answer: null` are hidden from the site until you fill them in.
 */

export const profile = {
  name: "Luka Amiranashvili",
  firstName: "Luka",
  role: "Full-stack developer",
  location: "Tbilisi, Georgia",
  timezone: "GMT+4",
  email: "luka.amiranashvili.2001@gmail.com",
  github: "https://github.com/Luka-Amiranashvili",
  // TODO(luka): add your LinkedIn URL, e.g. "https://www.linkedin.com/in/..."
  linkedin: null as string | null,
  headlineStack: ["Next.js", "TypeScript", "Node.js", "Flutter"],
  summary:
    "Full-stack developer building web apps with Next.js, Node.js and TypeScript, from responsive UIs to the APIs and databases behind them. I also build cross-platform mobile apps with Flutter and Dart. I pick up new tools quickly and I want to work on real products with a team that ships.",
  languages: ["Georgian", "English"],
  education: [
    { school: "GTU", years: "2024 to 2026" },
    { school: "BTU", years: "2020 to 2024" },
  ],
};

export type Project = {
  id: string;
  name: string;
  kind: string;
  summary: string;
  points: string[];
  stack: string[];
  badge?: string;
  href?: string;
};

export const projects: Project[] = [
  {
    id: "lesa",
    name: "LESA",
    kind: "Reading app for kids. iOS, Android, web",
    summary:
      "A gamified reading app for children. I worked on the team that built it, taking Figma designs to Flutter screens and adding the Rive animations kids see in the app.",
    points: [
      "Built the app's screens from Figma designs",
      "Implemented dynamic, game-like features",
      "Added Rive animations in the app and on the web",
      "Worked through product decisions with the team, weighing what helped the business",
    ],
    stack: ["Flutter", "BLoC / Cubit", "Isar", "Firebase", "Rive", "GoRouter"],
    // TODO(luka): name the award (e.g. "Winner, XYZ Awards 2025") and add the app/web link
    badge: "Award winner",
  },
  {
    id: "it-memo",
    name: "IT Memo",
    kind: "Artist presentation platform",
    summary:
      "A platform where artists' catalogs are presented and kept up to date. The content team edits everything from an admin panel, no developer needed.",
    points: [
      "Secure login and a role-based admin panel",
      "Live content updates for artist catalogs",
      "Relational MySQL schema designed for the catalog CRUD",
    ],
    stack: ["React", "Node.js", "MySQL"],
  },
  {
    id: "flashcontent",
    name: "FlashContent",
    kind: "AI content tool",
    summary:
      "Paste a link, get content back: social media hooks, headlines, and a cheat sheet that turns a long article into a structured reference guide.",
    points: [
      "Pulls and summarizes content from any URL",
      "Generates social hooks and headlines with the OpenAI API",
      "Cheat Sheet generator that breaks complex articles into short reference guides",
    ],
    stack: ["React", "Node.js", "OpenAI API"],
  },
];

export const stackGroups: { label: string; items: string[] }[] = [
  {
    label: "Every day",
    items: ["TypeScript", "JavaScript", "React", "Next.js", "Node.js", "Express", "Tailwind CSS", "HTML / CSS"],
  },
  { label: "Mobile", items: ["Flutter", "Dart", "BLoC / Cubit"] },
  {
    label: "Data",
    items: ["PostgreSQL", "MySQL", "MongoDB", "Prisma", "Supabase", "Firebase"],
  },
  { label: "Services", items: ["Clerk", "NextAuth", "Stripe", "shadcn/ui"] },
  { label: "Motion", items: ["Rive", "CSS animation", "GSAP", "Motion"] },
  { label: "Also", items: ["Python (Django, FastAPI basics)", "Git / GitHub", "AI agents (Claude)", "MCP"] },
];

export type Block =
  | { kind: "text"; text: string }
  | { kind: "projects" }
  | { kind: "stack" }
  | { kind: "contact" };

export type Question = {
  id: string;
  q: string;
  answer: Block[] | null;
};

export const intro: Block[] = [
  {
    kind: "text",
    text: "Hi, I'm Luka. You've probably read a hundred CVs this week, so let's do this *as an interview* instead. Pick a question below. In a hurry? The plain CV is one click away, top right.",
  },
];

const allQuestions: Question[] = [
  {
    id: "about",
    q: "So, tell me about yourself.",
    answer: [
      {
        kind: "text",
        text: "I'm a full-stack developer from Tbilisi. Most of my work is *Next.js, Node.js and TypeScript* on the web, and *Flutter* when it has to live on a phone.",
      },
      {
        kind: "text",
        text: "I like owning a feature end to end: the UI, the API behind it, and the database under that.",
      },
    ],
  },
  {
    id: "shipped",
    q: "What have you actually built?",
    answer: [
      {
        kind: "text",
        text: "Three projects worth your time. The first one is on the App Store and Google Play and *won an award*.",
      },
      { kind: "projects" },
    ],
  },
  {
    id: "why",
    q: "Why should we hire you?",
    answer: [
      {
        kind: "text",
        text: "Because I cover more of the product than one job title. I can build the *Next.js frontend*, write the *Node API* behind it, design the *database*, and ship the *mobile app* in Flutter if you need one.",
      },
      {
        kind: "text",
        text: "I've done that on a production app with a real team, not only in side projects. And I care about the part users actually feel. This site is my proof.",
      },
    ],
  },
  {
    id: "stack",
    q: "What's your stack?",
    answer: [
      { kind: "text", text: "What I use every day first, then everything I can pick up when a project needs it." },
      { kind: "stack" },
    ],
  },
  {
    id: "motion",
    q: "Can you do animation, or just regular UI?",
    answer: [
      {
        kind: "text",
        text: "It's the part I enjoy most. I built *Rive* animations into LESA, and this page runs on *GSAP and Motion*: the question cards flying up, the words appearing one by one, the light following your cursor.",
      },
      { kind: "text", text: "Ask another question and watch closely." },
    ],
  },
  {
    id: "ai",
    q: "How do you use AI in your work?",
    answer: [
      {
        kind: "text",
        text: "Every day. I work with *Claude* as a coding agent and connect it to my tools through *MCP* servers. It speeds up the boring parts, and I still review what it writes, because my name is on the code.",
      },
      {
        kind: "text",
        text: "I also build with it: FlashContent is a product on top of the OpenAI API.",
      },
    ],
  },
  {
    id: "location",
    q: "Where are you based?",
    answer: [
      {
        kind: "text",
        text: "*Tbilisi, Georgia*, GMT+4. Georgian is my first language and I work comfortably in *English*.",
      },
    ],
  },
  // TODO(luka): answer these four and they appear on the site automatically.
  { id: "start", q: "When can you start?", answer: null },
  { id: "remote", q: "Remote, hybrid or office?", answer: null },
  { id: "salary", q: "What are your salary expectations?", answer: null },
  { id: "failure", q: "Tell me about something that went wrong.", answer: null },
  {
    id: "education",
    q: "What's your education?",
    // TODO(luka): add your degree / field of study for each school.
    answer: [{ kind: "text", text: "I studied at *BTU* from 2020 to 2024, then at *GTU* from 2024 to 2026." }],
  },
  {
    id: "contact",
    q: "How do I reach you?",
    answer: [{ kind: "text", text: "Email is the fastest way to reach me. GitHub has the code." }, { kind: "contact" }],
  },
];

export type AnsweredQuestion = Question & { answer: Block[] };

export const questions: AnsweredQuestion[] = allQuestions.filter(
  (q): q is AnsweredQuestion => q.answer !== null,
);
