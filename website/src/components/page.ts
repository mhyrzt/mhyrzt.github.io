import { identity, projects, publications, elsewhere, cvProfiles, cvDownload } from '../content.ts';
import glyph from '../fourier/glyph.json' with { type: 'json' };

const esc = (s: string) => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const arrow = '<span aria-hidden="true">↗</span>';
const link = (url: string, label: string) => `<a href="${esc(url)}">${esc(label)} ${arrow}</a>`;
const badge = (text: string, variant = 'background0') => `<span is-="badge" variant-="${variant}">${text}</span>`;
const title = (id: string, label: string, right: string) => `<div class="panel-title"><h2 id="${id}">${badge(label)}</h2>${badge(right)}</div>`;
const outline = glyph.contours.map(c=>`M${c.map(p=>`${p.x},${p.y}`).join('L')}Z`).join('');

export function renderPage(): string {
  return `<a class="skip" href="#main">Skip to content</a>
  <div class="shell">
    <header class="site-header">
      <a href="#" class="wordmark">${badge('mhyrzt', 'accent')}<span>personal workstation</span></a>
      <nav aria-label="Main navigation"><a href="#work">Work</a><a href="#research">Research</a><a href="#about">About</a><button id="theme" size-="small" variant-="foreground1" aria-label="Switch to light theme" hidden>Light</button></nav>
    </header>
    <div class="workspace">
      <aside class="index-panel" box-="square" shear-="top" aria-label="Site index">
        <div class="panel-title">${badge('index')}${badge('~/mhyrzt')}</div>
        <div class="index-body"><p class="index-name">Mahyar Riazati</p><p class="muted">Software engineer<br>RL research</p><div is-="separator" aria-hidden="true"></div>
        <nav aria-label="Section index"><ul marker-="tree"><li><a href="#main">Introduction</a></li><li><a href="#work">Selected work</a></li><li><a href="#research">Research</a></li><li><a href="#experience">Experience</a></li><li><a href="#about">Beyond the code</a></li><li><a href="#elsewhere">Elsewhere</a></li></ul></nav>
        <div is-="separator" aria-hidden="true"></div><div class="cv-picker" hidden><label for="cv-profile">Tell me…</label><select id="cv-profile">${cvProfiles.map(p=>`<option value="${p.id}">${p.prompt}</option>`).join('')}</select></div><a id="cv-download" class="cv-index" href="${identity.cv}">↓ Engineering CV</a><noscript>${cvProfiles.slice(1).map(p=>`<a class="cv-index" href="${cvDownload(p.filename)}">↓ ${p.label}</a>`).join('')}</noscript><p class="index-location">Tehran, Iran</p></div>
      </aside>
      <main id="main">
        <div class="hero">
          <section class="intro-panel" box-="square" shear-="top" aria-labelledby="intro-title">
            <div class="panel-title"><h1 id="intro-title">${badge('Mahyar Riazati.')}</h1>${badge('hello')}</div>
            <div class="panel-body"><p class="intro-lead">I build software and infrastructure.<br>I study how machines learn.</p><p>My work crosses full-stack engineering, systems tooling, and reinforcement-learning research.</p><p>I’m interested in the distance between an idea that works in an experiment and a system that works in practice.</p><div class="intro-actions"><a is-="button" href="#work">Selected work ↓</a></div>
            <div is-="separator" aria-hidden="true"></div><p class="quiet-note">I love computers ツ</p><p class="muted">That was the old site.<br>There’s a little more here now.</p></div>
          </section>
          <figure class="fourier" box-="square" shear-="top" aria-labelledby="fourier-title" aria-describedby="fourier-desc">
            <figcaption class="panel-title"><span id="fourier-title">${badge('Fourier study / 𝓜')}</span>${badge('z ∈ ℂ')}</figcaption>
            <div class="fourier-stage"><svg class="glyph-fallback" viewBox="0 0 520 460" role="img" aria-label="Calligraphic capital M, the outline used for Fourier reconstruction"><path d="${outline}"/></svg><canvas id="fourier-canvas" width="520" height="460" aria-hidden="true" hidden></canvas><span class="axis-label" aria-hidden="true">Im</span><span class="axis-label real-axis" aria-hidden="true">Re</span></div>
            <div class="fourier-caption"><span class="formula" aria-label="z of t equals the sum of c k times e to the power two pi i k t">z(t) = Σ cₖ e<sup>2πikt</sup></span><span>512 samples</span></div>
            <p id="fourier-desc" class="sr-only">A mathematical script M reconstructed from a complex Fourier series. Each contour is sampled at 512 equal arc-length intervals; 128 coefficients determine rotating circles and vectors that trace its outline. Animation pauses offscreen and is replaced with a static glyph when reduced motion is requested.</p>
          </figure>
        </div>
        <section id="work" class="section work-panel" box-="square" shear-="top" aria-labelledby="work-title">
          ${title('work-title','Selected work','open source')}
          <div class="panel-body"><p class="section-note">Tools I build and maintain. Source and implementation notes included.</p>
          ${projects.map(p=>`<article class="project"><div class="project-heading"><h3>${badge(p.name,'accent')}</h3><span class="muted">${p.field}</span></div><div class="project-content"><div><p class="project-subtitle">${p.subtitle}</p><p>${p.description}</p></div><div><details is-="accordion"><summary>Implementation notes</summary><div><p>${p.contribution}</p></div></details><p class="stack">${p.stack}</p><div class="project-links">${link(p.source,'Source')}${link(p.docs,'Documentation')}</div></div></div></article>`).join('')}</div>
        </section>
        <section id="research" class="section" box-="square" shear-="top" aria-labelledby="research-title">
          ${title('research-title','Research','reinforcement learning')}
          <div class="panel-body"><p class="section-note">Reward shaping, experience transfer, and when outside guidance helps.</p>
          <div class="research-grid"><article class="thesis" box-="square" shear-="top"><div class="panel-title"><h3>${badge('SAFER')}</h3>${badge('thesis')}</div><div class="panel-body"><p class="research-question">What if the extra reward is pointing the wrong way?</p><p>My thesis at the University of Tehran investigated uncertain reward-shaping signals while preserving the original task objective.</p><ul><li>Multiple learning heads</li><li>Paired-policy evaluation</li><li>Evidence-based guidance selection</li></ul><p>Rust implementations and Python tools support experiments with helpful and adversarial guidance.</p><p class="muted">MSc research · 2022–2025</p></div></article>
          <div class="research-notes"><h3>Experiments & collaborations</h3><p>At Sharif’s Artificial Creatures Lab, I worked on experience transfer and reward guidance, contributing to Ex-RL and Deep ExRL.</p><p>At Tehran’s Cognitive Systems Lab, I explored LLM-generated rewards and how LLM guidance can help RL agents solve tasks. Along the way, I independently built an intelligent tutoring system (ITS) that later became ${link('https://rastai.ai/','RastAI')}.</p><p>${link('https://github.com/epsilonlog/Ex-RL-virtual-lab','Ex-RL experiment pipeline')}</p></div></div>
          <div class="publication-header">${badge('Publications','background1')}<span class="muted">coauthored research</span></div><div class="publications">${publications.map(p=>`<article><p class="publication-venue">${p.venue}</p><h3>${link(p.url,p.title)}</h3><p class="authors">${p.authors}</p></article>`).join('')}</div></div>
        </section>
        <section id="experience" class="section" box-="square" shear-="top" aria-labelledby="experience-title">
          ${title('experience-title','Experience','engineering / research / teaching')}
          <div class="panel-body"><p class="section-note">Selected context. The CV is the complete formal record.</p><div class="experience-list">
          <article><div><h3>${link('https://rastai.ai/','RastAI')}</h3><p class="dates">Jul 2025–present</p></div><div><p class="role">Software engineering · Developer tooling · R&D</p><p>I played a central role in the MVP and new platform core, across application development, infrastructure, and deployment. My work includes Kotlin/Spring Boot, React/Next.js, and AI-assisted authoring and grading with scoped tools and human review.</p><p>I also build developer tools that make it easier for teammates to work with coding agents. These include Rastploy, a Go deployment CLI and daemon with scoped access, deployment logs, and rollback, alongside tools for runner maintenance, service checks, and configuration reconciliation.</p></div></article>
          <article><div><h3>Cognitive Systems Lab</h3><p class="dates">May 2023–Sep 2025</p></div><div><p class="role">University of Tehran · Research & software</p><p>Alongside LLM/RL research, I built an LMS with ChatGPT integration, WebSockets, and educational grouping tools. The platform was tested in two classes and reached over 1,000 users.</p></div></article>
          <article><div><h3>Artificial Creatures Lab</h3><p class="dates">Mar 2022–Apr 2024</p></div><div><p class="role">Sharif University of Technology · Research</p><p>Experience-based reinforcement learning, reusable experiment modules, and Unity ML-Agents environments. This collaboration led to the two coauthored papers above.</p></div></article>
          <article><div><h3>${link('https://quera.org/','Quera')}</h3><p class="dates">Sep 2021–Nov 2022</p></div><div><p class="role">Teaching · Mentoring · Contest design</p><p>I taught and mentored bootcamp participants, maintained frontend courses serving over 3,000 learners, and designed programming contests, including a React recruitment contest with over 1,500 participants.</p></div></article>
          </div></div>
        </section>
        <section id="about" class="section" box-="square" shear-="top" aria-labelledby="about-title">
          ${title('about-title','Beyond the code','a few other interests')}
          <div class="panel-body about-content"><div class="about-portrait"><img src="/portrait.webp" alt="Mahyar Riazati" width="480" height="480" loading="lazy"><p class="muted">Mahyar / Tehran</p></div><div><p>I’m just a fully grown, functional computerphile kid. A nonstop learner, curious about the whole computer universe, from high-level abstractions to PN junctions.</p><p>I used to work with electronics, too. The curiosity has always crossed the boundary between software and hardware.</p><p>Beyond that: mathematics, theoretical computer science, philosophy, games, anime, and manga. Cyberpunk and science fiction keep finding their way in.</p><blockquote>A personal space. Always a work in progress.</blockquote><p>There’s a more informal corner on ${link('https://t.me/AutisticStuffs','Telegram')}.</p></div></div>
        </section>
        <section id="elsewhere" class="section" box-="square" shear-="top" aria-labelledby="elsewhere-title">
          ${title('elsewhere-title','Elsewhere','links / contact')}
          <div class="panel-body elsewhere-content"><div><h3>Keep in touch.</h3><p>For work, research, or an interesting conversation.</p><p class="contact-puzzle"><code>uniq(FIRST_NAME + LAST_NAME − vowels)</code><br><span class="muted">lowercase · at gmail dot com</span></p></div><ul marker-="tree">${elsewhere.map(e=>`<li>${link(e.url,e.name)}<span class="elsewhere-detail">${e.detail}</span></li>`).join('')}</ul></div>
        </section>
        <footer><span>${badge('mhyrzt','accent')}<span class="muted"> software / research / other things</span></span>${link('https://github.com/mhyrzt/mhyrzt.github.io','Site source')}<a href="#">Top ↑</a></footer>
      </main>
    </div>
  </div>`;
}
