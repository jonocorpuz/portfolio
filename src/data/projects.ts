import type { AboutInfo, Project, SiteInfo } from '../types'
import cover1 from '../assets/covers/cover-1-coral-red.webp'
import cover2 from '../assets/covers/cover-2-blue-pink.webp'
import cover3 from '../assets/covers/cover-3-pink-white.webp'
import cover4 from '../assets/covers/cover-4-purple-cyan.webp'
import cover5 from '../assets/covers/cover-5-orange-gold.webp'
import cover6 from '../assets/covers/cover-6-teal-green.webp'
import cover7 from '../assets/covers/cover-7-indigo-magenta.webp'
import cover8 from '../assets/covers/cover-8-monochrome-silver.webp'
import cover9 from '../assets/covers/cover-9-midnight-amber.webp'

const GITHUB = 'https://github.com/jonocorpuz'
const LINKEDIN = 'https://www.linkedin.com/in/jonathan-corpuz/'

export const site: SiteInfo = {
  name: 'Jonathan Corpuz',
  blurb: "Things I've built, from iOS apps to a shell written in C. Scroll to flip through, click one to read more.",
  links: [
    { label: 'projects', href: '#/' },
    { label: 'about', href: '#/about' },
    { label: 'github', href: GITHUB },
    { label: 'linkedin', href: LINKEDIN },
  ],
}

export const about: AboutInfo = {
  tagline: 'I build iOS apps, and I like knowing what happens underneath them.',
  bio: [
    "I'm Jonathan. I study Computing Science at Simon Fraser University and live in Vancouver.",
    'Most of my own projects end up on an iPhone. From January to August 2026 I was an iOS software engineer at Back On Stage, helping build the native iOS app for a B2B SaaS platform that already ran on the web. A lot of that job was taking workflows that had grown up in PHP and React and figuring out how they should actually feel on a phone, then wiring them to the REST APIs and AWS services that were already there. We structured it around MVVM with careful state management so whoever picks it up in later phases has an easier time.',
    "The other half of me likes the low-level stuff. Some of my favourite projects are a shell and a chat server written in C, where you can't hide from a memory leak or a race condition. I also do hackathons, and my StormHacks projects have been a category runner-up two years in a row.",
  ],
  focus: ['Swift', 'SwiftUI', 'C / C++', 'Java', 'Python', 'JavaScript', 'AWS', 'Firebase', 'PostgreSQL', 'Docker'],
  contact: [
    { label: 'Email', href: 'mailto:jonocorpuz@gmail.com' },
    { label: 'GitHub', href: GITHUB },
    { label: 'LinkedIn', href: LINKEDIN },
  ],
}

