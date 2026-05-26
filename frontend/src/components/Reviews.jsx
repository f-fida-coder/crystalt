import { useEffect, useState } from 'react';
import { api } from '../api/client.js';

const SEED = [
  { id: 'seed-1', author_name: 'Marcus Holloway', author_role: 'Founder, BlockRoute', service: 'Blockchain Development', rating: 5, content: "Crystal Tech shipped our staking dApp in six weeks with weekly demos the whole way. Smart contracts were audit-ready out the box.", created_at: '2025-09-12' },
  { id: 'seed-2', author_name: 'Priya Desai',     author_role: 'CEO, dropAdrop',      service: 'App Development',        rating: 5, content: "They rebuilt our medication-reminder app in React Native and the reliability jump was night and day. Highly recommend.", created_at: '2025-08-03' },
  { id: 'seed-3', author_name: "James O'Connor",  author_role: 'Operations Lead',     service: 'App Development',        rating: 5, content: "Fixed-quote, on-time delivery, and a staging environment from day one. Two years in, the codebase is still a joy to work with.", created_at: '2025-07-21' },
];

export default function Reviews() {
  const [items, setItems] = useState(SEED);
  const [open, setOpen]   = useState(false);

  const load = async () => {
    try {
      const { reviews } = await api('/reviews');
      const merged = [...(reviews || []), ...SEED].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setItems(merged);
    } catch (_) { /* keep seed */ }
  };

  useEffect(() => { load(); }, []);

  const avg = items.length
    ? (items.reduce((a, r) => a + Number(r.rating || 0), 0) / items.length).toFixed(1)
    : '0.0';

  return (
    <section id="reviews" className="reviews-section">
      <div className="container">
        <div className="section-header text-center">
          <p className="section-tagline text-gold">Client Reviews</p>
          <h2 className="section-title">What Our <span className="text-gold">Clients</span> Say</h2>
          <p className="section-desc">
            Honest feedback from the founders and teams we've built with.{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); setOpen(true); }} className="reviews-inline-link">
              Share your experience
            </a>.
          </p>
        </div>

        <div className="reviews-summary" aria-live="polite">
          <div className="reviews-summary-rating">
            <span className="reviews-avg-num">{avg}</span>
            <div className="reviews-avg-stars" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <i key={i} className={`fas fa-star${i < Math.round(avg) ? '' : ' empty'}`} />
              ))}
            </div>
          </div>
          <div className="reviews-summary-meta">
            <span>Based on <strong>{items.length}</strong> client reviews</span>
          </div>
          <button type="button" className="btn btn-primary reviews-write-btn" onClick={() => setOpen(true)}>
            <i className="fas fa-pen" /> Write a Review
          </button>
        </div>

        <div className="reviews-grid">
          {items.map((r) => (
            <article key={r.id} className="review-card">
              <i className="fas fa-quote-right review-card-quote" aria-hidden="true" />
              <div className="review-card-stars" aria-label={`Rated ${r.rating} out of 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <i key={i} className={`fas fa-star${i < r.rating ? '' : ' empty'}`} />
                ))}
              </div>
              <p className="review-card-text">{r.content}</p>
              <div className="review-card-footer">
                <div className="review-card-avatar" aria-hidden="true">{initials(r.author_name)}</div>
                <div className="review-card-meta">
                  <span className="review-card-name">{r.author_name}</span>
                  {r.author_role && <span className="review-card-role">{r.author_role}</span>}
                  {r.service && <span className="review-card-service">{r.service}</span>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {open && <ReviewModal onClose={() => setOpen(false)} onSubmitted={load} />}
    </section>
  );
}

function initials(name = '?') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function ReviewModal({ onClose, onSubmitted }) {
  const [form, setForm] = useState({
    author_name: '', author_role: '', service: '', rating: 0, content: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.author_name.trim())  return setError('Please enter your name.');
    if (form.rating < 1)           return setError('Please pick a star rating.');
    if (form.content.trim().length < 10) return setError('Please write at least 10 characters.');

    setSubmitting(true);
    try {
      await api('/reviews', { method: 'POST', body: form });
      setSubmitted(true);
      onSubmitted?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="review-modal open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="review-modal-inner">
        <button type="button" className="review-modal-close" onClick={onClose} aria-label="Close">
          <i className="fas fa-times" />
        </button>

        {submitted ? (
          <div className="review-success show">
            <i className="fas fa-check-circle" />
            <h3>Thanks for sharing!</h3>
            <p>Your review is pending moderation and will appear shortly.</p>
            <button type="button" className="btn btn-primary" onClick={onClose}>Close</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h3>Share your experience</h3>
            {error && <div className="review-error show">{error}</div>}

            <label>Your name
              <input value={form.author_name} maxLength={80}
                     onChange={(e) => setForm({ ...form, author_name: e.target.value })} />
            </label>
            <label>Role / company (optional)
              <input value={form.author_role} maxLength={120}
                     onChange={(e) => setForm({ ...form, author_role: e.target.value })} />
            </label>
            <label>Service used
              <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}>
                <option value="">Select...</option>
                {['App Development','Blockchain Development','Website Development','Game Development','Bot Development','Call System Setup','Decompile & Decryption'].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <label>Rating
              <div className="review-stars-input">
                {[1, 2, 3, 4, 5].map((v) => (
                  <i key={v}
                     className={`fas fa-star${v <= form.rating ? ' active' : ''}`}
                     onClick={() => setForm({ ...form, rating: v })}
                     style={{ cursor: 'pointer' }} />
                ))}
              </div>
            </label>
            <label>Review
              <textarea value={form.content} maxLength={1500} rows={5}
                        onChange={(e) => setForm({ ...form, content: e.target.value })} />
              <small>{form.content.length} / 1500</small>
            </label>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button type="button" className="btn" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Sending...' : 'Submit'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
