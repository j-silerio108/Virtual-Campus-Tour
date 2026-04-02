// ─────────────────────────────────────────────
//  DePaul Virtual Campus Tour — tour.js
//  InfoPanel and TourApp classes.
// ─────────────────────────────────────────────

// ── Info Panel ──────────────────────────────

export class InfoPanel {
  #panel;
  #content;

  constructor(panelId, contentId) {
    this.#panel   = document.getElementById(panelId);
    this.#content = document.getElementById(contentId);

    if (!this.#panel)   throw new Error(`InfoPanel: element #${panelId} not found`);
    if (!this.#content) throw new Error(`InfoPanel: element #${contentId} not found`);

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

export class TourApp {
  #config;
  #registry;
  #panel;
  #adapter;     // ViewerAdapter — no knowledge of which library is used
  #container;
  #titleEl;
  #navSelector;

  /**
   * @param {object}                  config
   * @param {HotspotRendererRegistry} registry
   * @param {InfoPanel}               panel
   * @param {ViewerAdapter}           adapter     Swappable viewer implementation
   * @param {object}                  domConfig
   * @param {string}                  domConfig.containerId
   * @param {string}                  domConfig.titleId
   * @param {string}                  domConfig.navSelector
   */
  constructor(config, registry, panel, adapter, {
    containerId  = 'panorama',
    titleId      = 'scene-title',
    navSelector  = '.nav-btn[data-scene]'
  } = {}) {
    this.#config      = config;
    this.#registry    = registry;
    this.#panel       = panel;
    this.#adapter     = adapter;
    this.#container   = document.getElementById(containerId);
    this.#titleEl     = document.getElementById(titleId);
    this.#navSelector = navSelector;

    if (!this.#container) throw new Error(`TourApp: element #${containerId} not found`);
    if (!this.#titleEl)   throw new Error(`TourApp: element #${titleId} not found`);
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
    this.#adapter.destroy();

    this.#adapter.mount(
      this.#container.id,
      scene.panorama,
      scene.hotSpots,
      (args) => this.#panel.show(this.#registry.render(args)),
      (sceneId) => this.loadScene(sceneId)
    );
  }
}
