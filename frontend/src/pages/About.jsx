import { Link } from 'react-router-dom';

export default function About() {
  return (
    <section className="page-section">
      <div className="container">
        <div className="section-header text-center">
          <p className="section-tagline text-gold">About Us</p>
          <h2 className="section-title">A focused engineering studio</h2>
          <p className="section-desc">
            Crystal Tech builds apps, blockchain, websites, games and bots that real businesses
            depend on. Fixed quotes, weekly demos, you own the code.
          </p>
        </div>

        <div className="about-grid">
          <div>
            <h3>What we do</h3>
            <p>
              We're a small team of senior engineers shipping production-grade software for
              founders and growing teams. No middlemen, no offshored mystery box - the people
              quoting your project are the people writing the code.
            </p>
            <h3>Why teams pick us</h3>
            <ul className="check-list">
              <li><i className="fas fa-check" /> Fixed quotes - no surprises mid-build</li>
              <li><i className="fas fa-check" /> Weekly demos with a staging URL from day one</li>
              <li><i className="fas fa-check" /> You own every line of code from the first commit</li>
              <li><i className="fas fa-check" /> 30 days of post-launch support included</li>
            </ul>
          </div>
          <div>
            <img src="/assets/collaboration-image.png" alt="Crystal Tech team" loading="lazy" />
          </div>
        </div>

        <div className="process-cta">
          <Link to="/contact" className="btn btn-primary">Get in touch</Link>
        </div>
      </div>
    </section>
  );
}
