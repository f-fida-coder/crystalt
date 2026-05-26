import { useEffect, useRef, useState } from 'react';

export default function Counter({ to, suffix = '', duration = 1600 }) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!ref.current || started.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting || started.current) return;
          started.current = true;
          const start = performance.now();
          const tick = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setValue(Math.floor(to * eased));
            if (t < 1) requestAnimationFrame(tick); else setValue(to);
          };
          requestAnimationFrame(tick);
          obs.disconnect();
        });
      },
      { threshold: 0.4 },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to, duration]);

  return <strong ref={ref}>{value}{suffix}</strong>;
}
