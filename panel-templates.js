// ─────────────────────────────────────────────
//  DePaul Virtual Campus Tour — panel-templates.js
//
//  Shared HTML building blocks for the info panel.
//  All hotspot renderers import from here, so a
//  layout change only needs to happen in one place.
// ─────────────────────────────────────────────

// Escapes user-supplied strings before they are injected into innerHTML.
// Prevents XSS if data ever comes from an external source (e.g. JSON fetch).
export function escapeHtml(str) {
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#039;');
}

const e = escapeHtml; // shorthand for use inside templates

export const t = {
  header:      (office)       => office   ? `<div class="panel-office-name">${e(office)}</div>`                        : '',
  badge:       (icon, label)  => label    ? `<span class="panel-type-badge">${icon} ${e(label)}</span>`                : '',
  description: (text)         => text     ? `<p class="panel-description">${e(text)}</p>`                              : '',
  hours:       (hours)        => hours    ? `<div class="panel-hours"><h4>Hours</h4><p>${e(hours)}</p></div>`           : '',
  contact:     (contact)      => contact  ? `<p class="panel-contact">📧 ${e(contact)}</p>`                            : '',
  error:       (message)      => `<p class="panel-error">${e(message)}</p>`,
};
