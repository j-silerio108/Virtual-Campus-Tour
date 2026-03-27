// ─────────────────────────────────────────────
//  DePaul Virtual Campus Tour — tour.js
//  InfoPanel and TourApp classes.
// ─────────────────────────────────────────────

// ── Info Panel ──────────────────────────────

class InfoPanel {
  #panel;
  #content;

  constructor(panelId, contentId) {
    this.#panel   = document.getElementById(panelId);
    this.#content = document.getElementById(contentId);

    // InfoPanel owns its own close button — TourApp has no business wiring it
    this.#panel.querySelector('.close-btn')
      .addEventListener('click', () => this.hide());
  }

  show(html) {
    this.#content.innerHTML = html;
    this.#panel.classList.remove('hidden');
  }

  hide() {
    this.#panel.classList.add('hidden');
    this.#content.innerHTML = '';
  }
}

// ── Tour App ─────────────────────────────────

class TourApp {
  #config;
  #registry;
  #panel;
  #viewer    = null;
  #container;   // Pannellum mount element
  #titleEl;     // Scene title overlay element
  #navSelector; // CSS selector for nav buttons

  /**
   * @param {object}                  config
   * @param {HotspotRendererRegistry} registry
   * @param {InfoPanel}               panel
   * @param {object}                  domConfig   Injected DOM references — no hardcoded IDs
   * @param {string}                  domConfig.containerId  ID of the Pannellum mount element
   * @param {string}                  domConfig.titleId      ID of the scene title overlay
   * @param {string}                  domConfig.navSelector  CSS selector for nav buttons
   */
  constructor(config, registry, panel, {
    containerId  = 'panorama',
    titleId      = 'scene-title',
    navSelector  = '.nav-btn[data-scene]'
  } = {}) {
    this.#config      = config;
    this.#registry    = registry;
    this.#panel       = panel;
    this.#container   = document.getElementById(containerId);
    this.#titleEl     = document.getElementById(titleId);
    this.#navSelector = navSelector;
  }

  init() {
    document.querySelectorAll(this.#navSelector).forEach(btn => {
      btn.addEventListener('click', () => this.loadScene(btn.dataset.scene));
    });

    this.loadScene(this.#config.default.firstScene);
  }

  loadScene(sceneId) {
    const scene = this.#config.scenes[sceneId];
    if (!scene) {
      console.warn('Scene not found:', sceneId);
      return;
    }

    this.#titleEl.textContent = scene.title;

    document.querySelectorAll(this.#navSelector).forEach(btn => {
      btn.classList.toggle('active', btn.dataset.scene === sceneId);
    });

    this.#panel.hide();

    if (this.#viewer) {
      this.#viewer.destroy();
      this.#viewer = null;
    }

    this.#viewer = pannellum.viewer(this.#container.id, {
      type:         'equirectangular',
      panorama:     scene.panorama,
      autoLoad:     true,
      showControls: true,
      hotSpots:     scene.hotSpots.map(hs => this.#buildHotspot(hs))
    });
  }

  // ── Private ──────────────────────────────

  #buildHotspot(hs) {
    if (hs.type === 'scene') {
      return {
        pitch:    hs.pitch,
        yaw:      hs.yaw,
        type:     'scene',
        sceneId:  hs.sceneId,
        text:     hs.text,
        cssClass: hs.cssClass || 'hotspot-navigate'
      };
    }

    // clickHandlerFunc injected here — config.js stays pure data
    return {
      pitch:            hs.pitch,
      yaw:              hs.yaw,
      type:             'info',
      text:             hs.text,
      cssClass:         hs.cssClass || 'hotspot-info',
      clickHandlerFunc: (args) => this.#panel.show(this.#registry.render(args)),
      clickHandlerArgs: hs.clickHandlerArgs || {}
    };
  }
}
