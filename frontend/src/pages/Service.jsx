import { Link } from 'react-router-dom';
import { SERVICES } from '../services.js';

export default function Service({ slug }) {
  const s = SERVICES.find((x) => x.slug === slug);
  if (!s) {
    return (
      <section className="page-section"><div className="container">
        <h2>Service not found</h2>
      </div></section>
    );
  }

  const others = SERVICES.filter((x) => x.slug !== slug).slice(0, 3);

  return (
    <>
      <section className="service-hero">
        <div className="container">
          <div className="icon-box service-hero-icon"><i className={`fas ${s.icon}`} /></div>
          <h1 className="section-title">{s.title}</h1>
          <p className="hero-sub">{s.tagline}</p>
          <Link to="/contact" className="btn btn-primary" style={{ marginTop: 24 }}>
            Start Your Project <i className="fas fa-arrow-right" />
          </Link>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div className="section-header">
            <p className="section-tagline text-gold">What we deliver</p>
            <h2 className="section-title">How <span className="text-gold">{s.title}</span> works at Crystal Tech</h2>
          </div>
          <p>{s.blurb}</p>

          <ul className="check-list" style={{ marginTop: 24 }}>
            <li><i className="fas fa-check" /> Fixed quote and timeline before we write a line of code</li>
            <li><i className="fas fa-check" /> Weekly demos and a staging environment from day one</li>
            <li><i className="fas fa-check" /> Clean Git history - you own the code from the first commit</li>
            <li><i className="fas fa-check" /> 30 days of post-launch support included</li>
          </ul>
        </div>
      </section>

      <section className="services-section">
        <div className="container">
          <div className="section-header text-center">
            <p className="section-tagline text-gold">Other services</p>
            <h2 className="section-title">You might also need</h2>
          </div>
          <div className="services-grid">
            {others.map((o) => (
              <div key={o.slug} className="service-card">
                <div className="icon-box"><i className={`fas ${o.icon}`} /></div>
                <h3>{o.title}</h3>
                <p>{o.blurb}</p>
                <Link to={`/services/${o.slug}`} className="read-more">
                  Learn More <i className="fas fa-arrow-right" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
