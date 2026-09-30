# FBI Fingerprint Quest — GitHub Pages

A static, fictional FBI-style fingerprint identification interface for a puzzle/quest.

## What it does

- Player enters an Evidence ID.
- Player uploads a fingerprint image.
- The image is displayed locally in the browser.
- A fake FBI-style biometric analysis runs with a progress bar and terminal log.
- **The Evidence ID determines the result. The uploaded photo is intentionally not used to identify the subject.**
- Known IDs show:
  - subject information
  - subject photograph
  - ten fingerprint images
  - case/evidence metadata
  - match confidence
- Unknown IDs show a "NO DATABASE IDENTIFICATION" result.
- Decorative FBI-style buttons are intentionally non-functional.
- No backend/server is required.

## Deploy on GitHub Pages

1. Create a GitHub repository.
2. Upload all files while keeping the folder structure.
3. In GitHub, open **Settings → Pages**.
4. Under the source/build section, select the branch containing these files and the `/root` folder.
5. Save.
6. Open the generated GitHub Pages URL.

## Add your own characters

Open `script.js` and edit `DATABASE`.

Example:

```js
"EVD-5555": {
  name: "YOUR CHARACTER",
  alias: "ALIAS",
  dob: "01 JAN 1990",
  nationality: "UNITED STATES",
  status: "PERSON OF INTEREST",
  clearance: "LEVEL 03",
  caseNo: "CF-26-0001",
  confidence: "99.1%",
  photo: "assets/persons/EVD-5555/person.jpg",
  note: "Your case description.",
  fingers: {
    "LEFT THUMB": "assets/persons/EVD-5555/left-thumb.jpg",
    "LEFT INDEX": "assets/persons/EVD-5555/left-index.jpg",
    "LEFT MIDDLE": "assets/persons/EVD-5555/left-middle.jpg",
    "LEFT RING": "assets/persons/EVD-5555/left-ring.jpg",
    "LEFT LITTLE": "assets/persons/EVD-5555/left-little.jpg",
    "RIGHT THUMB": "assets/persons/EVD-5555/right-thumb.jpg",
    "RIGHT INDEX": "assets/persons/EVD-5555/right-index.jpg",
    "RIGHT MIDDLE": "assets/persons/EVD-5555/right-middle.jpg",
    "RIGHT RING": "assets/persons/EVD-5555/right-ring.jpg",
    "RIGHT LITTLE": "assets/persons/EVD-5555/right-little.jpg"
  }
}
```

Then create:

```text
assets/
└── persons/
    └── EVD-5555/
        ├── person.jpg
        ├── left-thumb.jpg
        ├── left-index.jpg
        ├── left-middle.jpg
        ├── left-ring.jpg
        ├── left-little.jpg
        ├── right-thumb.jpg
        ├── right-index.jpg
        ├── right-middle.jpg
        ├── right-ring.jpg
        └── right-little.jpg
```

## Important

This is a fictional interface and does not connect to FBI systems or perform real fingerprint identification.

The uploaded fingerprint stays in the user's browser. GitHub Pages does not receive the uploaded image unless you add a separate backend/upload service.

## Included demo IDs

- `EVD-1047`
- `EVD-2219`
- `EVD-3301`

Any other ID produces the no-match screen.
