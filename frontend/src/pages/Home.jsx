import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SERVICES } from '../services.js';
import Reviews from '../components/Reviews.jsx';
import Counter from '../components/Counter.jsx';

const HERO_WORDS = ['Apps', 'Blockchain', 'Websites', 'Games', 'Bots', 'AI'];

export default function Home() {
  useEffect(() => {
    const el = document.querySelector('.hero-typed');
    if (!el || HERO_WORDS.length < 2) return;
    let i = 0;
    const interval = setInterval(() => {
      el.classList.add('hero-typed-out');
      setTimeout(() => {
        i = (i + 1) % HERO_WORDS.length;
        el.textContent = HERO_WORDS[i];
        el.classList.remove('hero-typed-out');
        el.classList.add('hero-typed-in');
        setTimeout(() => el.classList.remove('hero-typed-in'), 500);
      }, 380);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header id="home" className="hero-v2">
        <div className="hero-mesh" aria-hidden="true">
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
          <div className="hero-blob hero-blob-3" />
          <div className="hero-grid-overlay" />
        </div>

        <div className="container hero-container">
          <div className="hero-content-v2">
            <p className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              Engineering studio &middot; Available for new projects
            </p>
            <h1 className="hero-title">
              We build the future of{' '}
              <span className="hero-typed-wrap">
                <span className="hero-typed">Apps</span>
              </span>
            </h1>
            <p className="hero-sub">
              Production-grade software for founders and growing teams. Apps, blockchain, websites,
              games and bots &mdash; shipped in weeks, owned by you.
            </p>
            <div className="hero-actions">
              <Link to="/contact" className="hero-cta-primary">
                Start Your Project <i className="fas fa-arrow-right" />
              </Link>
              <a href="#services" className="hero-cta-secondary">
                <i className="fas fa-play-circle" /> Explore Services
              </a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><Counter to={50} suffix="+" /><span>Clients</span></div>
              <div className="hero-stat-divider" />
              <div className="hero-stat"><Counter to={120} suffix="+" /><span>Projects shipped</span></div>
              <div className="hero-stat-divider" />
              <div className="hero-stat"><Counter to={98} suffix="%" /><span>On-time delivery</span></div>
            </div>
          </div>
        </div>

        <a href="#services" className="hero-scroll-indicator" aria-label="Scroll to services">
          <span>Explore</span>
          <i className="fas fa-chevron-down" />
        </a>
      </header>

      <section className="tech-marquee" aria-label="Technologies we work with">
        <p className="tech-marquee-label">Built with the stacks teams trust in production</p>
        <div className="tech-marquee-track">
          <div className="tech-marquee-row">
            {[...TECHS, ...TECHS].map((t, idx) => (
              <span key={idx} className="tm-item" aria-hidden={idx >= TECHS.length}>
                <i className={t.icon} />{t.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="services-section">
        <div className="container">
          <div className="section-header text-center">
            <p className="section-tagline">Our Expertise</p>
            <h2 className="section-title">
              We <span className="text-gold">Harness</span> the Power of Innovation to drive your{' '}
              <span className="text-gold">Business Forward</span>
            </h2>
            <p className="section-desc">
              We offer comprehensive software solutions tailored to your business.
            </p>
          </div>

          <div className="services-grid">
            {SERVICES.map((s) => (
              <div key={s.slug} className="service-card">
                <div className="icon-box"><i className={`fas ${s.icon}`} /></div>
                <h3>{s.title}</h3>
                <p>{s.blurb}</p>
                <Link to={`/services/${s.slug}`} className="read-more">
                  Learn More <i className="fas fa-arrow-right" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="partner-section">
        <div className="container partner-grid">
          <div className="partner-image">
            <div className="image-wrapper">
              <img src="/assets/collaboration-image.png" alt="Team Collaboration" loading="lazy" />
            </div>
          </div>
          <div className="partner-content">
            <span className="tag">Collaborate</span>
            <h2>Partner with us to experience technology like never before</h2>
            <p>
              Together we can achieve extraordinary results. Let's combine our expertise to create
              innovative solutions.
            </p>
            <Link to="/contact" className="btn btn-primary">JOIN US</Link>
          </div>
        </div>
      </section>

      <section className="process-section">
        <div className="container">
          <div className="section-header text-center">
            <p className="section-tagline text-gold">How We Work</p>
            <h2 className="section-title">From Idea to <span className="text-gold">Launch</span> in Four Steps</h2>
            <p className="section-desc">
              A predictable process, weekly demos, no black-box phases. You always know where the build stands.
            </p>
          </div>
          <div className="process-grid">
            {PROCESS.map((p, i) => (
              <div key={p.title} className="process-step">
                <div className="process-num">{String(i + 1).padStart(2, '0')}</div>
                <div className="process-icon"><i className={`fas ${p.icon}`} /></div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
          <div className="process-cta">
            <Link to="/contact" className="btn btn-primary">Book a Discovery Call</Link>
          </div>
        </div>
      </section>

      <Reviews />
    </>
  );
}

const TECHS = [
  { icon: 'fab fa-react',     label: 'React' },
  { icon: 'fab fa-node-js',   label: 'Node.js' },
  { icon: 'fab fa-python',    label: 'Python' },
  { icon: 'fab fa-ethereum',  label: 'Ethereum' },
  { icon: 'fab fa-aws',       label: 'AWS' },
  { icon: 'fab fa-google',    label: 'Google Cloud' },
  { icon: 'fab fa-microsoft', label: 'Azure / .NET' },
  { icon: 'fab fa-android',   label: 'Android' },
  { icon: 'fab fa-apple',     label: 'iOS' },
  { icon: 'fab fa-unity',     label: 'Unity' },
  { icon: 'fab fa-docker',    label: 'Docker' },
  { icon: 'fab fa-php',       label: 'PHP / Laravel' },
  { icon: 'fab fa-java',      label: 'Java / Spring' },
  { icon: 'fab fa-vuejs',     label: 'Vue' },
  { icon: 'fab fa-js',        label: 'TypeScript' },
  { icon: 'fas fa-database',  label: 'PostgreSQL' },
];

const PROCESS = [
  { icon: 'fa-comments',     title: 'Discover', desc: 'We dig into your goals, users and constraints. You leave the first call with a written scope, timeline and fixed quote.' },
  { icon: 'fa-pen-ruler',    title: 'Design',   desc: 'Wireframes, then high-fidelity mockups in Figma. You approve every screen before a single line of production code is written.' },
  { icon: 'fa-code-branch',  title: 'Build',    desc: 'Weekly demos, a staging environment from day one, clean Git history. You own the code from the first commit.' },
  { icon: 'fa-rocket',       title: 'Launch',   desc: 'Production deploy, monitoring and 30 days of post-launch support included. Then optional retainer for ongoing work.' },
];
