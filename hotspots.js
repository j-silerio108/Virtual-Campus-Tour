// ─────────────────────────────────────────────
//  DePaul Virtual Campus Tour — hotspots.js
//  Hotspot renderer registry.
//
//  To add a new hotspot type, do NOT modify this
//  file. Instead:
//    1. Create a class that extends HotspotRenderer
//    2. Implement render(args) → HTML string
//    3. Call hotspotRegistry.register('yourKind', new YourRenderer())
//       before TourApp is initialised.
// ─────────────────────────────────────────────

import { t, escapeHtml } from './panel-templates.js';

// ── Abstract base ──────────────────────────────────────────────────

export class HotspotRenderer {
  /**
   * @param {object} args  The clickHandlerArgs from config.js
   * @returns {string}     HTML string to inject into the info panel
   */
  render(args) {
    throw new Error(`HotspotRenderer.render() not implemented for kind: "${args.kind}"`);
  }
}

// ── Built-in renderers ─────────────────────────────────────────────

export class VideoHotspotRenderer extends HotspotRenderer {
  render(args) {
    return `
      ${t.header(args.office)}
      ${t.badge('📹', 'Office Intro')}
      <div class="panel-video">
        <video controls>
          <source src="${escapeHtml(args.videoSrc)}" type="video/mp4">
          Your browser does not support video playback.
        </video>
      </div>
      ${t.description(args.description)}
      ${t.hours(args.hours)}
      ${t.contact(args.contact)}
    `;
  }
}

export class InfoHotspotRenderer extends HotspotRenderer {
  render(args) {
    return `
      ${t.header(args.office)}
      ${t.badge('ℹ️', 'Office Info')}
      ${t.description(args.description)}
      ${t.hours(args.hours)}
      ${t.contact(args.contact)}
    `;
  }
}

export class DirectionsHotspotRenderer extends HotspotRenderer {
  render(args) {
    const steps = args.directions.map(step => `<li>${escapeHtml(step)}</li>`).join('');
    return `
      ${t.header(args.office)}
      ${t.badge('🗺️', 'Directions')}
      <div class="panel-directions">
        <h4>From your current location</h4>
        <ol>${steps}</ol>
      </div>
    `;
  }
}

// ── Registry ───────────────────────────────────────────────────────

export class HotspotRendererRegistry {
  #renderers = new Map();

  /**
   * Register a renderer for a hotspot kind.
   * Returns `this` so calls can be chained.
   * @param {string}          kind
   * @param {HotspotRenderer} renderer
   */
  register(kind, renderer) {
    this.#renderers.set(kind, renderer);
    return this;
  }

  /**
   * Warn at startup about any hotspot kinds that have no registered renderer.
   * Call this once after all renderers are registered, before TourApp.init().
   * @param {object} config  TOUR_CONFIG
   */
  validate(scenes) {
    for (const [sceneId, scene] of Object.entries(scenes)) {
      for (const hs of scene.hotSpots ?? []) {
        if (hs.type !== 'info') continue;
        const kind = hs.clickHandlerArgs?.kind;
        if (!kind) continue; // already caught by viewer.js
        if (!this.#renderers.has(kind)) {
          console.warn(`Unknown hotspot kind "${kind}" in scene "${sceneId}" (text: "${hs.text}") — no renderer registered`);
        }
      }
    }
  }

  /**
   * Render a hotspot. Throws if no renderer is registered for args.kind.
   * @param {object} args
   * @returns {string} HTML string
   */
  render(args) {
    const renderer = this.#renderers.get(args.kind);
    if (!renderer) {
      throw new Error(
        `No renderer registered for hotspot kind: "${args.kind}". ` +
        `Call hotspotRegistry.register("${args.kind}", new YourRenderer()) before TourApp.init().`
      );
    }
    return renderer.render(args);
  }
}

// ── Singleton — pre-loaded with the three built-in types ──────────
export const hotspotRegistry = new HotspotRendererRegistry()
  .register('video',      new VideoHotspotRenderer())
  .register('info',       new InfoHotspotRenderer())
  .register('directions', new DirectionsHotspotRenderer());
