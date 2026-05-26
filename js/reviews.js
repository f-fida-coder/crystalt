/*
   Crystal Tech - Client Reviews
   Stores submitted reviews in Firebase Firestore so all visitors see them.
   Falls back to localStorage if Firebase isn't configured yet (so the page
   keeps working during setup). Seed testimonials always render.
*/
(function () {
    'use strict';

    const STORAGE_KEY = 'crystaltech.reviews.v1';
    const FIRESTORE_COLLECTION = 'reviews';

    const SEED_REVIEWS = [
        {
            id: 'seed-1',
            name: 'Marcus Holloway',
            role: 'Founder, BlockRoute',
            service: 'Blockchain Development',
            rating: 5,
            text: "Crystal Tech shipped our staking dApp in six weeks with weekly demos the whole way. Smart contracts were audit-ready out the box and the team actually understood our token economics. Best engineering partner we've worked with.",
            date: '2025-09-12',
            seeded: true
        },
        {
            id: 'seed-2',
            name: 'Priya Desai',
            role: 'CEO, dropAdrop',
            service: 'App Development',
            rating: 5,
            text: "They rebuilt our medication-reminder app from scratch in React Native and the reliability jump was night and day. Push notifications finally work, the UI is gorgeous, and we own every line of code. Highly recommend.",
            date: '2025-08-03',
            seeded: true
        },
        {
            id: 'seed-3',
            name: 'James O’Connor',
            role: 'Operations Lead, Drop Taxi',
            service: 'App Development',
            rating: 5,
            text: "Fixed-quote, on-time delivery, and the staging environment from day one made it easy to test with real drivers before launch. Two years in and the codebase they handed us is still a joy to work with.",
            date: '2025-07-21',
            seeded: true
        },
        {
            id: 'seed-4',
            name: 'Elena Ruiz',
            role: 'Marketing Director',
            service: 'Website Development',
            rating: 5,
            text: "Our new site loads instantly on mobile and our conversion rate climbed within the first month. The team was responsive on every revision and never disappeared between updates.",
            date: '2025-06-15',
            seeded: true
        },
        {
            id: 'seed-5',
            name: 'David Chen',
            role: 'Indie Game Studio',
            service: 'Game Development',
            rating: 4,
            text: "Helped us port a prototype to Unity and ship a playable demo for our Kickstarter. Communication was great and they pushed back on a few decisions that absolutely saved us scope-creep down the line.",
            date: '2025-05-09',
            seeded: true
        },
        {
            id: 'seed-6',
            name: 'Aisha Bello',
            role: 'Trading Desk Lead',
            service: 'Bot Development',
            rating: 5,
            text: "Built us a Telegram trading bot with proper risk controls and clean logging. Latency is sub-second and it has been running unattended for months. Would hire again in a heartbeat.",
            date: '2025-04-02',
            seeded: true
        }
    ];

    /* ---------- Firebase wiring ---------- */
    let db = null;
    let firebaseReady = false;
    let liveReviews = [];

    function firebaseConfigured() {
        const cfg = window.CRYSTAL_FIREBASE_CONFIG;
        if (!cfg) return false;
        if (typeof firebase === 'undefined' || !firebase.initializeApp) return false;
        // Detect default placeholder values from firebase-config.js
        if (!cfg.projectId || cfg.projectId === 'YOUR_PROJECT_ID') return false;
        if (!cfg.apiKey || cfg.apiKey === 'YOUR_API_KEY') return false;
        return true;
    }

    function initFirebase() {
        if (!firebaseConfigured()) return false;
        try {
            if (!firebase.apps.length) firebase.initializeApp(window.CRYSTAL_FIREBASE_CONFIG);
            db = firebase.firestore();
            firebaseReady = true;
            return true;
        } catch (e) {
            console.warn('[reviews] Firebase init failed, falling back to localStorage:', e);
            return false;
        }
    }

    function subscribeFirestore() {
        if (!firebaseReady) return;
        db.collection(FIRESTORE_COLLECTION)
            .orderBy('createdAt', 'desc')
            .limit(100)
            .onSnapshot(function (snap) {
                liveReviews = [];
                snap.forEach(function (doc) {
                    const data = doc.data() || {};
                    liveReviews.push({
                        id: doc.id,
                        name: data.name || 'Anonymous',
                        role: data.role || '',
                        service: data.service || '',
                        rating: Number(data.rating) || 0,
                        text: data.text || '',
                        date: data.date || (data.createdAt && data.createdAt.toDate
                            ? data.createdAt.toDate().toISOString().slice(0, 10)
                            : new Date().toISOString().slice(0, 10)),
                        seeded: false
                    });
                });
                renderReviews();
            }, function (err) {
                console.warn('[reviews] Firestore subscription error:', err);
            });
    }

    /* ---------- localStorage fallback ---------- */
    function loadStored() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (_e) {
            return [];
        }
    }

    function saveStored(list) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (_e) { /* ignore */ }
    }

    function getAllReviews() {
        const userReviews = firebaseReady ? liveReviews : loadStored();
        return userReviews.concat(SEED_REVIEWS);
    }

    /* ---------- rendering ---------- */
    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function initials(name) {
        const parts = String(name).trim().split(/\s+/).filter(Boolean);
        if (parts.length === 0) return '?';
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }

    function starsHtml(rating, total) {
        total = total || 5;
        let html = '';
        for (let i = 1; i <= total; i++) {
            const cls = i <= rating ? 'fas fa-star' : 'fas fa-star empty';
            html += '<i class="' + cls + '"></i>';
        }
        return html;
    }

    function avgStarsHtml(avg) {
        let html = '';
        for (let i = 1; i <= 5; i++) {
            if (avg >= i) html += '<i class="fas fa-star"></i>';
            else if (avg >= i - 0.5) html += '<i class="fas fa-star half"></i>';
            else html += '<i class="fas fa-star empty"></i>';
        }
        return html;
    }

    function formatDate(iso) {
        const d = new Date(iso);
        if (isNaN(d.getTime())) return '';
        return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }

    function renderReviews() {
        const grid = document.getElementById('reviews-grid');
        const avgEl = document.getElementById('reviews-avg');
        const avgStarsEl = document.getElementById('reviews-avg-stars');
        const countEl = document.getElementById('reviews-count');
        if (!grid) return;

        const reviews = getAllReviews().slice().sort(function (a, b) {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        if (countEl) countEl.textContent = String(reviews.length);

        if (reviews.length === 0) {
            grid.innerHTML = '<div class="reviews-empty">Be the first to leave a review.</div>';
            if (avgEl) avgEl.textContent = '0.0';
            if (avgStarsEl) avgStarsEl.innerHTML = avgStarsHtml(0);
            return;
        }

        const sum = reviews.reduce(function (acc, r) { return acc + (Number(r.rating) || 0); }, 0);
        const avg = sum / reviews.length;
        if (avgEl) avgEl.textContent = avg.toFixed(1);
        if (avgStarsEl) avgStarsEl.innerHTML = avgStarsHtml(avg);

        grid.innerHTML = reviews.map(function (r) {
            const name = escapeHtml(r.name || 'Anonymous');
            const role = r.role ? escapeHtml(r.role) : '';
            const service = r.service ? escapeHtml(r.service) : '';
            const text = escapeHtml(r.text || '');
            const dateLabel = r.date ? escapeHtml(formatDate(r.date)) : '';
            const rating = Math.max(0, Math.min(5, Math.round(Number(r.rating) || 0)));

            return ''
                + '<article class="review-card">'
                +     '<i class="fas fa-quote-right review-card-quote" aria-hidden="true"></i>'
                +     '<div class="review-card-stars" aria-label="Rated ' + rating + ' out of 5">' + starsHtml(rating) + '</div>'
                +     '<p class="review-card-text">' + text + '</p>'
                +     '<div class="review-card-footer">'
                +         '<div class="review-card-avatar" aria-hidden="true">' + escapeHtml(initials(name)) + '</div>'
                +         '<div class="review-card-meta">'
                +             '<span class="review-card-name">' + name + '</span>'
                +             (role ? '<span class="review-card-role">' + role + '</span>' : '')
                +             (service ? '<span class="review-card-service">' + service + '</span>' : '')
                +         '</div>'
                +         (dateLabel ? '<span class="review-card-date">' + dateLabel + '</span>' : '')
                +     '</div>'
                + '</article>';
        }).join('');
    }

    /* ---------- submission ---------- */
    function submitReview(review) {
        if (firebaseReady) {
            return db.collection(FIRESTORE_COLLECTION).add({
                name:      review.name,
                role:      review.role,
                service:   review.service,
                rating:    review.rating,
                text:      review.text,
                date:      review.date,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }).then(function () { /* onSnapshot will refresh the grid */ });
        }
        // Fallback: persist locally only
        const stored = loadStored();
        stored.unshift(review);
        saveStored(stored);
        renderReviews();
        return Promise.resolve();
    }

    /* ---------- modal + form ---------- */
    function setupModal() {
        const modal = document.getElementById('review-modal');
        const openBtns = [
            document.getElementById('write-review-btn'),
            document.getElementById('open-review-form')
        ].filter(Boolean);
        const closeBtn = document.getElementById('review-modal-close');
        const cancelBtn = document.getElementById('review-cancel');
        const successCloseBtn = document.getElementById('review-success-close');
        const form = document.getElementById('review-form');
        const submitBtn = document.getElementById('review-submit');
        const successPanel = document.getElementById('review-success');
        const errorEl = document.getElementById('review-error');
        const starsWrap = document.getElementById('review-stars-input');
        const ratingInput = document.getElementById('review-rating');
        const textArea = document.getElementById('review-text');
        const charNow = document.getElementById('review-char-now');

        if (!modal || !form) return;

        function open(e) {
            if (e) e.preventDefault();
            resetForm();
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            const firstInput = document.getElementById('review-name');
            if (firstInput) setTimeout(function () { firstInput.focus(); }, 50);
        }

        function close() {
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        function resetForm() {
            form.reset();
            form.style.display = '';
            successPanel.classList.remove('show');
            errorEl.classList.remove('show');
            errorEl.textContent = '';
            ratingInput.value = '0';
            updateStars(0);
            if (charNow) charNow.textContent = '0';
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Review';
        }

        function showError(msg) {
            errorEl.textContent = msg;
            errorEl.classList.add('show');
        }

        function updateStars(value) {
            const stars = starsWrap.querySelectorAll('.fa-star');
            stars.forEach(function (s) {
                const v = Number(s.getAttribute('data-value'));
                s.classList.toggle('active', v <= value);
                s.setAttribute('aria-checked', v === value ? 'true' : 'false');
            });
        }

        const stars = starsWrap.querySelectorAll('.fa-star');
        stars.forEach(function (star) {
            star.addEventListener('mouseenter', function () {
                updateStars(Number(star.getAttribute('data-value')));
            });
            star.addEventListener('mouseleave', function () {
                updateStars(Number(ratingInput.value) || 0);
            });
            star.addEventListener('click', function () {
                ratingInput.value = star.getAttribute('data-value');
                updateStars(Number(ratingInput.value));
            });
            star.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    ratingInput.value = star.getAttribute('data-value');
                    updateStars(Number(ratingInput.value));
                }
            });
        });

        if (textArea && charNow) {
            textArea.addEventListener('input', function () {
                charNow.textContent = String(textArea.value.length);
            });
        }

        openBtns.forEach(function (btn) { btn.addEventListener('click', open); });
        if (closeBtn) closeBtn.addEventListener('click', close);
        if (cancelBtn) cancelBtn.addEventListener('click', close);
        if (successCloseBtn) successCloseBtn.addEventListener('click', close);

        modal.addEventListener('click', function (e) {
            if (e.target === modal) close();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('open')) close();
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            errorEl.classList.remove('show');

            const name = document.getElementById('review-name').value.trim();
            const role = document.getElementById('review-role').value.trim();
            const service = document.getElementById('review-service').value;
            const text = textArea.value.trim();
            const rating = Number(ratingInput.value) || 0;

            if (!name) { showError('Please enter your name.'); return; }
            if (rating < 1 || rating > 5) { showError('Please select a star rating.'); return; }
            if (text.length < 10) { showError('Please write at least 10 characters in your review.'); return; }

            const review = {
                id: 'r-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
                name: name,
                role: role,
                service: service,
                rating: rating,
                text: text,
                date: new Date().toISOString().slice(0, 10),
                seeded: false
            };

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

            submitReview(review).then(function () {
                form.style.display = 'none';
                successPanel.classList.add('show');
            }).catch(function (err) {
                console.warn('[reviews] submit error:', err);
                showError('Could not submit your review. Please try again in a moment.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Review';
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        if (initFirebase()) {
            subscribeFirestore();
        }
        renderReviews();
        setupModal();
    });
})();
