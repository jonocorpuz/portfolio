// TODO(jono): replace with real projects

import type { AboutInfo, Project, SiteInfo } from '../types'
import cover1 from '../assets/covers/cover-1-coral-red.jpg'
import cover2 from '../assets/covers/cover-2-blue-pink.jpg'
import cover3 from '../assets/covers/cover-3-pink-white.jpg'
import cover4 from '../assets/covers/cover-4-purple-cyan.jpg'
import cover5 from '../assets/covers/cover-5-orange-gold.jpg'
import cover6 from '../assets/covers/cover-6-teal-green.jpg'
import cover7 from '../assets/covers/cover-7-indigo-magenta.jpg'
import cover8 from '../assets/covers/cover-8-monochrome-silver.jpg'

export const site: SiteInfo = {
  name: 'Jono Corpuz',
  blurb: "A slate of software I've designed, built and shipped — from side projects to production systems.",
  links: [
    { label: 'about', href: '#/about' },
    { label: 'github', href: 'https://github.com/' },
    // TODO(jono): drop resume.pdf into public/ (see README)
    { label: 'resume', href: `${import.meta.env.BASE_URL}resume.pdf` },
  ],
}

// TODO(jono): replace the placeholder bio + contact links with real ones.
export const about: AboutInfo = {
  tagline: 'Software engineer who likes the whole stack — and the details in it.',
  bio: [
    "I'm Jono, a software engineer who enjoys turning fuzzy problems into well-built, carefully finished products. Most of my work lives somewhere between the browser and the backend: product interfaces, data-heavy tools and the services behind them.",
    'I care about the parts people feel but rarely name — fast load times, interactions that respond the way you expect, and code the next engineer can pick up without a tour.',
    'Outside of work I tinker with side projects, read more about systems design than is probably healthy, and keep a running list of small tools I want to exist.',
  ],
  focus: ['TypeScript', 'React', 'Node.js', 'Python', 'Postgres', 'Cloud infrastructure'],
  contact: [
    { label: 'Email', href: 'mailto:hello@example.com' },
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'Resume', href: `${import.meta.env.BASE_URL}resume.pdf` },
  ],
}

