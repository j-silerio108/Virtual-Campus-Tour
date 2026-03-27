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

// Module-scoped helper — shared by all renderers without exposing it
// on any class prototype. Private fields can't be inherited, so this
// is the correct place for shared pure utilities.
function officeHeader(args) {
  return `<div class="panel-office-name">${args.office}</div>`;
}

// ── Abstract base ──────────────────────────────────────────────────

class HotspotRenderer {
  /**
   * @param {object} args  The clickHandlerArgs from config.js
   * @returns {string}     HTML string to inject into the info panel
   */
  render(args) {
    throw new Error(`HotspotRenderer.render() not implemented for kind: "${args.kind}"`);
  }
}

// ── Built-in renderers ─────────────────────────────────────────────

class VideoHotspotRenderer extends HotspotRenderer {
  render(args) {
    return `
      ${officeHeader(args)}
      <span class="panel-type-badge">📹 Office Intro</span>
      <div class="panel-video">
        <video controls>
          <source src="${args.videoSrc}" type="video/mp4">
          Your browser does not support video playback.
        </video>
      </div>
      <p class="panel-description">${args.description}</p>
      <div class="panel-hours"><h4>Hours</h4><p>${args.hours}</p></div>
      <p class="panel-contact">📧 ${args.contact}</p>
    `;
  }
}

class InfoHotspotRenderer extends HotspotRenderer {
  render(args) {
    return `
      ${officeHeader(args)}
      <span class="panel-type-badge">ℹ️ Office Info</span>
      <p class="panel-description">${args.description}</p>
      <div class="panel-hours"><h4>Hours</h4><p>${args.hours}</p></div>
      <p class="panel-contact">📧 ${args.contact}</p>
    `;
  }
}

class DirectionsHotspotRenderer extends HotspotRenderer {
  render(args) {
    const steps = args.directions.map(step => `<li>${step}</li>`).join('');
    return `
      ${officeHeader(args)}
      <span class="panel-type-badge">🗺️ Directions</span>
      <div class="panel-directions">
        <h4>From your current location</h4>
        <ol>${steps}</ol>
      </div>
    `;
  }
}

// ── Registry ───────────────────────────────────────────────────────

class HotspotRendererRegistry {
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
const hotspotRegistry = new HotspotRendererRegistry()
  .register('video',      new VideoHotspotRenderer())
  .register('info',       new InfoHotspotRenderer())
  .register('directions', new DirectionsHotspotRenderer());
