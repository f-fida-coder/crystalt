// Single source of truth for the service pages. Each entry drives a route,
// a Services dropdown link, and the data the Service page renders.
export const SERVICES = [
  {
    slug: 'app-development',
    title: 'App Development',
    icon: 'fa-mobile-screen',
    tagline: 'Native-feel iOS, Android & cross-platform apps.',
    blurb:
      'React Native and Flutter apps shipped in weeks - not quarters. Push notifications, offline support, payments, and a staging build from day one.',
  },
  {
    slug: 'blockchain-development',
    title: 'Blockchain Development',
    icon: 'fa-link',
    tagline: 'Smart contracts, dApps and wallets, audit-ready.',
    blurb:
      'Solidity, Rust and Move contracts with rigorous tests. ERC-20/721/1155, staking, on-chain governance, and full-stack dApp UIs.',
  },
  {
    slug: 'website-development',
    title: 'Website Development',
    icon: 'fa-globe',
    tagline: 'Fast marketing sites and web apps that convert.',
    blurb:
      'Next.js, React, and clean PHP backends. Page-speed scores above 90 on real devices, SEO-clean markup, and a CMS your team can actually use.',
  },
  {
    slug: 'game-development',
    title: 'Game Development',
    icon: 'fa-gamepad',
    tagline: 'Unity and Unreal builds for mobile, web and desktop.',
    blurb:
      'From playable prototype to multiplayer launch. We integrate analytics, leaderboards, in-app purchases, and live ops from the first sprint.',
  },
  {
    slug: 'bot-development',
    title: 'Bot Development',
    icon: 'fa-robot',
    tagline: 'Trading, Telegram and Discord bots that actually work.',
    blurb:
      'Sub-second latency, structured logging, risk controls, and uptime monitoring. Hosted on the infrastructure you already pay for.',
  },
  {
    slug: 'call-system-setup',
    title: 'Call System Setup',
    icon: 'fa-phone',
    tagline: 'VoIP, IVR and call-center tooling done right.',
    blurb:
      'Asterisk and FreePBX deployments, SIP trunking, call routing, recording, and dashboards your operators will actually open.',
  },
  {
    slug: 'decompile-decryption',
    title: 'Decompile & Decryption',
    icon: 'fa-code',
    tagline: 'Reverse engineering for legitimate ownership recovery.',
    blurb:
      'APK/IPA decompiling, obfuscated JS unraveling, and source recovery for codebases you own but have lost access to. NDA standard.',
  },
];
