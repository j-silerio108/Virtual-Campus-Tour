// ─────────────────────────────────────────────
//  DePaul Virtual Campus Tour — help.js
//  Help Finder modal logic
// ─────────────────────────────────────────────

const HELP_DATA = {
  money: {
    emoji: "💰",
    need: "Money / Financial Aid",
    office: "Financial Aid Office",
    description: "The Financial Aid office can help you with scholarships, grants, loans, and work-study programs. Whether you have questions about your aid package or need emergency funding, this is your first stop.",
    hours: "Mon–Fri: 9:00am – 5:00pm",
    location: "Student Center, 2nd Floor",
    contact: "finaid@depaul.edu | (312) 362-8610"
  },
  classes: {
    emoji: "📚",
    need: "Classes / Academics",
    office: "Academic Advising",
    description: "Academic Advisors help you choose courses, plan your degree, navigate academic policies, and stay on track for graduation. Every student is assigned an advisor — make an appointment early.",
    hours: "Mon–Fri: 9:00am – 5:00pm",
    location: "Arts & Letters Hall, Room 204",
    contact: "advising@depaul.edu | (312) 362-5817"
  },
  housing: {
    emoji: "🏠",
    need: "Housing",
    office: "Housing & Residence Life",
    description: "The Housing office manages on-campus residence halls and can help you with room assignments, roommate issues, and housing applications. If you need off-campus resources, they can point you in the right direction too.",
    hours: "Mon–Fri: 8:30am – 5:00pm",
    location: "Centennial Hall, 1st Floor",
    contact: "housing@depaul.edu | (312) 362-8625"
  },
  health: {
    emoji: "🧠",
    need: "Mental Health",
    office: "Counseling & Psychological Services (CAPS)",
    description: "CAPS provides free, confidential counseling to all enrolled DePaul students. Services include individual therapy, group sessions, and crisis support. You don't need to be in crisis to reach out — early support matters.",
    hours: "Mon–Fri: 9:00am – 5:00pm | Crisis line available 24/7",
    location: "Lincoln Park Student Center, Suite 220",
    contact: "caps@depaul.edu | (773) 325-7779"
  },
  jobs: {
    emoji: "💼",
    need: "Jobs / Career",
    office: "Career Center",
    description: "The Career Center helps you explore careers, build your resume, prepare for interviews, and connect with internship and job opportunities. They work with students at all stages — freshmen to seniors.",
    hours: "Mon–Fri: 9:00am – 5:00pm",
    location: "Student Center, Suite 300",
    contact: "careers@depaul.edu | (312) 362-5475"
  }
};

// ── Show Help Finder modal ──
function showHelp(category) {
  const data = HELP_DATA[category];
  if (!data) return;

  const modal = document.getElementById('help-modal');
  const content = document.getElementById('modal-content');

  content.innerHTML = `
    <div class="modal-emoji">${data.emoji}</div>
    <div class="modal-title">You need help with: ${data.need}</div>
    <div class="modal-office">→ Go to: <strong>${data.office}</strong></div>
    <p class="modal-desc">${data.description}</p>
    <div class="modal-detail">
      <strong>📍 Location:</strong> ${data.location}<br>
      <strong>🕐 Hours:</strong> ${data.hours}<br>
      <strong>📧 Contact:</strong> ${data.contact}
    </div>
  `;

  modal.classList.remove('hidden');
}

// ── Close Help modal ──
function closeModal() {
  document.getElementById('help-modal').classList.add('hidden');
  document.getElementById('modal-content').innerHTML = '';
}

// Close modal if user clicks the backdrop
document.getElementById('help-modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
