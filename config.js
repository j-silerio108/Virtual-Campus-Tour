// ─────────────────────────────────────────────
//  DePaul Virtual Campus Tour — Main Config
//
//  Global defaults only. Scene registry is
//  handled by scenes/index.js — edit that file
//  when adding a new building.
// ─────────────────────────────────────────────

import { SCENE_INDEX } from './scenes/index.js';

export const TOUR_CONFIG = {

  // ── Default starting scene ──
  default: {
    firstScene: 'student_center',
    autoLoad:     true,
    showControls: true
  },

  scenes:     {},           // populated on demand as buildings are visited
  sceneIndex: SCENE_INDEX,  // lightweight registry — nav metadata + lazy loaders

};
