import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="page-section text-center">
      <div className="container">
        <h1 style={{ fontSize: 'clamp(4rem, 12vw, 8rem)', marginBottom: 0 }}>404</h1>
        <p className="section-desc">That page doesn't exist (or doesn't anymore).</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 24 }}>Go home</Link>
      </div>
    </section>
  );
}
