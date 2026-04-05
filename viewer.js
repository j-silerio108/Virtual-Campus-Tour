// ─────────────────────────────────────────────
//  DePaul Virtual Campus Tour — viewer.js
//  Viewer adapter abstraction.
//
//  TourApp depends only on ViewerAdapter's
//  interface. To swap the 360° viewer library,
//  create a new adapter — do not touch TourApp.
// ─────────────────────────────────────────────

import { DEBUG } from './config.js';

// ── Abstract base ──────────────────────────────────────────────────

export class ViewerAdapter {
  /**
   * Mount the viewer into the DOM.
   * @param {string}   containerId     ID of the mount element
   * @param {string}   panorama        Path to the panorama image
   * @param {Array}    hotSpots        Raw hotspot entries from config.js
   * @param {Function} onHotspotClick  Called with (args) when an info hotspot is clicked
   * @param {Function} onNavigate      Called with (sceneId) when a scene hotspot is clicked
   */
  mount(containerId, panorama, hotSpots, onHotspotClick, onNavigate) {
    throw new Error(`${this.constructor.name} must implement mount()`);
  }

  /**
   * Tear down the current viewer instance.
   */
  destroy() {
    throw new Error(`${this.constructor.name} must implement destroy()`);
  }
}

// ── Pannellum implementation ───────────────────────────────────────

export class PannellumAdapter extends ViewerAdapter {
  #instance          = null;
  #container         = null;
  #mouseMoveHandler  = null;
  #hotspotListeners  = [];   // [{el, handler}] — cleaned up on destroy

  mount(containerId, panorama, hotSpots, onHotspotClick, onNavigate) {
    // Build hotspots without clickHandlerFunc — Pannellum silently drops
    // hotspots when clickHandlerFunc is an inline function at init time.
    // Click handlers are attached manually via DOM after load instead.
    const builtHotspots = hotSpots.map((hs, i) => ({
      pitch:    hs.pitch,
      yaw:      hs.yaw,
      type:     'info',
      text:     hs.text,
      cssClass: `${hs.cssClass || 'hotspot-info'} hs-idx-${i}`
    }));

    this.#instance = pannellum.viewer(containerId, {
      type:         'equirectangular',
      panorama,
      autoLoad:     true,
      showControls: true,
      hotSpots:     builtHotspots
    });

    // Attach click handlers after Pannellum renders the hotspot elements.
    this.#instance.on('load', () => {
      hotSpots.forEach((hs, i) => {
        const el = document.querySelector(`.hs-idx-${i}`);
        if (!el) return;
        if (hs.type === 'scene') {
          const handler = () => onNavigate(hs.sceneId);
          el.addEventListener('click', handler);
          this.#hotspotListeners.push({ el, handler });
        } else if (hs.clickHandlerArgs) {
          const handler = () => onHotspotClick(hs.clickHandlerArgs);
          el.addEventListener('click', handler);
          this.#hotspotListeners.push({ el, handler });
        } else {
          console.warn(`Hotspot ${i} ("${hs.text}") has no clickHandlerArgs — click ignored`);
        }
      });

      // Live pitch/yaw overlay — only active when ?debug=true
      if (DEBUG) {
        let overlay = document.getElementById('pyw-overlay');
        if (!overlay) {
          overlay = document.createElement('div');
          overlay.id = 'pyw-overlay';
          overlay.style.cssText = [
            'position:fixed', 'bottom:12px', 'left:12px',
            'background:rgba(0,0,0,0.6)', 'color:#fff',
            'font:13px/1.4 monospace', 'padding:6px 10px',
            'border-radius:6px', 'z-index:9999', 'pointer-events:none'
          ].join(';');
          document.body.appendChild(overlay);
        }

        this.#container = document.getElementById(containerId);
        this.#mouseMoveHandler = () => {
          overlay.textContent =
            `pitch: ${this.#instance.getPitch().toFixed(2)}  yaw: ${this.#instance.getYaw().toFixed(2)}`;
        };
        this.#container.addEventListener('mousemove', this.#mouseMoveHandler);
      }
    });
  }

  destroy() {
    this.#hotspotListeners.forEach(({ el, handler }) => el.removeEventListener('click', handler));
    this.#hotspotListeners = [];

    if (this.#container && this.#mouseMoveHandler) {
      this.#container.removeEventListener('mousemove', this.#mouseMoveHandler);
      this.#mouseMoveHandler = null;
      this.#container = null;
    }
    if (this.#instance) {
      this.#instance.destroy();
      this.#instance = null;
    }
  }

}
