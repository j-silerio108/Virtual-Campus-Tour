// ─────────────────────────────────────────────
//  DePaul Virtual Campus Tour — viewer.js
//  Viewer adapter abstraction.
//
//  TourApp depends only on ViewerAdapter's
//  interface. To swap the 360° viewer library,
//  create a new adapter — do not touch TourApp.
// ─────────────────────────────────────────────

// ── Abstract base ──────────────────────────────────────────────────

class ViewerAdapter {
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

class PannellumAdapter extends ViewerAdapter {
  #instance = null;

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
          el.addEventListener('click', () => onNavigate(hs.sceneId));
        } else {
          el.addEventListener('click', () => onHotspotClick(hs.clickHandlerArgs));
        }
      });

      // Live pitch/yaw overlay for hotspot placement (dev helper)
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

      const container = document.getElementById(containerId);
      container.addEventListener('mousemove', () => {
        overlay.textContent =
          `pitch: ${this.#instance.getPitch().toFixed(2)}  yaw: ${this.#instance.getYaw().toFixed(2)}`;
      });
    });
  }

  destroy() {
    if (this.#instance) {
      this.#instance.destroy();
      this.#instance = null;
    }
  }

  getPitchYaw() {
    if (!this.#instance) return null;
    return {
      pitch: this.#instance.getPitch(),
      yaw:   this.#instance.getYaw()
    };
  }
}
