# DePaul Virtual Campus Tour
**MVP Starter Project** | Built with Pannellum + HTML/CSS/JS

---

## Quick Start

1. Open this folder in **VS Code**
2. Install the **Live Server** extension (search "Live Server" by Ritwick Dey)
3. Add a 360° photo named `student_center.jpg` into the `/images/` folder
4. Right-click `index.html` → **Open with Live Server**
5. The tour opens in your browser at `http://127.0.0.1:5500`

---

## Project Structure

```
depaul-tour/
├── index.html       ← page shell, layout
├── styles.css       ← DePaul branding + all UI styles
├── config.js        ← ALL scenes, hotspots, office data (edit here)
├── tour.js          ← Pannellum init + info panel logic
├── help.js          ← Help Finder modal logic + office data
├── images/
│   └── student_center.jpg   ← your 360° photo goes here
└── videos/
    └── (office intro videos go here)
```

---

## Adding a New Scene

1. Shoot a 360° photo and save it in `/images/` (e.g. `quad.jpg`)
2. Open `config.js` and add a new entry under `scenes`:

```js
quad: {
  title: "The Quad",
  panorama: "images/quad.jpg",
  hotSpots: [
    {
      pitch: -3,
      yaw: 120,
      type: "scene",
      sceneId: "student_center",
      text: "Back to Student Center",
      cssClass: "hotspot-navigate"
    }
  ]
}
```

3. Add a nav button in `index.html`:
```html
<button class="nav-btn" onclick="loadScene('quad')">The Quad</button>
```

---

## Adding a Hotspot

Open `config.js` and add to a scene's `hotSpots` array.

### Navigate to another scene
```js
{
  pitch: -5, yaw: 90,
  type: "scene",
  sceneId: "quad",
  text: "Go to Quad →",
  cssClass: "hotspot-navigate"
}
```

### Office info / hours
```js
{
  pitch: 2, yaw: -60,
  type: "info",
  text: "Financial Aid",
  cssClass: "hotspot-info",
  clickHandlerFunc: openHotspot,
  clickHandlerArgs: {
    kind: "info",
    office: "Financial Aid",
    description: "Helps with scholarships, grants, and loans.",
    hours: "Mon–Fri: 9am–5pm",
    contact: "finaid@depaul.edu"
  }
}
```

### Office intro video
```js
{
  pitch: 2, yaw: 30,
  type: "info",
  text: "Watch: Dean of Students",
  cssClass: "hotspot-video",
  clickHandlerFunc: openHotspot,
  clickHandlerArgs: {
    kind: "video",
    office: "Dean of Students",
    videoSrc: "videos/dean_of_students.mp4",
    description: "Learn what this office does.",
    hours: "Mon–Fri: 8:30am–5pm",
    contact: "dos@depaul.edu"
  }
}
```

### Directions
```js
{
  pitch: 5, yaw: 150,
  type: "info",
  text: "Directions: Advising",
  cssClass: "hotspot-directions",
  clickHandlerFunc: openHotspot,
  clickHandlerArgs: {
    kind: "directions",
    office: "Academic Advising",
    directions: [
      "Exit through the main doors.",
      "Turn left toward Arts & Letters Hall.",
      "Take elevator to 2nd floor, Room 204."
    ]
  }
}
```

---

## Finding Hotspot Positions (pitch/yaw)

1. Load the tour in your browser
2. Look around and find where you want a hotspot
3. Open the browser console (F12)
4. Type: `viewer.getConfig()` — it shows the current pitch/yaw you're looking at
5. Use those numbers in your config

---

## Adding Office Videos

1. Record a short 60–90 second intro video with the office
2. Export as `.mp4`
3. Save into `/videos/`
4. Reference it in the hotspot's `videoSrc` field

---

## Updating the Help Finder

Open `help.js` and edit the `HELP_DATA` object to update office names, hours, locations, and contact info.