export const projects: Project[] = [
  {
    slug: 'synthwave',
    title: 'Synthwave',
    year: '2024',
    kind: 'Web App',
    tagline: 'Real-time collaborative music production platform',
    summary: 'A browser-based DAW enabling musicians to collaborate in real-time across continents. Features low-latency audio streaming, synchronized editing, and a modular plugin architecture.',
    sections: [
      {
        heading: 'Architecture',
        body: [
          'Built with WebAudio API for client-side synthesis and Rust backend for low-latency server-to-server audio routing. Uses WebRTC for peer connections and CRDT for conflict-free collaborative editing.',
          'The system handles 1000+ concurrent connections with sub-100ms latency, utilizing a distributed architecture across multiple availability zones.',
        ],
      },
      {
        heading: 'Impact',
        body: [
          'Enables remote music production with professional-grade latency. Used by 200+ creators in the first month of beta.',
        ],
      },
    ],
    role: 'Full-stack Engineer',
    timeline: 'Mar 2024 – Aug 2024',
    stack: ['React', 'TypeScript', 'Rust', 'WebAudio', 'WebRTC'],
    links: [
      { label: 'GitHub', href: 'https://github.com/' },
      { label: 'Live', href: 'https://example.com' },
    ],
    cover: cover1,
  },
  {
    slug: 'dataflow',
    title: 'Dataflow',
    year: '2023',
    kind: 'Dev Tool',
    tagline: 'Visual dataflow programming environment',
    summary: 'A node-based visual programming tool for designing data pipelines without writing code. Integrates with popular data platforms and supports custom transformations.',
    sections: [
      {
        heading: 'Features',
        body: [
          'Drag-and-drop interface for composing data transformations. Real-time preview of data flowing through nodes.',
          'Supports 50+ integrations with data sources and destinations including SQL databases, APIs, and cloud storage.',
        ],
      },
      {
        heading: 'Performance',
        body: [
          'Handles petabyte-scale datasets with optimized execution plans. Custom graph compiler generates efficient execution DAGs.',
        ],
      },
    ],
    role: 'Product Engineer',
    timeline: 'Jan 2023 – Jun 2023',
    stack: ['React', 'D3.js', 'Python', 'GraphQL', 'PostgreSQL'],
    links: [
      { label: 'GitHub', href: 'https://github.com/' },
      { label: 'Live', href: 'https://example.com' },
    ],
    cover: cover2,
  },
  {
    slug: 'nexus-ml',
    title: 'Nexus ML',
    year: '2022',
    kind: 'ML Pipeline',
    tagline: 'Distributed training platform for computer vision models',
    summary: 'Infrastructure for training large-scale vision models across GPU clusters. Provides automated data preprocessing, distributed training, and model serving.',
    sections: [
      {
        heading: 'Capabilities',
        body: [
          'Supports training on 100+ GPU nodes with 95% efficiency. Built-in support for common architectures and transfer learning.',
          'Includes hyperparameter search, experiment tracking, and automated model versioning.',
        ],
      },
      {
        heading: 'Results',
        body: [
          'Reduced model training time by 70% compared to manual setup. Used internally to train models reaching 95%+ accuracy on benchmark datasets.',
        ],
      },
    ],
    role: 'ML Infrastructure Engineer',
    timeline: 'May 2022 – Dec 2022',
    stack: ['Python', 'PyTorch', 'Kubernetes', 'CUDA', 'Go'],
    links: [
      { label: 'GitHub', href: 'https://github.com/' },
      { label: 'Live', href: 'https://example.com' },
    ],
    cover: cover3,
  },
  {
    slug: 'mobile-auth',
    title: 'MobileAuth',
    year: '2024',
    kind: 'Mobile App',
    tagline: 'Passwordless authentication system for iOS and Android',
    summary: 'Native mobile application providing biometric and push-notification based authentication. Supports both native app and web authentication flows.',
    sections: [
      {
        heading: 'Implementation',
        body: [
          'Built with SwiftUI and Kotlin Compose for native feel. Uses device secure enclave for cryptographic operations.',
          'Integrates with OAuth 2.0 and OIDC protocols for seamless third-party app authentication.',
        ],
      },
      {
        heading: 'Security',
        body: [
          'Zero-knowledge architecture means servers never see user biometrics. All cryptographic operations happen on-device.',
        ],
      },
    ],
    role: 'Mobile Lead',
    timeline: 'Sep 2023 – Apr 2024',
    stack: ['Swift', 'Kotlin', 'WebAuthn', 'Firebase', 'Node.js'],
    links: [
      { label: 'GitHub', href: 'https://github.com/' },
      { label: 'Live', href: 'https://example.com' },
    ],
    cover: cover4,
  },
  {
    slug: 'meshnet',
    title: 'MeshNet',
    year: '2021',
    kind: 'Distributed System',
    tagline: 'P2P mesh networking protocol and SDK',
    summary: 'Protocol and library enabling direct peer-to-peer communication with automatic NAT traversal. Suitable for building decentralized applications.',
    sections: [
      {
        heading: 'Technology',
        body: [
          'Implements custom gossip protocol for network discovery. Uses hole punching and relay servers for NAT traversal.',
          'Achieves 99.9% uptime with automatic failover and network reconnection.',
        ],
      },
      {
        heading: 'Adoption',
        body: [
          'Published as open-source library with 500+ GitHub stars. Used in production by 15+ projects.',
        ],
      },
    ],
    role: 'Protocol Designer',
    timeline: 'Feb 2021 – Aug 2021',
    stack: ['Rust', 'Tokio', 'WebAssembly', 'Protocol Buffers'],
    links: [
      { label: 'GitHub', href: 'https://github.com/' },
      { label: 'Live', href: 'https://example.com' },
    ],
    cover: cover5,
  },
  {
    slug: 'cli-forge',
    title: 'CLI Forge',
    year: '2023',
    kind: 'CLI Tool',
    tagline: 'Framework for building composable command-line tools',
    summary: 'Developer framework simplifying creation of professional CLI applications with automatic shell completion, interactive prompts, and rich output formatting.',
    sections: [
      {
        heading: 'Developer Experience',
        body: [
          'Define CLIs as composable command trees with automatic help generation. Built-in support for config files, environment variables, and secrets management.',
          'Generates bash, zsh, and fish completions automatically.',
        ],
      },
      {
        heading: 'Adoption',
        body: [
          'Used internally by 50+ command-line tools. Open-sourced with 1000+ weekly downloads.',
        ],
      },
    ],
    role: 'Framework Author',
    timeline: 'Jul 2023 – Nov 2023',
    stack: ['Go', 'Cobra', 'YAML', 'Bash'],
    links: [
      { label: 'GitHub', href: 'https://github.com/' },
      { label: 'Live', href: 'https://example.com' },
    ],
    cover: cover6,
  },
  {
    slug: 'game-engine',
    title: 'SilverEngine',
    year: '2020',
    kind: 'Game Engine',
    tagline: '2D game engine with ECS architecture',
    summary: 'Lightweight game engine for 2D games built on entity-component-system architecture. Includes physics, sprite rendering, and audio systems.',
    sections: [
      {
        heading: 'Architecture',
        body: [
          'Pure ECS design for maximum flexibility and performance. SIMD-optimized systems for transform updates and physics calculations.',
          'Supports both pixel art and vector rendering.',
        ],
      },
      {
        heading: 'Games',
        body: [
          'Used by indie developers to ship 10+ games on Steam. Average frame rate 120 FPS on mid-range hardware.',
        ],
      },
    ],
    role: 'Engine Developer',
    timeline: 'Jan 2020 – Sep 2020',
    stack: ['Rust', 'WebGPU', 'Rapier', 'SDL2'],
    links: [
      { label: 'GitHub', href: 'https://github.com/' },
      { label: 'Live', href: 'https://example.com' },
    ],
    cover: cover7,
  },
  {
    slug: 'analytics-viz',
    title: 'Analytics Viz',
    year: '2024',
    kind: 'Data Visualization',
    tagline: 'Interactive analytics dashboard for real-time metrics',
    summary: 'Web-based dashboard for visualizing and analyzing business metrics in real-time. Supports custom queries, alerts, and collaborative annotations.',
    sections: [
      {
        heading: 'Performance',
        body: [
          'Handles millions of data points with GPU-accelerated rendering. Queries execute in under 500ms even on large datasets.',
          'WebGL-based rendering ensures smooth interactions even with dense data.',
        ],
      },
      {
        heading: 'Features',
        body: [
          'Customizable widgets and dashboards. Real-time alerts and anomaly detection. Collaborative commenting and sharing.',
        ],
      },
    ],
    role: 'Full-stack Engineer',
    timeline: 'Feb 2024 – Present',
    stack: ['React', 'WebGL', 'TypeScript', 'PostgreSQL', 'TimescaleDB'],
    links: [
      { label: 'GitHub', href: 'https://github.com/' },
      { label: 'Live', href: 'https://example.com' },
    ],
    cover: cover8,
  },
]
