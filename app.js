// ─────────────────────────────────────────────
//  DePaul Virtual Campus Tour — app.js
//  Composition root. Wires all objects together.
//  This is the only place that knows which
//  concrete classes exist and how they connect.
// ─────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  const panel = new InfoPanel('info-panel', 'panel-content');

  const tour = new TourApp(TOUR_CONFIG, hotspotRegistry, panel, {
    containerId: 'panorama',
    titleId:     'scene-title',
    navSelector: '.nav-btn[data-scene]'
  });

  const help = new HelpFinder('help-modal', 'modal-content', HELP_DATA);

  tour.init();
  help.init();

});