// TODO(jono): swap the GitHub profile links below for each project's repo URL,
// and add { label: 'Live', href } / App Store links where they exist.
export const projects: Project[] = [
  {
    slug: 'backonstage',
    title: 'BackOnStage',
    year: '2026',
    kind: 'Work',
    tagline: 'Taking an established web platform native on iPhone',
    summary:
      'From January to August 2026 I was an iOS Software Engineer at Back On Stage in Vancouver. The company runs an established B2B SaaS platform, and I helped build its native iOS companion app in SwiftUI. I worked on it end to end, from how the app is put together to the screens people actually use.',
    sections: [
      {
        heading: 'From the web to the phone',
        body: [
          "The platform already worked on the web, built in PHP and React, and some of its workflows were complicated. A lot of my job was working out what those flows should look like on a phone and then building them natively, so they feel like they belong there.",
          'The app runs on the same REST APIs and AWS backend the web version already uses. That kept it plugged into what was there instead of building a second system next to it.',
        ],
      },
      {
        heading: 'Easier to use',
        body: [
          'Alongside the features themselves, I put time into the user experience and into accessibility, so the app is comfortable for more people to use.',
        ],
      },
      {
        heading: 'Built for whoever comes next',
        body: [
          "The app has more development phases ahead of it, so I spent time on the foundations. It's built on MVVM with careful state management and modular pieces, so new features can be added without pulling apart what's already there.",
        ],
      },
    ],
    role: 'iOS Software Engineer',
    timeline: 'Jan 2026 to Aug 2026',
    stack: ['Swift', 'SwiftUI', 'MVVM', 'REST APIs', 'AWS'],
    links: [],
    cover: cover9,
  },
  {
    slug: 'ascend',
    title: 'Ascend',
    year: 'CMPT 276',
    kind: 'Web App',
    tagline: 'A full-stack fitness tracker, built by a team in sprints',
    summary:
      'Ascend is a full-stack fitness tracking web app. It was a team project, so a lot of what I got out of it was how to build software with other people.',
    sections: [
      {
        heading: 'Working as a team',
        body: [
          "We ran it in Agile sprints with scrum meetings and sprint planning. Changes went up as pull requests and got reviewed before they merged. You learn a lot about Git the first time two people edit the same file and you have to sort out the merge conflict.",
        ],
      },
      {
        heading: 'My part',
        body: [
          'I worked on the Spring Boot backend, building the REST APIs behind the tracking features. I wrote integration tests with MockMvc and Spring Data JPA so we would hear about broken data or a failing endpoint before anyone using the app did.',
          'I containerized the app with Docker and hosted it on Render, so new versions deployed automatically.',
        ],
      },
    ],
    role: 'Team developer',
    timeline: 'Spring term, SFU',
    stack: ['Spring Boot', 'Java', 'JavaScript', 'HTML/CSS', 'Docker', 'Render'],
    links: [{ label: 'GitHub', href: GITHUB }],
    cover: cover3,
  },
  {
    slug: 'gauge',
    title: 'Gauge',
    year: '2025',
    kind: 'iOS App',
    tagline: "A logbook for your car that tells you what's due next",
    summary:
      "Gauge is an iOS app for people who take their cars seriously. You log the services and the mods you've done, and the app suggests what maintenance should come next.",
    sections: [
      {
        heading: 'More than a list',
        body: [
          "A plain service log only tells you what already happened. The interesting part is the recommendations. I wrote my own algorithms that work out what maintenance a car probably needs, so the app is useful before something goes wrong instead of after.",
        ],
      },
      {
        heading: 'Running my own backend',
        body: [
          "I designed the backend and look after it myself. It's serverless on AWS with DynamoDB for storage. Responses come back quickly, and since it's NoSQL I can change what a record holds as the app grows without migrating a schema every time.",
          'Sign-in goes through AWS Cognito and the AWS Mobile SDK. I set up custom IAM roles so each account can only reach its own data in the cloud.',
        ],
      },
    ],
    role: 'Developer',
    timeline: 'Dec 2025 to now',
    stack: ['Swift', 'SwiftUI', 'AWS DynamoDB', 'AWS Cognito', 'IAM'],
    links: [{ label: 'GitHub', href: GITHUB }],
    cover: cover5,
  },
  {
    slug: 'vibecaddy',
    title: 'VibeCaddy',
    year: '2026',
    kind: 'iOS App',
    tagline: 'Yardages and club picks, on your phone, mid-round',
    summary:
      "A golf app that does two of a caddy's jobs. It tells you how far you are from the green, and it suggests which club to hit, based on how far you actually hit each one and what the weather is doing.",
    sections: [
      {
        heading: 'Distances',
        body: [
          "The phone's location comes from CoreLocation, and course coordinates and hole layouts come from GolfCourseAPI. Put the two together and the app can draw the hole and give you an accurate number to the target while you're standing on the course.",
        ],
      },
      {
        heading: 'Picking a club',
        body: [
          'For club recommendations I send Gemini a structured prompt with your own calibrated distance for each club, the current wind and temperature, and how your past rounds have gone. A generic chart would assume everyone hits a 7-iron the same distance. This uses your numbers.',
          'Your clubs and shot history are stored in Firebase Cloud Firestore, so the suggestions get more personal the more you play.',
        ],
      },
      {
        heading: 'Under the hood',
        body: [
          "It's SwiftUI with an MVVM structure. Location updates, course data and the AI request all take time to come back, and Swift's async/await lets the app wait on them without freezing the screen.",
        ],
      },
    ],
    role: 'Developer',
    timeline: 'Jun 2026 to now',
    stack: ['Swift', 'SwiftUI', 'CoreLocation', 'Firebase', 'Gemini API'],
    links: [{ label: 'GitHub', href: GITHUB }],
    cover: cover6,
  },
  {
    slug: 'the-archive',
    title: 'The Archive',
    year: '2026',
    kind: 'Web App',
    tagline: 'A home for the screenshots you take and never look at again',
    summary:
      "Everyone has a camera roll full of screenshots they took to remember something. The Archive gives them somewhere to go. You drag them in, and Gemini reads each one and turns it into a small interactive widget instead of leaving it as a flat image. It came together in 24 hours at StormHacks 2026.",
    sections: [
      {
        heading: 'From picture to widget',
        body: [
          'A screenshot means something to the person who took it and nothing to a computer. Each upload goes to the Gemini API, which works out what it is and generates a widget for it on the fly, so you end up with something you can actually click on and use.',
        ],
      },
      {
        heading: 'Making it look right',
        body: [
          'Widgets are laid out in a responsive bento grid with a Rolodex-style way to flip through them, and it works on both mobile and desktop.',
          'It was runner-up for IATSU Best Design.',
        ],
      },
    ],
    role: 'Hackathon developer',
    timeline: 'Oct 2026, 24 hours',
    stack: ['React', 'Neon PostgreSQL', 'Gemini API'],
    links: [{ label: 'GitHub', href: GITHUB }],
    cover: cover8,
  },
  {
    slug: 'meal4me',
    title: 'Meal4Me',
    year: '2025',
    kind: 'iOS App',
    tagline: "Take a photo of what's in your fridge and get something to cook",
    summary:
      "You point your phone at the food you have, and Meal4Me gives you a recipe that uses it. It's a native iOS app, built from nothing in 24 hours at StormHacks 2025.",
    sections: [
      {
        heading: 'How it works',
        body: [
          "Gemini's multimodal model looks at the photo and picks out the ingredients. Then the app asks it for a recipe back as structured output rather than free-form text, so the app can lay it out cleanly in SwiftUI.",
        ],
      },
      {
        heading: 'Against the clock',
        body: [
          "Twenty-four hours doesn't leave room for much, so the aim was a working MVP that does one thing well: photo in, recipe out.",
          'It placed runner-up in two categories: Best Mobile App and Best Use of Gemini API.',
        ],
      },
    ],
    role: 'Hackathon developer',
    timeline: 'Oct 2025, 24 hours',
    stack: ['Swift', 'SwiftUI', 'Gemini API'],
    links: [{ label: 'GitHub', href: GITHUB }],
    cover: cover1,
  },
  {
    slug: 'posix-shell',
    title: 'POSIX Shell in C',
    year: 'CMPT 210',
    kind: 'Systems',
    tagline: 'A Unix shell, written in C from an empty file',
    summary:
      "You use a shell every time you open a terminal, and it's easy to forget how much it's doing. I wrote one in C from scratch that follows the POSIX standard, which meant handling processes, signals, memory and communication between processes myself.",
    sections: [
      {
        heading: 'What it does',
        body: [
          "It runs programs in the foreground or the background, handles signals the way you'd expect, and has its own built-in commands. Each of those sounds small, but each one taught me something about how the operating system manages processes.",
        ],
      },
      {
        heading: 'No leaks',
        body: [
          'In C nothing cleans up after you. I used Valgrind to check that every allocation was freed and every resource was closed, and stepped through the harder bugs in CGDB until the shell ran clean.',
        ],
      },
    ],
    role: 'Developer',
    timeline: 'Fall term, SFU',
    stack: ['C', 'POSIX', 'Linux', 'Valgrind', 'CGDB'],
    links: [{ label: 'GitHub', href: GITHUB }],
    cover: cover7,
  },
  {
    slug: 'cube-solver',
    title: "Rubik's Cube Solver with IDA*",
    year: 'CMPT 225',
    kind: 'Algorithms',
    tagline: "Solving a Rubik's Cube in under 20 moves",
    summary:
      "A Rubik's Cube can be scrambled in about 43 quintillion ways. My Java solver finds a way back in under 20 moves, and it does it without running out of Java heap space.",
    sections: [
      {
        heading: 'Searching smart',
        body: [
          "Searching every possible sequence of moves would never finish. The solver uses IDA*, a search that goes deeper step by step. It's guided by a pattern database I generated ahead of time, which gives a lower bound on how many moves a position still needs. That bound tells the search which paths aren't worth exploring.",
        ],
      },
      {
        heading: 'Staying inside the heap',
        body: [
          "Search trees for a cube get big fast, and Java's heap has a ceiling. To stay under it I wrote my own variation of Kociemba's Two-Phase Algorithm, which splits the problem into two smaller searches. That cut down both the work and the memory the solver needed.",
        ],
      },
    ],
    role: 'Developer',
    timeline: 'Fall term, SFU',
    stack: ['Java', 'IDA*', 'Pattern databases'],
    links: [{ label: 'GitHub', href: GITHUB }],
    cover: cover2,
  },
  {
    slug: 'groupchat',
    title: 'TCP Groupchat in C',
    year: 'CMPT 210',
    kind: 'Networking',
    tagline: 'A chat server in C, built straight on TCP sockets',
    summary:
      "A group chat where lots of people can be connected at once and everyone sees each message the moment it's sent. There's no framework underneath, just TCP sockets and POSIX threads.",
    sections: [
      {
        heading: 'A protocol of my own',
        body: [
          "TCP gets bytes from one machine to another, and that's all it does. On top of it I designed a small protocol of my own that handles joining, working out who sent what, checking messages arrive intact, and letting people leave without breaking things for everyone else.",
        ],
      },
      {
        heading: 'Threads that share',
        body: [
          'The server uses POSIX threads to handle clients at the same time, and they all write to the same message queue. Without care, two messages land at the same moment and one gets lost or mangled. A mutex lock around the queue makes sure only one thread touches it at a time.',
        ],
      },
    ],
    role: 'Developer',
    timeline: 'Fall term, SFU',
    stack: ['C', 'TCP sockets', 'pthreads', 'CGDB'],
    links: [{ label: 'GitHub', href: GITHUB }],
    cover: cover4,
  },
]
