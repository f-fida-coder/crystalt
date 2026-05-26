/* =====================================================
   Crystal Tech - Request New Project Module
   Floating "+" button + multi-step modal + email delivery
   =====================================================

   EMAIL SETUP (one-time, 5 minutes):
   ----------------------------------
   1. Create a free account at https://emailjs.com
   2. Add a service (Gmail recommended) and a template that uses these
      variables:  {{to_email}}     {{project_id}}    {{project_type}}
                  {{title}}        {{description}}   {{features}}
                  {{timeline}}     {{budget}}        {{name}}
                  {{email}}        {{phone}}         {{contact_method}}
      In the template's "To" field, use:  {{to_email}}
   3. Paste your IDs into the CONFIG block below.
   4. Add this line to the <head> of any HTML page (or all of them):
      <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>

   The form sends one copy to EACH address in TO_EMAILS and BCC_EMAILS.
   Hidden inboxes in BCC_EMAILS are never rendered in the page or exposed
   to other recipients (BCC in mailto, separate send in EmailJS).

   Until configured, the form falls back to opening the user's email client
   with the request pre-filled (mailto:) - the request still reaches you.
   ===================================================== */

(function () {
    'use strict';

    const CONFIG = {
        // Paste EmailJS credentials here when ready
        EMAILJS_PUBLIC_KEY: '',
        EMAILJS_SERVICE_ID: '',
        EMAILJS_TEMPLATE_ID: '',
        // Visible business inboxes (also shown in the website footer)
        TO_EMAILS: [
            'technologycrystals6@gmail.com',
            'crystaltech@crystaltechnologys.com'
        ],
        // Hidden BCC inboxes - never exposed in the UI, BCC'd in mailto / sent silently via EmailJS
        BCC_EMAILS: [
            'numericfida786@gmail.com'
        ]
    };

    const PROJECT_TYPES = [
        { value: 'app',        label: 'App Development',        icon: 'fa-mobile-screen' },
        { value: 'blockchain', label: 'Blockchain Development', icon: 'fa-link' },
        { value: 'website',    label: 'Website Development',    icon: 'fa-globe' },
        { value: 'game',       label: 'Game Development',       icon: 'fa-gamepad' },
        { value: 'bot',        label: 'Bot Development',        icon: 'fa-robot' },
        { value: 'call',       label: 'Call System Setup',      icon: 'fa-phone' },
        { value: 'decompile',  label: 'Decompile & Decryption', icon: 'fa-code' }
    ];

    const TOTAL_STEPS = 5; // 5 input steps + 1 confirmation screen
    let currentStep = 1;
    const formData = {
        projectType: '',
        title: '',
        description: '',
        features: '',
        timeline: '',
        budget: '',
        name: '',
        email: '',
        phone: '',
        contactMethod: 'email'
    };

    // ---------- Markup ----------
    function buildMarkup() {
        const typeButtons = PROJECT_TYPES.map(t => `
            <button type="button" class="rp-type-card" data-value="${t.value}">
                <i class="fas ${t.icon}"></i>
                <span>${t.label}</span>
            </button>
        `).join('');

        const html = `
        <button type="button" class="rp-fab" aria-label="Request a new project">
            <i class="fas fa-plus"></i>
            <span class="rp-fab-text">Request Project</span>
        </button>

        <div class="rp-overlay" aria-hidden="true">
            <div class="rp-modal" role="dialog" aria-modal="true" aria-labelledby="rp-title">
                <button type="button" class="rp-close" aria-label="Close">
                    <i class="fas fa-times"></i>
                </button>

                <div class="rp-header">
                    <p class="rp-tagline">Start Your Project</p>
                    <h2 id="rp-title">Request a New Project</h2>
                    <div class="rp-progress">
                        <div class="rp-progress-bar"></div>
                    </div>
                    <div class="rp-step-indicator">Step <span class="rp-current">1</span> of ${TOTAL_STEPS}</div>
                </div>

                <div class="rp-body">

                    <div class="rp-step" data-step="1">
                        <h3>What type of project do you need?</h3>
                        <p class="rp-help">Pick the closest match - you can describe specifics next.</p>
                        <div class="rp-type-grid">${typeButtons}</div>
                    </div>

                    <div class="rp-step" data-step="2">
                        <h3>Tell us about your project</h3>
                        <p class="rp-help">A clear description helps us scope an accurate quote.</p>
                        <label class="rp-label">Project title</label>
                        <input type="text" class="rp-input" name="title" placeholder="e.g. Crypto wallet mobile app" maxlength="120">
                        <label class="rp-label">Description</label>
                        <textarea class="rp-textarea" name="description" placeholder="What should it do? Who is it for?" maxlength="2000" rows="5"></textarea>
                        <label class="rp-label">Key features (comma separated)</label>
                        <input type="text" class="rp-input" name="features" placeholder="e.g. login, payments, push notifications" maxlength="500">
                    </div>

                    <div class="rp-step" data-step="3">
                        <h3>Timeline &amp; budget</h3>
                        <p class="rp-help">Rough estimates are fine - we'll confirm during scoping.</p>
                        <label class="rp-label">Desired timeline</label>
                        <select class="rp-input" name="timeline">
                            <option value="">Select timeline...</option>
                            <option>ASAP (within 2 weeks)</option>
                            <option>1 month</option>
                            <option>2-3 months</option>
                            <option>3-6 months</option>
                            <option>Flexible</option>
                        </select>
                        <label class="rp-label">Estimated budget (USD)</label>
                        <select class="rp-input" name="budget">
                            <option value="">Select budget...</option>
                            <option>Under $500</option>
                            <option>$500 - $1,500</option>
                            <option>$1,500 - $5,000</option>
                            <option>$5,000 - $15,000</option>
                            <option>$15,000+</option>
                            <option>Not sure yet</option>
                        </select>
                    </div>

                    <div class="rp-step" data-step="4">
                        <h3>How can we reach you?</h3>
                        <p class="rp-help">We'll respond within 24 hours.</p>
                        <label class="rp-label">Full name</label>
                        <input type="text" class="rp-input" name="name" placeholder="Your name" maxlength="100">
                        <label class="rp-label">Email</label>
                        <input type="email" class="rp-input" name="email" placeholder="you@example.com" maxlength="150">
                        <label class="rp-label">Phone (optional)</label>
                        <input type="tel" class="rp-input" name="phone" placeholder="+1 555 123 4567" maxlength="40">
                        <label class="rp-label">Preferred contact method</label>
                        <div class="rp-radio-group">
                            <label class="rp-radio"><input type="radio" name="contactMethod" value="email" checked> Email</label>
                            <label class="rp-radio"><input type="radio" name="contactMethod" value="phone"> Phone</label>
                            <label class="rp-radio"><input type="radio" name="contactMethod" value="whatsapp"> WhatsApp</label>
                            <label class="rp-radio"><input type="radio" name="contactMethod" value="telegram"> Telegram</label>
                        </div>
                    </div>

                    <div class="rp-step" data-step="5">
                        <h3>Review your request</h3>
                        <p class="rp-help">Double-check before submitting.</p>
                        <div class="rp-review"></div>
                    </div>

                    <div class="rp-step rp-step-confirm" data-step="6">
                        <div class="rp-success-icon"><i class="fas fa-check"></i></div>
                        <h3>Request received!</h3>
                        <p class="rp-help">Save this project ID - we'll reference it in our reply.</p>
                        <div class="rp-project-id">
                            <span class="rp-id-label">Your project ID</span>
                            <span class="rp-id-value"></span>
                            <button type="button" class="rp-copy" title="Copy"><i class="fas fa-copy"></i></button>
                        </div>
                        <p class="rp-confirm-msg">A copy has been sent to your email. We'll be in touch within 24 hours.</p>
                    </div>

                </div>

                <div class="rp-footer">
                    <button type="button" class="rp-btn rp-back">Back</button>
                    <button type="button" class="rp-btn rp-btn-primary rp-next">Next</button>
                    <button type="button" class="rp-btn rp-btn-primary rp-submit">Submit Request</button>
                    <button type="button" class="rp-btn rp-btn-primary rp-done">Done</button>
                </div>
            </div>
        </div>`;

        const wrap = document.createElement('div');
        wrap.innerHTML = html;
        while (wrap.firstChild) document.body.appendChild(wrap.firstChild);
    }

    // ---------- Step navigation ----------
    function updateView() {
        const modal = document.querySelector('.rp-modal');
        modal.querySelectorAll('.rp-step').forEach(el => {
            el.classList.toggle('active', Number(el.dataset.step) === currentStep);
        });

        const percent = currentStep <= TOTAL_STEPS
            ? (currentStep / TOTAL_STEPS) * 100
            : 100;
        modal.querySelector('.rp-progress-bar').style.width = percent + '%';
        modal.querySelector('.rp-current').textContent = Math.min(currentStep, TOTAL_STEPS);

        const isConfirm = currentStep === 6;
        const isReview = currentStep === 5;
        modal.querySelector('.rp-back').style.display = (currentStep === 1 || isConfirm) ? 'none' : 'inline-flex';
        modal.querySelector('.rp-next').style.display = (isReview || isConfirm) ? 'none' : 'inline-flex';
        modal.querySelector('.rp-submit').style.display = isReview ? 'inline-flex' : 'none';
        modal.querySelector('.rp-done').style.display = isConfirm ? 'inline-flex' : 'none';
        modal.querySelector('.rp-step-indicator').style.visibility = isConfirm ? 'hidden' : 'visible';
    }

    function validateStep() {
        if (currentStep === 1 && !formData.projectType) {
            return 'Please pick a project type.';
        }
        if (currentStep === 2) {
            if (!formData.title.trim()) return 'Project title is required.';
            if (!formData.description.trim() || formData.description.trim().length < 10) {
                return 'Please add a description (at least 10 characters).';
            }
        }
        if (currentStep === 3) {
            if (!formData.timeline) return 'Please select a timeline.';
            if (!formData.budget) return 'Please select a budget range.';
        }
        if (currentStep === 4) {
            if (!formData.name.trim()) return 'Name is required.';
            if (!isValidEmail(formData.email)) return 'A valid email is required.';
        }
        return null;
    }

    function isValidEmail(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || '').trim());
    }

    function showError(msg) {
        const modal = document.querySelector('.rp-modal');
        let err = modal.querySelector('.rp-error');
        if (!err) {
            err = document.createElement('div');
            err.className = 'rp-error';
            modal.querySelector('.rp-footer').before(err);
        }
        err.textContent = msg;
        err.classList.add('show');
        clearTimeout(showError._t);
        showError._t = setTimeout(() => err.classList.remove('show'), 4000);
    }

    function buildReview() {
        const type = PROJECT_TYPES.find(t => t.value === formData.projectType);
        const rows = [
            ['Project type', type ? type.label : '-'],
            ['Title', formData.title],
            ['Description', formData.description],
            ['Key features', formData.features || '-'],
            ['Timeline', formData.timeline],
            ['Budget', formData.budget],
            ['Name', formData.name],
            ['Email', formData.email],
            ['Phone', formData.phone || '-'],
            ['Preferred contact', formData.contactMethod]
        ];
        const html = rows.map(([k, v]) => `
            <div class="rp-review-row">
                <span class="rp-review-key">${k}</span>
                <span class="rp-review-val">${escapeHtml(v)}</span>
            </div>
        `).join('');
        document.querySelector('.rp-review').innerHTML = html;
    }

    function escapeHtml(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function generateProjectId() {
        // 6-digit ID seeded with timestamp to reduce collision odds across browsers
        const ts = Date.now() % 1000;            // 0-999
        const rnd = Math.floor(Math.random() * 900); // 0-899
        return '#' + (100000 + ts * 900 + rnd);
    }

    // ---------- Submission ----------
    function buildEmailPayload(projectId) {
        const type = PROJECT_TYPES.find(t => t.value === formData.projectType);
        return {
            project_id: projectId,
            project_type: type ? type.label : formData.projectType,
            title: formData.title,
            description: formData.description,
            features: formData.features || '-',
            timeline: formData.timeline,
            budget: formData.budget,
            name: formData.name,
            email: formData.email,
            phone: formData.phone || '-',
            contact_method: formData.contactMethod
        };
    }

    function buildEmailBody(p) {
        return [
            `New project request ${p.project_id}`,
            '',
            `Project type:    ${p.project_type}`,
            `Title:           ${p.title}`,
            `Description:     ${p.description}`,
            `Key features:    ${p.features}`,
            `Timeline:        ${p.timeline}`,
            `Budget:          ${p.budget}`,
            '',
            '--- Contact ---',
            `Name:            ${p.name}`,
            `Email:           ${p.email}`,
            `Phone:           ${p.phone}`,
            `Preferred:       ${p.contact_method}`
        ].join('\n');
    }

    async function sendEmail(projectId) {
        const payload = buildEmailPayload(projectId);
        const allRecipients = [...CONFIG.TO_EMAILS, ...CONFIG.BCC_EMAILS];
        const configured = CONFIG.EMAILJS_PUBLIC_KEY && CONFIG.EMAILJS_SERVICE_ID && CONFIG.EMAILJS_TEMPLATE_ID;

        if (configured && typeof window.emailjs !== 'undefined') {
            try {
                window.emailjs.init({ publicKey: CONFIG.EMAILJS_PUBLIC_KEY });
                // One call per recipient so all 3 inboxes receive the request silently.
                // The hidden inbox is never exposed in the page.
                await Promise.all(allRecipients.map(to_email =>
                    window.emailjs.send(CONFIG.EMAILJS_SERVICE_ID, CONFIG.EMAILJS_TEMPLATE_ID, {
                        ...payload,
                        to_email
                    })
                ));
                return { method: 'emailjs' };
            } catch (e) {
                console.warn('EmailJS failed, falling back to mailto:', e);
            }
        }

        // mailto fallback - opens the user's email client with everything pre-filled.
        // Visible inboxes go in `to`; hidden inboxes go in `bcc` so other recipients can't see them.
        const subject = encodeURIComponent(`New Project Request ${projectId} - ${payload.title}`);
        const body = encodeURIComponent(buildEmailBody(payload));
        const to = CONFIG.TO_EMAILS.join(',');
        const params = [`subject=${subject}`, `body=${body}`];
        if (CONFIG.BCC_EMAILS.length) {
            params.unshift(`bcc=${encodeURIComponent(CONFIG.BCC_EMAILS.join(','))}`);
        }
        window.location.href = `mailto:${to}?${params.join('&')}`;
        return { method: 'mailto' };
    }

    function saveLocally(projectId) {
        try {
            const key = 'crystal_tech_requests';
            const existing = JSON.parse(localStorage.getItem(key) || '[]');
            existing.push({
                id: projectId,
                submittedAt: new Date().toISOString(),
                ...formData
            });
            localStorage.setItem(key, JSON.stringify(existing));
        } catch (e) {
            // localStorage may be disabled - that's OK, the email still goes through
        }
    }

    // ---------- Open/close ----------
    function openModal() {
        const overlay = document.querySelector('.rp-overlay');
        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        const overlay = document.querySelector('.rp-overlay');
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function resetForm() {
        currentStep = 1;
        Object.keys(formData).forEach(k => { formData[k] = (k === 'contactMethod') ? 'email' : ''; });
        const modal = document.querySelector('.rp-modal');
        modal.querySelectorAll('.rp-input, .rp-textarea').forEach(el => el.value = '');
        modal.querySelectorAll('.rp-type-card').forEach(c => c.classList.remove('selected'));
        const emailRadio = modal.querySelector('input[name="contactMethod"][value="email"]');
        if (emailRadio) emailRadio.checked = true;
        updateView();
    }

    // ---------- Wiring ----------
    function wire() {
        const modal = document.querySelector('.rp-modal');
        const overlay = document.querySelector('.rp-overlay');

        document.querySelector('.rp-fab').addEventListener('click', () => {
            resetForm();
            openModal();
        });

        modal.querySelector('.rp-close').addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('active')) closeModal();
        });

        // Project type selection
        modal.querySelectorAll('.rp-type-card').forEach(card => {
            card.addEventListener('click', () => {
                modal.querySelectorAll('.rp-type-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                formData.projectType = card.dataset.value;
            });
        });

        // Input binding
        const bindings = ['title', 'description', 'features', 'timeline', 'budget', 'name', 'email', 'phone'];
        bindings.forEach(field => {
            const el = modal.querySelector(`[name="${field}"]`);
            if (el) el.addEventListener('input', () => { formData[field] = el.value; });
            if (el && el.tagName === 'SELECT') el.addEventListener('change', () => { formData[field] = el.value; });
        });

        modal.querySelectorAll('input[name="contactMethod"]').forEach(r => {
            r.addEventListener('change', () => {
                if (r.checked) formData.contactMethod = r.value;
            });
        });

        // Next / Back
        modal.querySelector('.rp-next').addEventListener('click', () => {
            const err = validateStep();
            if (err) { showError(err); return; }
            if (currentStep < TOTAL_STEPS) {
                currentStep++;
                if (currentStep === 5) buildReview();
                updateView();
            }
        });

        modal.querySelector('.rp-back').addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                updateView();
            }
        });

        // Submit
        modal.querySelector('.rp-submit').addEventListener('click', async () => {
            const submitBtn = modal.querySelector('.rp-submit');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

            const projectId = generateProjectId();
            saveLocally(projectId);

            try {
                await sendEmail(projectId);
            } catch (e) {
                console.error(e);
            }

            modal.querySelector('.rp-id-value').textContent = projectId;
            currentStep = 6;
            updateView();

            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Submit Request';
        });

        modal.querySelector('.rp-done').addEventListener('click', closeModal);

        // Copy project ID
        modal.querySelector('.rp-copy').addEventListener('click', () => {
            const id = modal.querySelector('.rp-id-value').textContent;
            const copyBtn = modal.querySelector('.rp-copy');
            navigator.clipboard?.writeText(id).then(() => {
                copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => { copyBtn.innerHTML = '<i class="fas fa-copy"></i>'; }, 1500);
            });
        });
    }

    // ---------- Contact form (contact.html) ----------
    // Reuses the same TO_EMAILS + BCC_EMAILS pipeline as the request-project modal.
    function wireContactForm() {
        const form = document.getElementById('crystal-contact-form');
        if (!form) return;
        const feedback = form.querySelector('.crystal-form-feedback');
        const submitBtn = form.querySelector('.submit-btn');
        const origLabel = submitBtn ? submitBtn.textContent : 'Send Message';

        function setFeedback(kind, msg) {
            if (!feedback) return;
            feedback.className = 'crystal-form-feedback ' + kind;
            feedback.textContent = msg;
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
                name: form.name.value.trim(),
                phone: form.phone.value.trim(),
                email: form.email.value.trim(),
                subject: form.subject.value.trim(),
                message: form.message.value.trim()
            };

            if (!data.name) return setFeedback('error', 'Please add your name.');
            if (!isValidEmail(data.email)) return setFeedback('error', 'A valid email is required.');
            if (!data.subject) return setFeedback('error', 'Please add a subject.');
            if (!data.message || data.message.length < 10) return setFeedback('error', 'Please write a message (at least 10 characters).');

            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            setFeedback('info', '');

            const allRecipients = [...CONFIG.TO_EMAILS, ...CONFIG.BCC_EMAILS];
            const configured = CONFIG.EMAILJS_PUBLIC_KEY && CONFIG.EMAILJS_SERVICE_ID && CONFIG.EMAILJS_TEMPLATE_ID;

            if (configured && typeof window.emailjs !== 'undefined') {
                try {
                    window.emailjs.init({ publicKey: CONFIG.EMAILJS_PUBLIC_KEY });
                    await Promise.all(allRecipients.map(to_email =>
                        window.emailjs.send(CONFIG.EMAILJS_SERVICE_ID, CONFIG.EMAILJS_TEMPLATE_ID, {
                            ...data,
                            to_email,
                            project_id: 'CONTACT-FORM',
                            project_type: 'General inquiry',
                            title: data.subject,
                            description: data.message,
                            features: '-',
                            timeline: '-',
                            budget: '-',
                            contact_method: 'email'
                        })
                    ));
                    setFeedback('success', "Thanks! We've received your message and will reply within 24 hours.");
                    form.reset();
                    submitBtn.disabled = false;
                    submitBtn.textContent = origLabel;
                    return;
                } catch (err) {
                    console.warn('EmailJS failed, falling back to mailto:', err);
                }
            }

            // Fallback: open the user's mail client with everything pre-filled.
            const subject = encodeURIComponent(`[Contact Form] ${data.subject}`);
            const body = encodeURIComponent([
                `Name:    ${data.name}`,
                `Email:   ${data.email}`,
                `Phone:   ${data.phone || '-'}`,
                `Subject: ${data.subject}`,
                '',
                data.message
            ].join('\n'));
            const to = CONFIG.TO_EMAILS.join(',');
            const params = [`subject=${subject}`, `body=${body}`];
            if (CONFIG.BCC_EMAILS.length) {
                params.unshift(`bcc=${encodeURIComponent(CONFIG.BCC_EMAILS.join(','))}`);
            }
            window.location.href = `mailto:${to}?${params.join('&')}`;
            setFeedback('success', 'Your email client is opening with your message - just hit send to complete.');
            submitBtn.disabled = false;
            submitBtn.textContent = origLabel;
        });
    }

    // ---------- Sticky bottom CTA (service pages) ----------
    function wireStickyCta() {
        const bar = document.getElementById('sticky-cta');
        if (!bar) return;

        const STORAGE_KEY = 'crystal_sticky_cta_dismissed';
        let dismissed = false;
        try { dismissed = sessionStorage.getItem(STORAGE_KEY) === '1'; } catch (_) {}

        const closeBtn = bar.querySelector('.sticky-cta-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                bar.classList.remove('show');
                document.body.classList.remove('sticky-cta-visible');
                dismissed = true;
                try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch (_) {}
            });
        }

        function update() {
            if (dismissed) return;
            const scrolled = window.scrollY;
            const total = document.documentElement.scrollHeight - window.innerHeight;
            const nearBottom = total > 0 && (total - scrolled) < 200;
            const past = scrolled > 700;
            const shouldShow = past && !nearBottom;
            bar.classList.toggle('show', shouldShow);
            // Add body class so older browsers without :has() still reposition FAB/WhatsApp
            document.body.classList.toggle('sticky-cta-visible', shouldShow);
        }
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        update();
    }

    // ---------- Phase 3: Typed hero text ----------
    function wireTypedHero() {
        const el = document.querySelector('.hero-typed');
        if (!el) return;
        const words = (el.dataset.words || '').split(',').map(w => w.trim()).filter(Boolean);
        if (words.length < 2) return;
        let i = 0;
        const cycle = () => {
            el.classList.add('hero-typed-out');
            setTimeout(() => {
                i = (i + 1) % words.length;
                el.textContent = words[i];
                el.classList.remove('hero-typed-out');
                el.classList.add('hero-typed-in');
                setTimeout(() => el.classList.remove('hero-typed-in'), 500);
            }, 380);
        };
        setInterval(cycle, 2400);
    }

    // ---------- Phase 3: Counter animation ----------
    function wireCounters() {
        const targets = document.querySelectorAll('[data-counter]');
        if (!targets.length || typeof IntersectionObserver === 'undefined') {
            // Fallback: just write the final number
            targets.forEach(el => {
                el.textContent = (el.dataset.counter || '0') + (el.dataset.suffix || '');
            });
            return;
        }
        const animate = (el) => {
            const target = parseInt(el.dataset.counter, 10) || 0;
            const suffix = el.dataset.suffix || '';
            const duration = 1600;
            const start = performance.now();
            const tick = (now) => {
                const t = Math.min(1, (now - start) / duration);
                const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
                el.textContent = Math.floor(target * eased) + suffix;
                if (t < 1) requestAnimationFrame(tick);
                else el.textContent = target + suffix;
            };
            requestAnimationFrame(tick);
        };
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.counted) {
                    entry.target.dataset.counted = '1';
                    animate(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });
        targets.forEach(el => obs.observe(el));
    }

    // ---------- Phase 3: Page-transition fade ----------
    function wirePageTransition() {
        if (document.documentElement.classList.contains('page-leaving')) return;
        document.documentElement.classList.add('page-entering');
        requestAnimationFrame(() => {
            requestAnimationFrame(() => document.documentElement.classList.remove('page-entering'));
        });

        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;
            const href = link.getAttribute('href');
            if (!href) return;
            // Skip external, hash-only, mailto/tel/wa, target=_blank
            if (link.target === '_blank') return;
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
            if (/^(#|mailto:|tel:|https?:|wa\.me|sms:)/i.test(href)) return;
            if (link.dataset.noTransition !== undefined) return;
            // Same-page anchor?
            if (href.startsWith('#')) return;
            // Same-page link with a hash?
            const url = new URL(href, location.href);
            if (url.pathname === location.pathname && url.hash) return;
            // Internal HTML link - do the fade
            if (!url.pathname.endsWith('.html') && url.pathname !== '/') return;
            e.preventDefault();
            document.documentElement.classList.add('page-leaving');
            setTimeout(() => { window.location.href = href; }, 220);
        });
    }

    // ---------- Phase 3: Splash screen ----------
    function wireSplash() {
        const splash = document.getElementById('crystal-splash');
        if (!splash) return;
        // Only show once per session
        try {
            if (sessionStorage.getItem('crystal_splash_shown') === '1') {
                splash.remove();
                return;
            }
            sessionStorage.setItem('crystal_splash_shown', '1');
        } catch (_) {}
        const hide = () => {
            splash.classList.add('splash-hidden');
            setTimeout(() => splash.remove(), 600);
        };
        if (document.readyState === 'complete') {
            setTimeout(hide, 700);
        } else {
            window.addEventListener('load', () => setTimeout(hide, 600));
            setTimeout(hide, 2500); // safety
        }
    }

    function init() {
        // Avoid double-init if script is included twice
        if (document.querySelector('.rp-fab')) {
            wireContactForm();
            wireStickyCta();
            wireTypedHero();
            wireCounters();
            wirePageTransition();
            wireSplash();
            return;
        }
        buildMarkup();
        wire();
        updateView();
        wireContactForm();
        wireStickyCta();
        wireTypedHero();
        wireCounters();
        wirePageTransition();
        wireSplash();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
