// ─────────────────────────────────────────────
//  DePaul Virtual Campus Tour — help.js
//  Help Finder modal class.
//  Data lives in help.data.js.
// ─────────────────────────────────────────────

import { escapeHtml } from './panel-templates.js';

export class HelpFinder {
  #modal;
  #content;
  #data;

  /**
   * @param {string} modalId    ID of the modal backdrop element
   * @param {string} contentId  ID of the content container inside the modal
   * @param {object} data       HELP_DATA — keyed by category string
   */
  constructor(modalId, contentId, data) {
    this.#modal   = document.getElementById(modalId);
    this.#content = document.getElementById(contentId);
    this.#data    = data;

    if (!this.#modal)   throw new Error(`HelpFinder: element #${modalId} not found`);
    if (!this.#content) throw new Error(`HelpFinder: element #${contentId} not found`);
  }

  init() {
    document.querySelectorAll('[data-help]').forEach(btn => {
      btn.addEventListener('click', () => this.show(btn.dataset.help));
    });

    this.#modal.querySelector('.close-btn')
      .addEventListener('click', () => this.close());

    this.#modal.addEventListener('click', e => {
      if (e.target === this.#modal) this.close();
    });
  }

  show(category) {
    const data = this.#data[category];
    if (!data) return;

    this.#content.innerHTML = `
      <div class="modal-emoji">${escapeHtml(data.emoji)}</div>
      <div class="modal-title">You need help with: ${escapeHtml(data.need)}</div>
      <div class="modal-office">→ Go to: <strong>${escapeHtml(data.office)}</strong></div>
      <p class="modal-desc">${escapeHtml(data.description)}</p>
      <div class="modal-detail">
        <strong>📍 Location:</strong> ${escapeHtml(data.location)}<br>
        <strong>🕐 Hours:</strong> ${escapeHtml(data.hours)}<br>
        <strong>📧 Contact:</strong> ${escapeHtml(data.contact)}
      </div>
    `;

    this.#modal.classList.remove('hidden');
  }

  close() {
    this.#modal.classList.add('hidden');
    this.#content.innerHTML = '';
  }
}
