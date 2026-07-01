/* =====================================================
   CONTENT.JS
   Everything you'd want to edit — text, dates, image
   filenames, audio filenames — lives in this one file.
   You should never need to touch index.html, styles.css,
   or script.js just to update wording or swap a file.
   ===================================================== */

const CONTENT = {

  couple: {
    names: "Anushka & Parshva",
    hashtag: "#ANUSHKAwedsPARSHVA"
  },

  /* -----------------------------------------------------
     THE ENTRY DOOR
     One image, a big closed traditional double door.
     It gets automatically split down the middle and the
     two halves drag/slide apart — you only provide ONE
     image file, not two.
     Recommended size: 1600 × 2400px (portrait), JPG.
  ----------------------------------------------------- */
  door: {
    image: "images/door-entry.jpg",
    hint: "Drag the doors open"
  },

  /* -----------------------------------------------------
     WELCOME SCENE
     The establishing shot of Pushkar guests see right
     after the door opens, before the journey begins.
     Recommended size: 1600 × 2400px (portrait), JPG.
  ----------------------------------------------------- */
  welcome: {
    background: "images/bg-welcome.jpg",
    eyebrow: "Welcome to",
    line1: "Anushka & Parshva's",
    line2: "Wedding Week",
    sub: "Mumbai to Pushkar · December 2026",
    buttonText: "Begin the Journey"
  },

  /* -----------------------------------------------------
     EVENT SCENES
     One object per event, in the order they should play.
     "theme" just controls the accent color glow on that
     scene (see THEMES below) — purely cosmetic, safe to
     leave as-is or change.
     Each background image recommended size:
     1600 × 2400px (portrait), JPG, under ~500KB if possible.
     "particles" adds a lightweight animated effect over
     the scene (none needed, but nice touches are available:
     "sparkle" for Sangeet-style glitter, "petals" for
     falling flower petals, "glow" for soft floating light).
  ----------------------------------------------------- */
  scenes: [
    {
      id: "mehandi",
      theme: "mehandi",
      dayLabel: "Day One",
      title: "Mehandi",
      city: "Mumbai",
      date: "[Add Date]",
      time: "[Add Time]",
      venue: "[Add Venue Name, Mumbai]",
      dressCode: "[Add Dress Code — e.g. Green & Yellow]",
      background: "images/bg-mehandi.jpg",
      music: "audio/mehandi.mp3",
      particles: "petals"
    },
    {
      id: "haldi",
      theme: "haldi",
      dayLabel: "Day Two",
      title: "Haldi",
      city: "Pushkar",
      date: "[Add Date]",
      time: "[Add Time]",
      venue: "[Add Venue Name, Pushkar]",
      dressCode: "[Add Dress Code — e.g. Yellow]",
      background: "images/bg-haldi.jpg",
      music: "audio/haldi.mp3",
      particles: "glow"
    },
    {
      id: "sangeet",
      theme: "sangeet",
      dayLabel: "Day Two · Evening",
      title: "Sangeet",
      city: "Pushkar",
      date: "[Add Date]",
      time: "[Add Time]",
      venue: "[Add Venue Name, Pushkar]",
      dressCode: "[Add Dress Code — e.g. Glam & Glitter]",
      background: "images/bg-sangeet.jpg",
      music: "audio/sangeet.mp3",
      particles: "sparkle"
    },
    {
      id: "wedding",
      theme: "wedding",
      dayLabel: "Day Three",
      title: "Wedding",
      city: "Pushkar",
      date: "[Add Date]",
      time: "[Add Time]",
      venue: "[Add Venue Name, Pushkar]",
      dressCode: "[Add Dress Code — e.g. Traditional Attire]",
      background: "images/bg-wedding.jpg",
      music: "audio/wedding.mp3",
      particles: "petals"
    },
    {
      id: "reception",
      theme: "reception",
      dayLabel: "Day Three · Evening",
      title: "Reception",
      city: "Pushkar",
      date: "[Add Date]",
      time: "[Add Time]",
      venue: "[Add Venue Name, Pushkar]",
      dressCode: "[Add Dress Code — e.g. Evening Formal]",
      background: "images/bg-reception.jpg",
      music: "audio/reception.mp3",
      particles: "glow"
    }
  ],

  /* -----------------------------------------------------
     PORTALS (the transitions BETWEEN each event scene)
     One per gap between scenes — so with 5 scenes above,
     you need 4 portal images here. Each is just ONE image
     (a curtain, gate, veil, arch — whatever fits the mood
     of that transition) that gets split and dragged apart,
     same as the entry door.
     Recommended size: 1600 × 2400px (portrait), JPG.
     "label" is the small caption shown on the portal.
  ----------------------------------------------------- */
  portals: [
    { image: "images/portal-1-mehandi-to-haldi.jpg", label: "Onward to the Haldi" },
    { image: "images/portal-2-haldi-to-sangeet.jpg", label: "Into the night — the Sangeet" },
    { image: "images/portal-3-sangeet-to-wedding.jpg", label: "A new day — the Wedding" },
    { image: "images/portal-4-wedding-to-reception.jpg", label: "Onward to the Reception" }
  ]
};

/* Accent colors per scene theme — purely cosmetic glow/tint,
   edit hex values if you want a different mood per scene. */
const THEMES = {
  mehandi:   { accent: "#6b7a3f", glow: "rgba(150,170,90,0.35)"  },
  haldi:     { accent: "#e0972b", glow: "rgba(230,170,50,0.35)"  },
  sangeet:   { accent: "#c9538a", glow: "rgba(210,80,150,0.4)"   },
  wedding:   { accent: "#a3273f", glow: "rgba(190,50,70,0.35)"   },
  reception: { accent: "#b8905a", glow: "rgba(200,160,110,0.35)" }
};
