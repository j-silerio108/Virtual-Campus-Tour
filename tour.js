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
  #adapter;        // ViewerAdapter — no knowledge of which library is used
  #container;
  #titleEl;
  #navEl;
  #navSelector;
  #loadingPromises  = new Map();  // sceneId → in-flight load promise (race guard)
  #clickHandler     = null;
  #popstateHandler  = null;

  /**
   * @param {object}                  config
   * @param {HotspotRendererRegistry} registry
   * @param {InfoPanel}               panel
   * @param {ViewerAdapter}           adapter     Swappable viewer implementation
   * @param {object}                  domConfig
   * @param {string}                  domConfig.containerId
   * @param {string}                  domConfig.titleId
   * @param {string}                  domConfig.navId       Container where nav buttons are injected
   * @param {string}                  domConfig.navSelector
   */
  constructor(config, registry, panel, adapter, {
    containerId  = 'panorama',
    titleId      = 'scene-title',
    navId        = 'scene-nav',
    navSelector  = '.nav-btn[data-scene]'
  } = {}) {
    this.#config      = config;
    this.#registry    = registry;
    this.#panel       = panel;
    this.#adapter     = adapter;
    this.#container   = document.getElementById(containerId);
    this.#titleEl     = document.getElementById(titleId);
    this.#navEl       = document.getElementById(navId);
    this.#navSelector = navSelector;

    if (!this.#container) throw new Error(`TourApp: element #${containerId} not found`);
    if (!this.#titleEl)   throw new Error(`TourApp: element #${titleId} not found`);
  }

  #buildNav() {
    if (!this.#navEl) return;
    this.#navEl.innerHTML = '';

    // Group nav-eligible entries by building (reads sceneIndex, not scenes)
    const buildings = new Map();
    for (const [sceneId, entry] of Object.entries(this.#config.sceneIndex)) {
      if (!entry.building) continue;
      if (!buildings.has(entry.building)) buildings.set(entry.building, []);
      buildings.get(entry.building).push({ sceneId, entry });
    }

    for (const [buildingName, items] of buildings) {
      const wrapper = document.createElement('div');
      wrapper.className = 'nav-building';

      const trigger = document.createElement('button');
      trigger.className = 'nav-building-btn';
      trigger.textContent = buildingName;
      trigger.setAttribute('aria-expanded', 'false');
      trigger.addEventListener('click', () => {
        const open = wrapper.classList.toggle('open');
        trigger.setAttribute('aria-expanded', String(open));
      });

      const dropdown = document.createElement('div');
      dropdown.className = 'nav-dropdown';

      for (const { sceneId, entry } of items) {
        const btn = document.createElement('button');
        btn.className = 'nav-btn';
        btn.dataset.scene = sceneId;
        btn.textContent = entry.floor;
        btn.addEventListener('click', () => {
          wrapper.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
          this.loadScene(sceneId);
        });
        dropdown.appendChild(btn);
      }

      wrapper.appendChild(trigger);
      wrapper.appendChild(dropdown);
      this.#navEl.appendChild(wrapper);
    }
  }

  init() {
    this.#buildNav();

    this.#clickHandler = (e) => {
      if (!e.target.closest('.nav-building')) {
        this.#navEl?.querySelectorAll('.nav-building.open').forEach(el => {
          el.classList.remove('open');
          el.querySelector('.nav-building-btn').setAttribute('aria-expanded', 'false');
        });
      }
    };
    document.addEventListener('click', this.#clickHandler);

    this.#popstateHandler = (e) => {
      const sceneId = e.state?.scene ?? this.#config.default.firstScene;
      this.loadScene(sceneId, { pushState: false });
    };
    window.addEventListener('popstate', this.#popstateHandler);

    const initial = new URLSearchParams(location.search).get('scene') ?? this.#config.default.firstScene;
    this.loadScene(initial, { pushState: false });
  }

  destroy() {
    if (this.#clickHandler) {
      document.removeEventListener('click', this.#clickHandler);
      this.#clickHandler = null;
    }
    if (this.#popstateHandler) {
      window.removeEventListener('popstate', this.#popstateHandler);
      this.#popstateHandler = null;
    }
    this.#adapter.destroy();
  }

  async loadScene(sceneId, { pushState = true } = {}) {
    // Lazy load — fetch the building file if this scene isn't cached yet
    if (!this.#config.scenes[sceneId]) {
      const entry = this.#config.sceneIndex[sceneId];
      if (!entry) {
        console.warn('Scene not found:', sceneId);
        this.#titleEl.textContent = 'Scene not found';
        this.#panel.show('<p style="color:#fff;padding:1rem">Sorry, this location could not be loaded.</p>');
        return;
      }
      // Reuse an in-flight promise so rapid clicks don't double-fetch
      if (!this.#loadingPromises.has(sceneId)) {
        this.#loadingPromises.set(
          sceneId,
          entry.load().finally(() => this.#loadingPromises.delete(sceneId))
        );
      }
      try {
        const scenes = await this.#loadingPromises.get(sceneId);
        this.#registry.validate(scenes);
        Object.assign(this.#config.scenes, scenes);
      } catch (err) {
        console.error('Failed to load scene:', sceneId, err);
        this.#titleEl.textContent = 'Scene unavailable';
        this.#panel.show('<p style="color:#fff;padding:1rem">Sorry, this location could not be loaded. Please try again.</p>');
        return;
      }
    }

    const scene = this.#config.scenes[sceneId];

    if (pushState) {
      history.pushState({ scene: sceneId }, '', `?scene=${sceneId}`);
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
      scene.hotSpots ?? [],
      (args) => this.#panel.show(this.#registry.render(args)),
      (sceneId) => this.loadScene(sceneId)
    );
  }
}
