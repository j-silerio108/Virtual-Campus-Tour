// ─────────────────────────────────────────────
//  Student Center — Scene Definitions
//  Add all Student Center rooms/floors here.
// ─────────────────────────────────────────────

const STUDENT_CENTER_SCENES = {

  student_center: {
    title: "Student Center",
    panorama: "images/newman_lobby_4k.jpg",
    hotSpots: [

      // ── Navigate to next location ──
      {
        pitch: 1.67,
        yaw: 76.78,
        type: "scene",
        sceneId: "student_center_west_stairs",
        text: "Student Center West Stairs →",
        cssClass: "hotspot-navigate"
      },

      {
        pitch: 3.75,
        yaw: 57,
        type: "scene",
        sceneId: "student_center_east_stairs",
        text: "Student Center East Stairs",
        cssClass: "hotspot-navigate"

      },

      // ── Office intro video ──
      {
        pitch: 2,
        yaw: -60,
        type: "info",
        text: "Dean of Students — Watch Intro",
        cssClass: "hotspot-video",
        clickHandlerArgs: {
          kind: "video",
          office: "Dean of Students",
          videoSrc: "videos/dean_of_students.mp4",
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
  },

  student_center_west_stairs: {
    title: "Student Center - Western Stairs",
    panorama: "images/ferndale_studio_01_4k.png",
    hotSpots: [
      {
      pitch: -10,
      yaw: -170,
      type: "scene",
      sceneId: "student_center",
      text: "Student Center Main Lobby",
      cssClass: "hotspot-navigate"

      },

      {
        pitch: -10,
        yaw: 13,
        type: "scene",
        sceneId: "the_pod",
        text: "The Pod Store",
        cssClass: "hotspot-navigate"
      }



    ]
  },

  student_center_east_stairs: {
    title: "Student Center - Eastern Stairs",
    panorama: "images/church_meeting_room_4k.png",
    hotSpots: [
      {
        pitch: -10,
        yaw: 13,
        type: "scene",
        sceneId: "student_center",
        text: "Student Center Main Lobby",
        cssClass: "hotspot-navigate"
      },

      {
        pitch: -10,
        yaw: 170,
        type: "scene",
        sceneId: "the_pod",
        text: "The Pod Store",
        cssClass: "hotspot-navigate"
      }

    ]
  },


  the_pod: {
    title: "The Pod store",
    panorama: "images/ferndale_studio_04_4k.png",
    hotSpots: [
      {
        pitch: -10,
        yaw: 13,
        type: "scene",
        sceneId: "student_center_east_stairs",
        text: "East Stars",
        cssClass: "hotspot-navigate"
      },
      {
        pitch: -10,
        yaw: 170,
        type: "scene",
        sceneId: "student_center_west_stairs",
        text: "West Stairs",
        cssClass: "hotspot-navigate"

      }

    ]
  }

};
