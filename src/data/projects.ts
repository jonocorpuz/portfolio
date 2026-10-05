import type { AboutInfo, Project, SiteInfo } from '../types'
import cover1 from '../assets/covers/cover-1-coral-red.webp'
import cover2 from '../assets/covers/cover-2-blue-pink.webp'
import cover3 from '../assets/covers/cover-3-pink-white.webp'
import cover4 from '../assets/covers/cover-4-purple-cyan.webp'
import cover5 from '../assets/covers/cover-5-orange-gold.webp'
import cover6 from '../assets/covers/cover-6-teal-green.webp'
import cover7 from '../assets/covers/cover-7-indigo-magenta.webp'
import cover8 from '../assets/covers/cover-8-monochrome-silver.webp'

const GITHUB = 'https://github.com/jonocorpuz'
const LINKEDIN = 'https://www.linkedin.com/in/jonathan-corpuz/'
const RESUME = `${import.meta.env.BASE_URL}resume.pdf`

export const site: SiteInfo = {
  name: 'Jono Corpuz',
  blurb: "A slate of software I've designed, built and shipped — from iOS apps to systems code in C.",
  links: [
    { label: 'about', href: '#/about' },
    { label: 'github', href: GITHUB },
    // TODO(jono): drop resume.pdf into public/ (see README)
    { label: 'resume', href: RESUME },
  ],
}

export const about: AboutInfo = {
  tagline: 'iOS engineer and Computing Science student at Simon Fraser University.',
  bio: [
    "I'm Jono, a software engineer in Vancouver studying Computing Science at SFU. I like building native apps that feel effortless to use, and I'm just as happy down at the systems level writing C against POSIX.",
    'At Back On Stage I worked as an iOS Software Engineer on the native SwiftUI companion app for an established B2B SaaS platform. I turned complex web workflows, originally built in PHP and React, into native mobile experiences on top of existing REST APIs and AWS infrastructure, using MVVM so later phases are easy to build on.',
    'Outside of work I build iOS apps for things I care about, like cars and golf, and I compete in hackathons. I placed runner-up at StormHacks in both 2025 and 2026.',
  ],
  focus: ['Swift', 'SwiftUI', 'C / C++', 'Java', 'Python', 'JavaScript', 'AWS', 'Firebase', 'PostgreSQL', 'Docker'],
  contact: [
    { label: 'Email', href: 'mailto:jonocorpuz@gmail.com' },
    { label: 'GitHub', href: GITHUB },
    { label: 'LinkedIn', href: LINKEDIN },
    { label: 'Resume', href: RESUME },
  ],
}

