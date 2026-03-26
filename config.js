// ─────────────────────────────────────────────
//  DePaul Virtual Campus Tour — Scene Config
//  Edit this file to add locations, hotspots,
//  office info, hours, and directions.
// ─────────────────────────────────────────────

const TOUR_CONFIG = {

  // ── Default starting scene ──
  default: {
    firstScene: "student_center",
    autoLoad: true,
    showControls: true
  },

  // ── Scenes ──
  scenes: {

    student_center: {
      title: "Student Center",
      // 📷 Replace this path with your actual 360° photo
      panorama: "images/student_center.jpg",
      hotSpots: [

        // ── Navigate to next location ──
        {
          pitch: -5,
          yaw: 90,
          type: "scene",
          sceneId: "student_center", // 🔁 Replace with the next scene ID when you add one
          text: "Exit to Quad →",
          cssClass: "hotspot-navigate"
        },

        // ── Office intro video ──
        {
          pitch: 2,
          yaw: -60,
          type: "info",
          text: "Dean of Students — Watch Intro",
          cssClass: "hotspot-video",
          clickHandlerFunc: openHotspot,
          clickHandlerArgs: {
            kind: "video",
            office: "Dean of Students",
            videoSrc: "videos/dean_of_students.mp4", // 📹 Replace with your actual video file
            description: "The Dean of Students office supports your overall success at DePaul. They handle student concerns, conduct, and connect you to the right resources.",
            hours: "Mon–Fri: 8:30am – 5:00pm",
            contact: "dos@depaul.edu | (312) 362-8000"
          }
        },

        // ── Office info / hours ──
        {
          pitch: -2,
          yaw: 30,
          type: "info",
          text: "Financial Aid Office",
          cssClass: "hotspot-info",
          clickHandlerFunc: openHotspot,
          clickHandlerArgs: {
            kind: "info",
            office: "Financial Aid",
            description: "The Financial Aid office helps you navigate scholarships, grants, loans, and work-study programs. Stop by or make an appointment to review your aid package.",
            hours: "Mon–Fri: 9:00am – 5:00pm",
            contact: "finaid@depaul.edu | (312) 362-8610"
          }
        },

        // ── Directions ──
        {
          pitch: 5,
          yaw: 150,
          type: "info",
          text: "Get directions: Academic Advising",
          cssClass: "hotspot-directions",
          clickHandlerFunc: openHotspot,
          clickHandlerArgs: {
            kind: "directions",
            office: "Academic Advising",
            directions: [
              "Exit the Student Center through the main doors facing the Quad.",
              "Turn left and walk north along the main path.",
              "Look for the Arts & Letters Hall sign on your right.",
              "Academic Advising is on the 2nd floor, Room 204.",
              "Elevator is available near the main entrance."
            ]
          }
        }

      ]
    }

    // ── Add more scenes below as you shoot more locations ──
    // Example:
    // quad: {
    //   title: "The Quad",
    //   panorama: "images/quad.jpg",
    //   hotSpots: [ ... ]
    // }

  }
};
