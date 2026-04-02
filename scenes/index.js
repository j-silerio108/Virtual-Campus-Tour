// ─────────────────────────────────────────────
//  Scene Registry — scenes/index.js
//
//  The only file config.js needs to know about.
//  To add a new building:
//    1. Create scenes/your_building.js
//    2. Import and spread it here
// ─────────────────────────────────────────────

import { STUDENT_CENTER_SCENES } from './student_center.js';
// import { LIBRARY_SCENES } from './library.js';
// import { QUAD_SCENES }    from './quad.js';

export const ALL_SCENES = {
  ...STUDENT_CENTER_SCENES,
  // ...LIBRARY_SCENES,
  // ...QUAD_SCENES,
};
