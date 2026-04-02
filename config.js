// ─────────────────────────────────────────────
//  DePaul Virtual Campus Tour — Main Config
//
//  Global defaults only. Scene assembly is
//  handled by scenes/index.js — edit that file
//  when adding a new building.
// ─────────────────────────────────────────────

import { ALL_SCENES } from './scenes/index.js';

export const TOUR_CONFIG = {

  // ── Default starting scene ──
  default: {
    firstScene: "student_center",
    autoLoad: true,
    showControls: true
  },

  scenes: ALL_SCENES

};
