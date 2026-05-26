import { useState } from 'react';
import { api } from '../api/client.js';

const EMPTY = { name: '', email: '', phone: '', subject: '', message: '' };

export default function Contact() {
  const [form, setForm]       = useState(EMPTY);
  const [feedback, setFeedback] = useState({ kind: '', text: '' });
  const [busy, setBusy]       = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ kind: '', text: '' });
    setBusy(true);
    try {
      await api('/contact', { method: 'POST', body: form });
      setFeedback({ kind: 'success', text: "Thanks! We've received your message and will reply within 24 hours." });
      setForm(EMPTY);
    } catch (err) {
      setFeedback({ kind: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="page-section contact-section">
      <div className="container">
        <div className="section-header text-center">
          <p className="section-tagline text-gold">Get in touch</p>
          <h2 className="section-title">Tell us about your project</h2>
          <p className="section-desc">We reply within 24 hours, every weekday.</p>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            <h3>Reach us</h3>
            <p><i className="fas fa-envelope" /> technologycrystals6@gmail.com</p>
            <p><i className="fas fa-phone" /> +1 630 386 8098</p>
            <p><i className="fas fa-map-marker-alt" /> San Francisco, USA &nbsp;|&nbsp; Santiago de Compostela, Spain</p>
            <div className="footer-socials" style={{ marginTop: 16 }}>
              <a href="https://www.instagram.com/crystaltech777" aria-label="Instagram"><i className="fab fa-instagram" /></a>
              <a href="https://x.com/Crystaltechnol" aria-label="X"><i className="fab fa-x-twitter" /></a>
              <a href="https://t.me/Crystal_tech01" aria-label="Telegram"><i className="fab fa-telegram" /></a>
              <a href="https://www.tiktok.com/@crystal_tech100" aria-label="TikTok"><i className="fab fa-tiktok" /></a>
            </div>
          </div>

          <form className="crystal-contact-form" onSubmit={onSubmit}>
            <label>Name
              <input required value={form.name} maxLength={120}
                     onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <label>Email
              <input required type="email" value={form.email} maxLength={254}
                     onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </label>
            <label>Phone (optional)
              <input value={form.phone} maxLength={40}
                     onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </label>
            <label>Subject
              <input required value={form.subject} maxLength={200}
                     onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            </label>
            <label>Message
              <textarea required rows={6} value={form.message} maxLength={5000}
                        onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </label>

            {feedback.text && (
              <div className={`crystal-form-feedback ${feedback.kind}`}>{feedback.text}</div>
            )}
            <button type="submit" className="btn btn-primary submit-btn" disabled={busy}>
              {busy ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
