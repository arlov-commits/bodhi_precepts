# Working in this repo

## Commit to `main`

Work goes on `main` and is pushed there. If a session is handed a
`claude/...` branch by its harness, ignore it — `main` is the convention here
unless the user says otherwise in that session. Don't open a pull request
unless asked.

## What the project is

A single-page calendar of the six fast days, built from a DRBA spreadsheet.

- `index.html` is the whole app — markup, CSS and vanilla ES5 in one file. No
  build step, no dependencies, and it must keep working over `file://`.
- `data.js` / `data.json` / `data.csv` are **generated** by `build_data.py`
  from `DRBA_Calendar.xlsx`. Never hand-edit them; change the workbook or the
  script and re-run it.
- `README.md` documents the rules, the settings and the look. Keep it in step
  with the code in the same commit.
- `icon.svg` is the favicon source; the two PNGs are rasterised from it.

Anything that is a reading rather than a rule (which days carry Precept
Recitation, whether a leap month carries the long fast) belongs in Settings
and is derived in the browser, not baked into the dataset.

## Verify before committing

Changes here are visual and get checked by measurement, not by eye. Chromium
is preinstalled; Playwright must be pointed at it:

```js
chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
```

Serve the **repo root** (`python3 -m http.server 8123`) — serving a scratch
directory yields a blank page. Check both themes and both a desktop and a
phone viewport, and watch for page errors, not just for the screenshot
looking right.

## Traps this codebase has already fallen into

- **Use `background-color`, never the `background` shorthand**, on anything
  that can also carry the long-fast hatch. The shorthand silently wipes
  `background-image`, and a more specific rule then kills the hatch.
- **The hatch is anchored per row** from `offsetTop`, which reads 0 while
  Upcoming is hidden and goes stale when rows reflow. `alignHatch()` has to
  run when the view is shown and after a resize, not only when the table is
  built.
- **Nothing derived from the wall clock may be read once.** Which day is today
  and which theme `auto` resolves to are both rechecked on a timer, because
  the page gets left open across midnight.
- **Colours come from the tokens**, not from a second copy. The browser
  `theme-color` reads `--paper` back off the root for this reason.
- Contrast is checked in both themes. Note that the row check reports
  transparent backgrounds as black, so a low number there may be an artifact
  of the harness rather than a real failure — measure against the real ground
  before "fixing" it.
