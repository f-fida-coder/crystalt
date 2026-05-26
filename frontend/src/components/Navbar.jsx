import { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../api/auth.jsx';
import { SERVICES } from '../services.js';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  const close = () => { setOpen(false); setServicesOpen(false); };

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="container nav-container">
          <Link to="/" className="logo" onClick={close}>
            <img src="/assets/logo.png" alt="Crystal Tech" />
            <span>Crystal Tech</span>
          </Link>

          <ul className={`nav-links${open ? ' active' : ''}`}>
            <li><NavLink to="/" end onClick={close}>Home</NavLink></li>
            <li><NavLink to="/about" onClick={close}>About</NavLink></li>
            <li className={`dropdown${servicesOpen ? ' active' : ''}`}>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setServicesOpen((v) => !v); }}
              >
                Services <i className="fas fa-chevron-down" />
              </a>
              <ul className="dropdown-menu">
                {SERVICES.map((s) => (
                  <li key={s.slug}>
                    <NavLink to={`/services/${s.slug}`} onClick={close}>
                      <i className={`fas ${s.icon}`} /> {s.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
            <li><NavLink to="/contact" onClick={close}>Contact</NavLink></li>
            {user ? (
              <>
                <li><NavLink to={user.role === 'admin' ? '/admin' : '/dashboard'} onClick={close}>Dashboard</NavLink></li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); logout(); close(); }}>Log out</a>
                </li>
              </>
            ) : (
              <>
                <li><NavLink to="/login" onClick={close}>Log in</NavLink></li>
                <li><NavLink to="/register" className="btn btn-primary nav-cta" onClick={close}>Get Started</NavLink></li>
              </>
            )}
          </ul>

          <button
            className={`nav-toggle${open ? ' active' : ''}`}
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            <i className={`fas ${open ? 'fa-times' : 'fa-bars'}`} />
          </button>
        </div>
      </nav>
      <div className={`nav-overlay${open ? ' active' : ''}`} onClick={close} />
    </>
  );
}
