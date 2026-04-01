// ─────────────────────────────────────────────
//  DePaul Virtual Campus Tour — Main Config
//
//  This file sets global defaults and assembles
//  all scenes from the individual building files
//  in the /scenes folder.
//
//  To add a new building:
//    1. Create scenes/your_building.js
//    2. Add a <script> tag for it in index.html
//       (before this file's <script> tag)
//    3. Spread it into TOUR_CONFIG.scenes below
// ─────────────────────────────────────────────

const TOUR_CONFIG = {

  // ── Default starting scene ──
  default: {
    firstScene: "student_center",
    autoLoad: true,
    showControls: true
  },

  // ── All scenes, assembled from /scenes files ──
  scenes: {
    ...STUDENT_CENTER_SCENES,
    // ...LIBRARY_SCENES,
    // ...QUAD_SCENES,
  }

};
