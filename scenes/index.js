// ─────────────────────────────────────────────
//  Scene Index — scenes/index.js
//
//  Lightweight registry: nav metadata + lazy loaders.
//  No scene data is imported here — files are fetched
//  on demand the first time a scene is visited.
//
//  To add a new building:
//    1. Create scenes/your_building.js
//    2. Add an entry here for each scene in that file
//    3. Give top-level scenes a building + floor for nav
//    4. Transition scenes (stairs, hallways) need only load:
// ─────────────────────────────────────────────

export const SCENE_INDEX = {

  // ── Student Center ──────────────────────────
  student_center: {
    building: 'Student Center',
    floor:    'Main Lobby',
    load:     () => import('./student_center.js').then(m => m.STUDENT_CENTER_SCENES),
  },
  student_center_west_stairs: {
    load: () => import('./student_center.js').then(m => m.STUDENT_CENTER_SCENES),
  },
  student_center_east_stairs: {
    load: () => import('./student_center.js').then(m => m.STUDENT_CENTER_SCENES),
  },
  the_pod: {
    building: 'Student Center',
    floor:    'The Pod Store',
    load:     () => import('./student_center.js').then(m => m.STUDENT_CENTER_SCENES),
  },

  // ── Add more buildings below ─────────────────
  // library_main: {
  //   building: 'Richardson Library',
  //   floor:    'Ground Floor',
  //   load:     () => import('./library.js').then(m => m.LIBRARY_SCENES),
  // },

};
