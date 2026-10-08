'use client';

import { useEffect, useRef } from 'react';

const counts = { stethoscope: 83, consultation: 96, guidance: 96, care: 96, team: 96 };
const frameUrl = (name, index) => `/frames/${name}/${String(index + 1).padStart(3, '0')}.webp`;

export default function FrameSequence({ name, sectionRef, hero = false, className = '', label }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const section = sectionRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    const images = new Map();
    const requested = new Set();
    let disposed = false, active = false, pending = 0, target = 0, raf = 0, lastFrame = -1;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let count = counts[name];

    function paint() {
      if (disposed || !images.size) return;
      let nearest = target;
      if (!images.has(nearest)) nearest = [...images.keys()].reduce((a, b) => Math.abs(b - target) < Math.abs(a - target) ? b : a);
      if (nearest === lastFrame) return;
      const img = images.get(nearest);
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const w = img.width * scale, h = img.height * scale;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
      lastFrame = nearest;
      canvas.style.opacity = '1';
      wrap.dataset.frame = String(nearest);
    }

    function pump() {
      if (disposed || (!active && requested.size)) return;
      if (reduced.matches && requested.has(0)) return;
      while (pending < 4 && requested.size < count) {
        let next = -1;
        for (let offset = 0; offset <= 16; offset++) {
          for (const i of [target + offset, target - offset]) {
            if (i >= 0 && i < count && !requested.has(i)) { next = i; break; }
          }
          if (next >= 0) break;
        }
        if (next < 0) break;
        requested.add(next); pending++;
        const img = new Image();
        img.onload = () => { pending--; if (disposed) return; images.set(next, img); paint(); if (!reduced.matches) pump(); };
        img.onerror = () => { pending--; if (!disposed && !reduced.matches) pump(); };
        img.src = frameUrl(name, next);
        if (reduced.matches) break;
      }
    }

    function update() {
      raf = 0;
      if (disposed) return;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = hero
        ? Math.max(0, Math.min(1, (84 - rect.top) / Math.max(1, rect.height - vh + 84)))
        : Math.max(0, Math.min(1, (vh * .8 - rect.top) / (rect.height + vh * .15)));
      target = reduced.matches ? 0 : Math.round(progress * (count - 1));
      for (const index of images.keys()) {
        if (Math.abs(index - target) > 20 && index !== lastFrame) {
          images.delete(index); requested.delete(index);
        }
      }
      section.style.setProperty('--progress', String(progress));
      paint();
      if (active) pump();
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const resize = new ResizeObserver(() => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(wrap.clientWidth * ratio);
      canvas.height = Math.round(wrap.clientHeight * ratio);
      lastFrame = -1; update();
    });
    resize.observe(wrap);
    const observer = new IntersectionObserver(entries => {
      active = entries[0].isIntersecting;
      if (active) { update(); pump(); }
      else {
        for (const index of images.keys()) {
          if (index !== lastFrame) { images.delete(index); requested.delete(index); }
        }
      }
    }, { rootMargin: '400px' });
    observer.observe(wrap);
    fetch('/frames/manifest.json').then(r => r.json()).then(manifest => { if (!disposed) { count = manifest[name].count; update(); } }).catch(() => {});
    window.addEventListener('scroll', onScroll, { passive: true });
    reduced.addEventListener('change', onScroll);
    return () => {
      disposed = true; cancelAnimationFrame(raf); resize.disconnect(); observer.disconnect();
      window.removeEventListener('scroll', onScroll); reduced.removeEventListener('change', onScroll);
      images.clear();
    };
  }, [name, hero, sectionRef]);

  return <div className={`frame-sequence ${className}`} ref={wrapRef} role="img" aria-label={label} data-sequence={name}>
    {/* The first frame remains visible while subsequent frames load. */}
    <img className="sequence-poster" src={frameUrl(name, 0)} alt="" loading={hero ? 'eager' : 'lazy'} fetchPriority={hero ? 'high' : 'auto'} />
    <canvas ref={canvasRef} aria-hidden="true" />
  </div>;
}
