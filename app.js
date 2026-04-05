// ─────────────────────────────────────────────
//  DePaul Virtual Campus Tour — app.js
//  Composition root. Wires all objects together.
//  This is the only place that knows which
//  concrete classes exist and how they connect.
// ─────────────────────────────────────────────

import { TOUR_CONFIG, DEBUG }             from './config.js';
import { hotspotRegistry }               from './hotspots.js';
import { InfoPanel, TourApp }            from './tour.js';
import { PannellumAdapter }              from './viewer.js';
import { HelpFinder }                    from './help.js';
import { HELP_DATA }                    from './help.data.js';

document.addEventListener('DOMContentLoaded', () => {

  const panel   = new InfoPanel('info-panel', 'panel-content');
  const adapter = new PannellumAdapter();
  if (DEBUG) {
    window._adapter = adapter; // dev helper: type _adapter.getPitchYaw() in the console
  }

  const tour = new TourApp(TOUR_CONFIG, hotspotRegistry, panel, adapter, {
    containerId: 'panorama',
    titleId:     'scene-title',
    navSelector: '.nav-btn[data-scene]'
  });

  const help = new HelpFinder('help-modal', 'modal-content', HELP_DATA);

  tour.init();
  help.init();

});
