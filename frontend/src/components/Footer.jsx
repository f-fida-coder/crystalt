import { Link } from 'react-router-dom';
import { SERVICES } from '../services.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <img src="/assets/logo.png" alt="Crystal Tech" />
          <p>
            A focused engineering studio building apps, blockchain, websites, games and bots
            that real businesses depend on.
          </p>
          <div className="footer-socials">
            <a href="https://www.instagram.com/crystaltech777" aria-label="Instagram"><i className="fab fa-instagram" /></a>
            <a href="https://x.com/Crystaltechnol" aria-label="X"><i className="fab fa-x-twitter" /></a>
            <a href="https://t.me/Crystal_tech01" aria-label="Telegram"><i className="fab fa-telegram" /></a>
            <a href="https://www.tiktok.com/@crystal_tech100" aria-label="TikTok"><i className="fab fa-tiktok" /></a>
          </div>
        </div>

        <div>
          <h4>Services</h4>
          <ul>
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link to={`/services/${s.slug}`}>{s.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/login">Client Portal</Link></li>
          </ul>
        </div>

        <div>
          <h4>Get in touch</h4>
          <ul>
            <li><i className="fas fa-envelope" /> technologycrystals6@gmail.com</li>
            <li><i className="fas fa-phone" /> +1 630 386 8098</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Crystal Tech. All rights reserved.</p>
      </div>
    </footer>
  );
}
