// ─────────────────────────────────────────────
//  DePaul Virtual Campus Tour — tour.js
//  Initializes Pannellum and handles panel UI
// ─────────────────────────────────────────────

let viewer = null;

// ── Initialize the viewer on page load ──
window.addEventListener('load', () => {
  loadScene(TOUR_CONFIG.default.firstScene);
});

// ── Load a scene by ID ──
function loadScene(sceneId) {
  const scene = TOUR_CONFIG.scenes[sceneId];
  if (!scene) {
    console.warn('Scene not found:', sceneId);
    return;
  }

  // Update scene title overlay
  document.getElementById('scene-title').textContent = scene.title;

  // Update active nav button
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.trim() === scene.title);
  });

  // Close any open panel
  closePanel();

  // Destroy existing viewer if present
  if (viewer) {
    viewer.destroy();
    viewer = null;
  }

  // Build Pannellum config
  const pannellumConfig = {
    type: 'equirectangular',
    panorama: scene.panorama,
    autoLoad: true,
    showControls: true,
    hotSpots: scene.hotSpots.map(hs => {
      // For scene-type hotspots, use Pannellum's native scene switching
      if (hs.type === 'scene') {
        return {
          pitch: hs.pitch,
          yaw: hs.yaw,
          type: 'scene',
          sceneId: hs.sceneId,
          text: hs.text,
          cssClass: hs.cssClass || 'hotspot-navigate'
        };
      }
      // For all info hotspots, use our custom click handler
      return {
        pitch: hs.pitch,
        yaw: hs.yaw,
        type: 'info',
        text: hs.text,
        cssClass: hs.cssClass || 'hotspot-info',
        clickHandlerFunc: hs.clickHandlerFunc || null,
        clickHandlerArgs: hs.clickHandlerArgs || {}
      };
    })
  };

  viewer = pannellum.viewer('panorama', pannellumConfig);
}

// ── Open info panel with hotspot content ──
function openHotspot(args) {
  const panel = document.getElementById('info-panel');
  const content = document.getElementById('panel-content');

  let html = '';

  if (args.kind === 'video') {
    html = `
      <div class="panel-office-name">${args.office}</div>
      <span class="panel-type-badge">📹 Office Intro</span>
      <div class="panel-video">
        <video controls>
          <source src="${args.videoSrc}" type="video/mp4">
          Your browser does not support video playback.
        </video>
      </div>
      <p class="panel-description">${args.description}</p>
      <div class="panel-hours">
        <h4>Hours</h4>
        <p>${args.hours}</p>
      </div>
      <p class="panel-contact">📧 ${args.contact}</p>
    `;
  }

  else if (args.kind === 'info') {
    html = `
      <div class="panel-office-name">${args.office}</div>
      <span class="panel-type-badge">ℹ️ Office Info</span>
      <p class="panel-description">${args.description}</p>
      <div class="panel-hours">
        <h4>Hours</h4>
        <p>${args.hours}</p>
      </div>
      <p class="panel-contact">📧 ${args.contact}</p>
    `;
  }

  else if (args.kind === 'directions') {
    const steps = args.directions.map((step, i) => `<li>${step}</li>`).join('');
    html = `
      <div class="panel-office-name">${args.office}</div>
      <span class="panel-type-badge">🗺️ Directions</span>
      <div class="panel-directions">
        <h4>From your current location</h4>
        <ol>${steps}</ol>
      </div>
    `;
  }

  content.innerHTML = html;
  panel.classList.remove('hidden');
}

// ── Close info panel ──
function closePanel() {
  document.getElementById('info-panel').classList.add('hidden');
  document.getElementById('panel-content').innerHTML = '';
}
