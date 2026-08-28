/**
 * Animation.js
 * ------------------------------------------------------------------
 * ZabCal logo-reveal animation.
 *
 * Style: small "GPA / book" tokens drop in and bounce, then get pulled
 * into the center and absorbed as the real graduation-cap logo pops in
 * (with a springy bounce), followed by a serif wordmark bouncing into
 * place under it.
 *
 * The graduation-cap shape below is traced directly, pixel-for-pixel,
 * from the reference logo image you provided (1000192874.png) via
 * potrace — it is the exact reference artwork, not a redrawn
 * approximation.
 *
 * USAGE
 * ------------------------------------------------------------------
 *   Add a container element:  <div id="zabcal-intro"></div>
 *   Load this file with a normal script tag, then:
 *
 *     const anim = new ZabCalIntro(document.getElementById('zabcal-intro'), {
 *       loop: true,        // replay after a hold
 *       holdMs: 1500,       // pause on the finished logo before looping
 *       background: '#ffffff'
 *     });
 *     anim.play();
 * ------------------------------------------------------------------
 */

(function (global) {
  'use strict';

  // Exact vector trace of the reference logo (graduation cap), including
  // potrace's native transform so the geometry matches the source PNG 1:1.
  const LOGO_VIEWBOX = '0 0 587.952297 369.392563';
  const LOGO_TRANSFORM = 'translate(-1.000000,370.412589) scale(0.100000,-0.100000)';
  const LOGO_PATH_TOP =
    'M2892 3702 c-18 -2 -126 -37 -240 -79 -114 -41 -362 -130 -552 -198 ' +
    '-190 -68 -482 -173 -650 -233 -168 -60 -483 -174 -700 -251 -217 -78 -460 ' +
    '-166 -539 -194 -164 -59 -201 -85 -201 -140 0 -67 18 -77 395 -228 193 -77 ' +
    '764 -306 1270 -509 506 -202 974 -390 1040 -416 119 -48 121 -49 230 -49 l110 ' +
    '1 1190 478 c655 263 1200 481 1213 484 l22 4 0 -468 0 -469 -47 -35 c-70 -52 ' +
    '-108 -130 -107 -224 0 -87 25 -147 84 -205 l42 -41 -62 -292 c-35 -161 -63 ' +
    '-312 -63 -335 0 -46 20 -84 60 -110 23 -15 56 -18 208 -21 203 -4 230 3 272 ' +
    '67 28 42 29 69 3 174 -11 45 -40 181 -65 302 l-44 220 39 38 c111 106 120 276 ' +
    '21 389 -21 24 -50 50 -65 57 l-26 14 2 525 3 524 44 18 c86 33 117 109 69 165 ' +
    '-24 27 -67 44 -643 250 -159 57 -429 154 -600 215 -170 62 -395 142 -500 180 ' +
    '-104 37 -284 101 -400 143 -493 177 -669 238 -696 242 -57 9 -84 11 -117 7z';
  const LOGO_PATH_BASE =
    'M1100 1181 c0 -446 3 -638 11 -662 102 -300 861 -509 1844 -509 916 ' +
    '1 1658 195 1798 471 l27 54 0 638 c0 409 -4 637 -10 637 -5 0 -83 -30 -172 ' +
    '-66 -90 -36 -341 -137 -558 -224 -217 -88 -506 -204 -641 -258 -136 -55 -271 ' +
    '-105 -300 -111 -69 -15 -239 -15 -310 0 -30 6 -418 157 -862 335 -444 178 ' +
    '-812 324 -817 324 -6 0 -10 -231 -10 -629z';

  // Small book icon, drawn as a simple open-book outline.
  const BOOK_PATH =
    'M12 4.2 C9.6 2.7 5.8 2.3 2.5 3.2 V18 c3.3 -0.9 7.1 -0.5 9.5 1 ' +
    'c2.4 -1.5 6.2 -1.9 9.5 -1 V3.2 C18.2 2.3 14.4 2.7 12 4.2 Z M12 4.2 V19.2';

  // Floating tokens that drop/bounce in before being absorbed into the logo.
  // ox/oy = landing offset from center (px, at a 260px-wide icon stage),
  // rot = slight resting tilt, delay = stagger in ms.
  const FLOATERS = [
    { type: 'text', label: '4.0', ox: -108, oy: -46, rot: -8, delay: 0 },
    { type: 'book', ox: 96, oy: -58, rot: 10, delay: 90 },
    { type: 'text', label: 'A+', ox: -118, oy: 40, rot: 6, delay: 170 },
    { type: 'book', ox: 104, oy: 34, rot: -12, delay: 260 },
    { type: 'text', label: 'GPA', ox: 0, oy: -92, rot: -4, delay: 340 },
    { type: 'text', label: '3.9', ox: 4, oy: 88, rot: 7, delay: 430 }
  ];

  let instanceCounter = 0;

  function svgEl(tag, attrs) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  }

  class ZabCalIntro {
    /**
     * @param {HTMLElement} container
     * @param {Object} opts
     * @param {boolean} opts.loop - replay the sequence after holdMs
     * @param {number} opts.holdMs - time to hold the finished logo before looping
     * @param {string} opts.background - page/card background behind the icon
     * @param {string} opts.ink - main icon/text color
     * @param {string} opts.subtitleColor - subtitle text color
     * @param {string} opts.title - main title text
     * @param {string} opts.subtitle - subtitle text
     * @param {Function} opts.onComplete - called once per play-through, at the end
     */
    constructor(container, opts = {}) {
      if (!container) throw new Error('ZabCalIntro: container element is required');
      this.container = container;
      this.opts = Object.assign({
        loop: false,
        holdMs: 1500,
        background: '#ffffff',
        ink: '#1a1464',
        subtitleColor: '#6b6a86',
        title: 'ZabCal',
        subtitle: 'SZABIST CGPA Calculator',
        onComplete: null
      }, opts);

      this.id = 'zci-' + (++instanceCounter);
      this._timeouts = [];
      this._build();
    }

    // ---- public API ---------------------------------------------------

    play() {
      this._clearTimers();
      this._reset();
      void this.root.offsetWidth; // force reflow before animating
      this._runTimeline();
      return this;
    }

    reset() {
      this._clearTimers();
      this._reset();
      return this;
    }

    destroy() {
      this._clearTimers();
      if (this.styleEl && this.styleEl.parentNode) this.styleEl.parentNode.removeChild(this.styleEl);
      if (this.root && this.root.parentNode) this.root.parentNode.removeChild(this.root);
    }

    // ---- internals ------------------------------------------------------

    _clearTimers() {
      this._timeouts.forEach(clearTimeout);
      this._timeouts = [];
    }

    _after(ms, fn) {
      this._timeouts.push(setTimeout(fn, ms));
    }

    _build() {
      const { id, opts } = this;

      const style = document.createElement('style');
      style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&display=swap');

        .${id}-root {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 340px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${opts.background};
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, sans-serif;
        }
        .${id}-stage { position: relative; width: min(90%, 480px); display: flex; flex-direction: column; align-items: center; }

        .${id}-icon-stage { position: relative; width: 260px; height: 260px; max-width: 55vw; max-height: 55vw; }

        .${id}-logo-wrap {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          transform: scale(0);
          opacity: 0;
        }
        .${id}-logo-wrap svg { width: 62%; height: 62%; display: block; overflow: visible; }
        .${id}-logo-wrap.bounce {
          animation: ${id}-logo-bounce 0.85s cubic-bezier(.34,1.56,.64,1) forwards;
        }

        .${id}-floaters { position: absolute; inset: 0; }
        .${id}-item-pos {
          position: absolute; left: 50%; top: 50%;
          transform: translate(-50%, -50%) translate(var(--ox), var(--oy));
          transition: transform .55s cubic-bezier(.4,0,.2,1), opacity .5s ease;
          opacity: 1;
        }
        .${id}-floaters.absorb .${id}-item-pos {
          transform: translate(-50%, -50%) translate(0, 0) scale(0.15);
          opacity: 0;
        }
        .${id}-item-bounce {
          transform: translateY(-260px) scale(.4) rotate(var(--rot));
          opacity: 0;
        }
        .${id}-floaters.drop .${id}-item-bounce {
          animation: ${id}-drop-bounce 0.85s cubic-bezier(.34,1.56,.64,1) forwards;
          animation-delay: var(--delay);
        }

        .${id}-chip {
          display: flex; align-items: center; justify-content: center;
          min-width: 40px; height: 26px; padding: 0 8px;
          border-radius: 8px;
          background: ${opts.ink};
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.2px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.18);
        }
        .${id}-book svg { width: 30px; height: 30px; display: block; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.18)); }

        .${id}-text { margin-top: 22px; text-align: center; }
        .${id}-title {
          font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
          font-size: clamp(26px, 7vw, 40px);
          font-weight: 800;
          color: ${opts.ink};
          letter-spacing: 0.3px;
          opacity: 0;
          transform: translateY(46px) scale(0.85);
        }
        .${id}-title.bounce {
          animation: ${id}-text-bounce 0.7s cubic-bezier(.34,1.56,.64,1) forwards;
        }
        .${id}-subtitle {
          margin-top: 6px;
          font-size: clamp(12px, 3vw, 15px);
          font-weight: 500;
          color: ${opts.subtitleColor};
          opacity: 0;
          transform: translateY(14px);
          transition: opacity .5s ease, transform .5s ease;
        }
        .${id}-subtitle.on { opacity: 1; transform: translateY(0); }

        @keyframes ${id}-drop-bounce {
          0%   { transform: translateY(-260px) scale(.4) rotate(var(--rot)); opacity: 0; }
          45%  { opacity: 1; }
          58%  { transform: translateY(0) scale(1.08) rotate(var(--rot)); opacity: 1; }
          72%  { transform: translateY(-16px) scale(0.95) rotate(var(--rot)); }
          85%  { transform: translateY(0) scale(1.03) rotate(var(--rot)); }
          94%  { transform: translateY(-5px) scale(0.99) rotate(var(--rot)); }
          100% { transform: translateY(0) scale(1) rotate(var(--rot)); opacity: 1; }
        }
        @keyframes ${id}-logo-bounce {
          0%   { transform: scale(0); opacity: 0; }
          50%  { transform: scale(1.18); opacity: 1; }
          68%  { transform: scale(0.9); }
          82%  { transform: scale(1.06); }
          93%  { transform: scale(0.98); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes ${id}-text-bounce {
          0%   { transform: translateY(46px) scale(0.85); opacity: 0; }
          55%  { transform: translateY(-10px) scale(1.04); opacity: 1; }
          75%  { transform: translateY(5px) scale(0.98); }
          90%  { transform: translateY(-3px) scale(1.01); }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
      this.styleEl = style;

      const root = document.createElement('div');
      root.className = `${id}-root`;
      root.innerHTML = `
        <div class="${id}-stage">
          <div class="${id}-icon-stage">
            <div class="${id}-floaters"></div>
            <div class="${id}-logo-wrap">
              <svg viewBox="${LOGO_VIEWBOX}">
                <g transform="${LOGO_TRANSFORM}" fill="${opts.ink}" stroke="none">
                  <path d="${LOGO_PATH_TOP}"></path>
                  <path d="${LOGO_PATH_BASE}"></path>
                </g>
              </svg>
            </div>
          </div>
          <div class="${id}-text">
            <div class="${id}-title">${opts.title}</div>
            <div class="${id}-subtitle">${opts.subtitle}</div>
          </div>
        </div>
      `;
      this.container.appendChild(root);
      this.root = root;

      // Build floating tokens (numbers + books).
      const floatersG = root.querySelector(`.${id}-floaters`);
      FLOATERS.forEach((f) => {
        const pos = document.createElement('div');
        pos.className = `${id}-item-pos`;
        pos.style.setProperty('--ox', f.ox + 'px');
        pos.style.setProperty('--oy', f.oy + 'px');

        const bounce = document.createElement('div');
        bounce.className = `${id}-item-bounce`;
        bounce.style.setProperty('--rot', f.rot + 'deg');
        bounce.style.setProperty('--delay', f.delay + 'ms');

        if (f.type === 'text') {
          bounce.innerHTML = `<div class="${id}-chip">${f.label}</div>`;
        } else {
          bounce.innerHTML = `<div class="${id}-book"><svg viewBox="0 0 24 24" fill="none" stroke="${opts.ink}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"><path d="${BOOK_PATH}"></path></svg></div>`;
        }

        pos.appendChild(bounce);
        floatersG.appendChild(pos);
      });

      this.floatersG = floatersG;
      this.logoWrap = root.querySelector(`.${id}-logo-wrap`);
      this.titleEl = root.querySelector(`.${id}-title`);
      this.subtitleEl = root.querySelector(`.${id}-subtitle`);
    }

    _reset() {
      this.floatersG.classList.remove('drop', 'absorb');
      this.logoWrap.classList.remove('bounce');
      this.titleEl.classList.remove('bounce');
      this.subtitleEl.classList.remove('on');

      // Restart CSS animations cleanly on replay.
      this.floatersG.querySelectorAll(`.${this.id}-item-bounce`).forEach((el) => {
        el.style.animation = 'none';
        void el.offsetWidth;
        el.style.animation = '';
      });
      this.logoWrap.style.animation = 'none';
      void this.logoWrap.offsetWidth;
      this.logoWrap.style.animation = '';
      this.titleEl.style.animation = 'none';
      void this.titleEl.offsetWidth;
      this.titleEl.style.animation = '';
    }

    _runTimeline() {
      const T = {
        dropStart: 0,      // tokens start dropping/bouncing in (staggered internally)
        absorbStart: 1500, // tokens converge into center + fade
        logoIn: 1550,      // logo bounces into place
        titleIn: 2450,     // serif wordmark bounces up
        subtitleIn: 2800,  // subtitle fades in
        doneAt: 3400
      };

      this._after(T.dropStart, () => this.floatersG.classList.add('drop'));
      this._after(T.absorbStart, () => this.floatersG.classList.add('absorb'));
      this._after(T.logoIn, () => this.logoWrap.classList.add('bounce'));
      this._after(T.titleIn, () => this.titleEl.classList.add('bounce'));
      this._after(T.subtitleIn, () => this.subtitleEl.classList.add('on'));
      this._after(T.doneAt, () => {
        if (typeof this.opts.onComplete === 'function') this.opts.onComplete();
        if (this.opts.loop) {
          this._after(this.opts.holdMs, () => this.play());
        }
      });
    }
  }

  global.ZabCalIntro = ZabCalIntro;
})(typeof window !== 'undefined' ? window : this);