// TODO(jono): swap the GitHub profile links below for each project's repo URL,
// and add { label: 'Live', href } / App Store links where they exist.
export const projects: Project[] = [
  {
    slug: 'gauge',
    title: 'Gauge',
    year: '2025',
    kind: 'iOS App',
    tagline: 'Car maintenance tracker for enthusiasts',
    summary:
      'A native iOS app for car enthusiasts to track services and modifications on their vehicles. It uses custom algorithms to recommend upcoming maintenance, and runs on a serverless AWS backend that I designed and manage myself.',
    sections: [
      {
        heading: 'The app',
        body: [
          'Built in SwiftUI, Gauge keeps a full history of every service and modification on each vehicle. Custom recommendation algorithms read that history and suggest what maintenance is coming due.',
        ],
      },
      {
        heading: 'Serverless backend',
        body: [
          "I designed and run the backend on AWS DynamoDB. It returns API responses with low latency, and a NoSQL data model leaves room for the app's data to grow without rigid schema changes.",
        ],
      },
      {
        heading: 'Authentication & security',
        body: [
          "Sign-in runs through AWS Cognito and the AWS Mobile SDK. Custom IAM roles limit each user's access to their own cloud resources.",
        ],
      },
    ],
    role: 'Solo developer',
    timeline: 'Dec 2025 – Present',
    stack: ['Swift', 'SwiftUI', 'AWS DynamoDB', 'AWS Cognito', 'IAM'],
    links: [{ label: 'GitHub', href: GITHUB }],
    cover: cover5,
  },
  {
    slug: 'ai-caddy',
    title: 'AI Caddy',
    year: '2026',
    kind: 'iOS App',
    tagline: 'AI golf caddy and rangefinder',
    summary:
      'A native iOS golf companion that gives real-time yardages on the course and recommends a club for each shot. It combines GPS course data, live weather and your own shot history, and reasons over them with the Gemini API.',
    sections: [
      {
        heading: 'Real-time yardages',
        body: [
          'The app uses SwiftUI with an MVVM architecture and Swift concurrency (async/await). CoreLocation and GolfCourseAPI supply course coordinates, draw the layout of each hole and calculate accurate distances on the course.',
        ],
      },
      {
        heading: 'Club recommendations',
        body: [
          'Structured prompts to the Gemini API turn your calibrated yardages, live conditions such as wind and temperature, and your past rounds into a recommended club for each shot.',
          'Club profiles and shot history are stored in Firebase Cloud Firestore, so recommendations get more personal the more you play.',
        ],
      },
    ],
    role: 'Solo developer',
    timeline: 'Jun 2026 – Present',
    stack: ['Swift', 'SwiftUI', 'CoreLocation', 'Firebase', 'Gemini API'],
    links: [{ label: 'GitHub', href: GITHUB }],
    cover: cover6,
  },
  {
    slug: 'the-archive',
    title: 'The Archive',
    year: '2026',
    kind: 'Web App',
    tagline: 'Screenshots in, interactive widgets out · StormHacks 2026',
    summary:
      "A web app built in 24 hours at StormHacks 2026. Drag in your screenshots and The Archive organises what's in them. Gemini analyses each one and generates an interactive widget for it, laid out in a responsive bento grid and a Rolodex-style view.",
    sections: [
      {
        heading: 'How it works',
        body: [
          'You drag screenshots onto the page to capture them. The Gemini API analyses each image and generates a working widget from its contents on the fly.',
          'The widgets appear in a responsive bento grid and a Rolodex-style layout that work on both mobile and desktop.',
        ],
      },
      {
        heading: 'Recognition',
        body: [
          'Runner-up for IATSU Best Design, for a polished, intuitive interface and a consistent experience across devices.',
        ],
      },
    ],
    role: 'Hackathon developer',
    timeline: 'Oct 2026 · 24 hours',
    stack: ['React', 'Neon PostgreSQL', 'Gemini API'],
    links: [{ label: 'GitHub', href: GITHUB }],
    cover: cover8,
  },
  {
    slug: 'meal4me',
    title: 'Meal4Me',
    year: '2025',
    kind: 'iOS App',
    tagline: 'Photograph your ingredients, get a recipe · StormHacks 2025',
    summary:
      'A native iOS app built in 24 hours at StormHacks 2025. You take a photo of the food you have, and Gemini identifies the ingredients and writes a recipe that uses them.',
    sections: [
      {
        heading: 'Multimodal recipes',
        body: [
          "Meal4Me uses the Gemini API's multimodal capabilities to recognise food items in a photo, then generates a structured recipe based on those ingredients.",
          'We went from idea to a working SwiftUI app within the 24-hour hackathon.',
        ],
      },
      {
        heading: 'Recognition',
        body: ['Runner-up for both Best Mobile App and Best Use of Gemini API.'],
      },
    ],
    role: 'Hackathon developer',
    timeline: 'Oct 2025 · 24 hours',
    stack: ['Swift', 'SwiftUI', 'Gemini API'],
    links: [{ label: 'GitHub', href: GITHUB }],
    cover: cover1,
  },
  {
    slug: 'posix-shell',
    title: 'POSIX Shell',
    year: 'CMPT 210',
    kind: 'Systems',
    tagline: 'A POSIX-compliant shell, written from scratch in C',
    summary:
      'A fully working POSIX-compliant shell written in C from scratch. It covers the low-level parts of an operating system: creating and managing processes, handling signals, managing memory and communicating between processes.',
    sections: [
      {
        heading: 'Process control',
        body: [
          'The shell supports foreground and background jobs, signal handling and built-in commands, with communication between processes for pipelines.',
        ],
      },
      {
        heading: 'Memory discipline',
        body: [
          'Every allocation has a clear owner and every resource is cleaned up. I checked the shell for leaks with Valgrind and debugged it with CGDB.',
        ],
      },
    ],
    role: 'Developer',
    timeline: 'Fall term · SFU',
    stack: ['C', 'POSIX', 'Linux', 'Valgrind', 'CGDB'],
    links: [{ label: 'GitHub', href: GITHUB }],
    cover: cover7,
  },
  {
    slug: 'cube-solver',
    title: 'Cube Solver',
    year: 'CMPT 225',
    kind: 'Algorithms',
    tagline: "Optimal Rubik's Cube solutions in under 20 moves",
    summary:
      "A Rubik's Cube solver in Java that consistently finds optimal solutions in under 20 moves without running out of heap memory.",
    sections: [
      {
        heading: 'Search',
        body: [
          'The solver uses the IDA* search algorithm, guided by a pre-generated pattern database that serves as an admissible heuristic.',
        ],
      },
      {
        heading: 'Optimisation',
        body: [
          "A custom version of Kociemba's Two-Phase Algorithm narrows the search, which significantly reduces both computation time and memory use.",
        ],
      },
    ],
    role: 'Developer',
    timeline: 'Fall term · SFU',
    stack: ['Java', 'IDA*', 'Pattern databases'],
    links: [{ label: 'GitHub', href: GITHUB }],
    cover: cover2,
  },
  {
    slug: 'groupchat',
    title: 'Groupchat',
    year: 'CMPT 210',
    kind: 'Networking',
    tagline: 'Multi-client chat over TCP, written in C',
    summary:
      'A chat system in C where many clients connect at once to a server, which broadcasts each message to everyone in real time. It is built on TCP sockets and POSIX threads.',
    sections: [
      {
        heading: 'Protocol',
        body: [
          'A custom application-layer protocol handles connecting, identifying each client, checking message integrity and disconnecting cleanly.',
        ],
      },
      {
        heading: 'Concurrency',
        body: [
          'A thread-safe message queue, guarded by a mutex, prevents race conditions while messages are broadcast to the server and the other clients.',
        ],
      },
    ],
    role: 'Developer',
    timeline: 'Fall term · SFU',
    stack: ['C', 'TCP sockets', 'pthreads', 'CGDB'],
    links: [{ label: 'GitHub', href: GITHUB }],
    cover: cover4,
  },
  {
    slug: 'ascend',
    title: 'Ascend',
    year: 'CMPT 276',
    kind: 'Web App',
    tagline: 'Full-stack fitness tracker, built as an Agile team',
    summary:
      'A full-stack fitness tracking web app built by a team working in Agile sprints. We held scrum meetings and sprint planning, reviewed each other\'s code, and used a Git workflow of branches and pull requests.',
    sections: [
      {
        heading: 'Backend',
        body: [
          'I built RESTful APIs for the core tracking features in Spring Boot. Integration tests with MockMvc and Spring Data JPA kept the backend stable and the data correct.',
        ],
      },
      {
        heading: 'Deployment',
        body: ['The app runs in a Docker container, which makes hosting and deploying it on Render automatic.'],
      },
    ],
    role: 'Team developer',
    timeline: 'Spring term · SFU',
    stack: ['Spring Boot', 'Java', 'JavaScript', 'Docker', 'Render'],
    links: [{ label: 'GitHub', href: GITHUB }],
    cover: cover3,
  },
]
