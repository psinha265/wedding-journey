# Anushka & Parshva — Wedding Journey

An interactive wedding site: a big door you drag open, then a cinematic
journey through Mehandi → Haldi → Sangeet → Wedding → Reception, each
scene with its own mood, music, and a portal transition into the next.
There's also a "just show me the info" Itinerary toggle, and a working
RSVP form.

## 1. Run it locally

Double-click `index.html`. That's it — no installs, no build step.

(If anything looks slightly off double-clicking directly, some browsers
are strict about local files — run `python3 -m http.server` in this
folder instead and open `http://localhost:8000`.)

## 2. The one file you'll edit for almost everything: `content.js`

Every piece of text, every image filename, every audio filename lives in
`content.js`. You should basically never need to open `index.html`,
`styles.css`, or `script.js` just to update wording, dates, or swap a file.

Open `content.js` and you'll see, in order:
- `door` — the entry door image + hint text
- `welcome` — the "establishing shot" scene right after the door opens
- `scenes` — an array of the 5 events (Mehandi, Haldi, Sangeet, Wedding,
  Reception), each with its own text fields and image/audio filenames
- `portals` — the 4 transition images between consecutive events

Search for `[Add Date]`, `[Add Venue`, `[Add Dress Code` etc. inside
`content.js` and replace with your real details.

## 3. Adding your images

Everything below goes in the `images/` folder, using **exactly** these
filenames (or edit the paths in `content.js` if you'd rather rename them).

**Recommended size for every image: 1600 × 2400px (portrait), JPG.**
They're all shown full-bleed with `cover` cropping, so keep whatever's
most important in a given image roughly centered — the very edges may
get cropped differently depending on screen shape.

| Filename | What it is |
|---|---|
| `images/door-entry.jpg` | The big closed traditional door. This gets automatically split down the middle and dragged apart — you only need **one** image, not a left/right pair. |
| `images/bg-welcome.jpg` | The Pushkar establishing shot shown right after the door opens |
| `images/bg-mehandi.jpg` | Mehandi scene background |
| `images/portal-1-mehandi-to-haldi.jpg` | Transition image between Mehandi → Haldi (a curtain, gate, arch — whatever fits) |
| `images/bg-haldi.jpg` | Haldi scene background |
| `images/portal-2-haldi-to-sangeet.jpg` | Transition into the Sangeet — this is the "opening to the night" moment |
| `images/bg-sangeet.jpg` | Sangeet scene background |
| `images/portal-3-sangeet-to-wedding.jpg` | Transition into the Wedding |
| `images/bg-wedding.jpg` | Wedding scene background |
| `images/portal-4-wedding-to-reception.jpg` | Transition into the Reception |
| `images/bg-reception.jpg` | Reception scene background |

**Until you add these, nothing looks broken** — each scene falls back to
a soft color gradient in that scene's theme color, so it still looks
intentional, just plain.

### How the door/portal images get split

Each is just one full image — the code shows the left half of it in a
left-half container and the right half in a right-half container, so
dragging them apart reconstructs the image back together when closed,
same as a real set of double doors or curtains. You don't need to
pre-split anything.

## 4. Adding your music

Put your audio files in the `audio/` folder using these filenames (or
change the paths in `content.js`):

```
audio/mehandi.mp3
audio/haldi.mp3
audio/sangeet.mp3
audio/wedding.mp3
audio/reception.mp3
```

Each scene has its own track, and the site **crossfades** smoothly
between them as the guest moves through the journey — Mehandi's song
fades out as Haldi's fades in, and so on. This felt more like an actual
journey than one song playing the whole way through, but if you'd
rather have just one continuous song, just point all 5 filenames in
`content.js` at the same file and the crossfade will be seamless (it'll
just keep playing rather than restarting).

**Format**: MP3, ideally under ~5MB each. Doesn't need to be a full
song — a clean 1–3 minute instrumental loop works great, since it loops
automatically while a guest lingers on that scene.

**Note on autoplay**: browsers block audio from playing before the user
has interacted with the page at all. Since the very first thing a guest
does is drag the door open, that gesture "unlocks" audio for the rest of
the session — so this works automatically, no extra setup needed.

## 5. Set up real RSVP collection (~5 minutes)

Right now RSVPs are saved locally in each guest's browser as a backup,
with an "email us instead" fallback link — so it works immediately, but
responses won't land anywhere central until you do this:

1. Go to **[formspree.io](https://formspree.io)** and create a free account.
2. Create a new form — it'll give you a URL like `https://formspree.io/f/abc12345`.
3. Verify your email (Formspree needs this to know where to forward RSVPs).
4. Open `script.js`, find near the bottom:
   ```js
   const RSVP_ENDPOINT = "PASTE_YOUR_FORMSPREE_URL_HERE";
   ```
   replace with your real URL. Also update:
   ```js
   const RSVP_FALLBACK_EMAIL = "youremail@example.com";
   ```

Free tier covers 50 submissions/month — plenty for a guest list. If you
expect more, their paid tier or [Getform](https://getform.io) work the
same way.

## 6. Put it online

Easiest free option — **Netlify**:
1. Go to [netlify.com](https://netlify.com), sign up free.
2. Drag the whole `wedding-journey` folder onto the dashboard.
3. You get a live link instantly (rename it in site settings if you like).

**GitHub Pages** works too if you're comfortable with git: push this
folder to a repo, enable Pages in settings.

## 7. Customizing further

- **Colors per scene**: in `content.js`, at the bottom, under `THEMES` —
  each event has an `accent` (main color) and `glow` (soft particle tint).
- **Particle effect per scene**: in `content.js`, each scene has a
  `particles` field — options are `"sparkle"` (glitter, good for
  Sangeet), `"petals"` (falling flower petals), `"glow"` (soft floating
  light), or leave it blank for none.
- **Fonts**: Parisienne (script, for names/titles) + Cormorant Garamond
  (everything else), both free Google Fonts, loaded in `index.html`.
- **Adding/removing an event**: add or remove an entry in the `scenes`
  array in `content.js` — just make sure you have exactly one fewer
  entry in `portals` than you have in `scenes` (portals are the gaps
  *between* scenes).

## How the journey works, if you're curious

- Drag the door (or just tap it) to open
- Tap "Begin the Journey" on the welcome scene
- Each event scene has a "Continue" button (or swipe, or the arrow keys/
  side arrows) to move to the transition portal for the next event
- Drag or tap each portal open — once opened, it stays open if you go
  back and revisit it
- The dots at the top jump straight to any event scene, skipping the
  portal animations for quick navigation
- The Itinerary toggle switches to a plain, fast-reference list of all
  five events with an RSVP button — no journey required

## File structure

```
wedding-journey/
├── index.html       ← page structure (rarely needs editing)
├── styles.css        ← all visual styling
├── content.js         ← ALL your text, dates, image & audio filenames — edit this
├── script.js          ← interactivity logic (edit RSVP_ENDPOINT near the bottom)
├── images/            ← add your images here (see step 3)
├── audio/              ← add your music here (see step 4)
└── README.md           ← this file
```

Have an incredible wedding! 🎉
