export const identity = {
  name: 'Mahyar Riazati',
  url: 'https://mhyrzt.github.io',
  description: 'Projects, research, and things I’m curious about.',
  cv: 'https://github.com/mhyrzt/mhyrzt.github.io/releases/latest/download/mahyar-riazati-cv.pdf',
};

export const projects = [
  {
    name: 'XRAT', field: 'Networking / systems', subtitle: 'Test and manage proxy connections.',
    description: 'XRAT brings proxy configuration, connection testing, and runtime management into one toolkit. It helps find usable connections and keep track of how they perform.',
    contribution: 'I develop the Rust CLI, terminal interface, web interface, and SDK. The toolkit parses subscriptions, tests HTTP latency concurrently, stores measurement history, and supervises proxy processes with health checks and automatic rotation.',
    stack: 'Rust · CLI / TUI / Web · Xray-core · sing-box',
    source: 'https://github.com/mhyrzt/xrat', docs: 'https://mhyrzt.github.io/xrat/',
  },
  {
    name: 'OGym', field: 'Reinforcement learning / tooling', subtitle: 'Reinforcement-learning environments in Rust.',
    description: 'OGym provides environments for reinforcement-learning experiments, from classic control tasks to physics simulations. A shared interface and typed action and observation spaces make them usable across different implementations.',
    contribution: 'I develop the environment interfaces, batch execution, and implementations using native Rust, Rapier, and MuJoCo. The project also includes benchmarks against Gymnasium, with the methodology and raw measurements available alongside the results.',
    stack: 'Rust · Typed spaces · Rapier · MuJoCo',
    source: 'https://github.com/mhyrzt/ogym', docs: 'https://mhyrzt.github.io/ogym/',
  },
  {
    name: 'Mahfel', field: 'Real-time / collaboration', subtitle: 'A shared room, on your own infrastructure.',
    description: 'A self-hosted meeting and collaboration platform with a Farsi-first interface. An ongoing engineering project, with audio/video, shared notes, whiteboards, and recordings.',
    contribution: 'I develop Rust services and a Next.js interface, connecting WebRTC media, application signaling, background jobs, and shared storage. The architecture separates API, media, and worker responsibilities.',
    stack: 'Rust · Next.js · WebRTC · PostgreSQL',
    source: 'https://github.com/mhyrzt/mahfel', docs: 'https://github.com/mhyrzt/mahfel/tree/main/docs',
  },
] as const;

export const publications = [
  { title: 'Ex-RL: Experience-based reinforcement learning', authors: 'A. Ghandi, S. B. Shouraki, I. Gholampour, A. Kamranian, M. Riazati', venue: 'Information Sciences · Vol. 689, 121479 · 2025', url: 'https://doi.org/10.1016/j.ins.2024.121479' },
  { title: 'Deep ExRL: Experience-Driven Deep Reinforcement Learning in Control Problems', authors: 'A. Ghandi, S. B. Shouraki, M. Riazati', venue: 'IWCIT · pp. 1–6 · 2024', url: 'https://doi.org/10.1109/IWCIT62550.2024.10552959' },
] as const;

export const elsewhere = [
  { name: 'GitHub', detail: 'Source code & experiments', url: 'https://github.com/mhyrzt' },
  { name: 'LinkedIn', detail: 'Professional connections', url: 'https://www.linkedin.com/in/mhyrzt/' },
  { name: 'Google Scholar', detail: 'Publications', url: 'https://scholar.google.com/citations?user=k-nwlcYAAAAJ' },
  { name: 'Telegram', detail: 'A more informal corner', url: 'https://t.me/AutisticStuffs' },
] as const;
