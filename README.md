# Bodhi Precepts 齋日

A small web view of the six fast days (六齋日, liù zhāi rì), the three long
fasting months (三長齋月, sān cháng zhāi yuè), the new and full moons, and the
days the assembly gathers to recite the precepts (布薩, bùsà), built from the
DRBA calendar spreadsheet.

Open `index.html`. No build step, no dependencies, works straight off the
filesystem — and, served over the web, installs as an app on a phone or a
desktop.

## What is here

| File | What it is |
| --- | --- |
| `index.html` | The whole app. Three views: **Today**, **Upcoming**, and **Settings** (the gear). |
| `manifest.webmanifest` | Makes it installable: the name, the icons, the standalone display. |
| `sw.js` | The service worker. Keeps a copy of the app so an installed one opens offline. |
| `icon.svg` | The icon: a cinnabar seal carrying a crescent and the pole star. The source the rest are cut from. |
| `icon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` | Rasterised from `icon.svg` — for browsers that will not take an SVG, for an iOS home screen, and for an Android launcher that crops to its own shape. |
| `data.js` | The dataset as `window.DRBA_DATA`. Loaded by `index.html`; a plain script tag so it works over `file://`. |
| `data.json` | The same records, indented, for anything that wants to read them programmatically. |
| `data.csv` | The same records as CSV, UTF-8 **with BOM** so Excel on Windows keeps the diacritics. |
| `build_data.py` | Regenerates all three from `DRBA_Calendar.xlsx`. |
| `DRBA_Calendar.xlsx` | The source workbook. Still the place to change rules or extend dates. |

The three data files are **generated**. Change the workbook or the script and
re-run it; never edit them by hand.

## Installing it

It is a progressive web app, so it installs from the browser on all three —
no store, no download.

- **Android, and Chrome or Edge on a desktop**: Settings has an **Install
  Bodhi Precepts** button whenever the browser offers a prompt, and the
  browser's own menu or address bar will offer it too.
- **iPhone and iPad**: Safari never offers a prompt, so use the Share button
  and **Add to Home Screen**. Settings says as much when it sees an iOS
  browser.
- **Anything else**: look for Install or Add to Home Screen in the browser's
  own menu, which Settings will tell you to do.

Once installed it opens in its own window, without the browser around it, and
works with no connection at all: `sw.js` keeps the page, the dataset and the
icons on the device. Each of those is refreshed in the background as it is
served, so a new version lands at the next launch with nothing to clear.

Opening `index.html` straight off the filesystem still works and always will.
There is simply no service worker there, and none is wanted — the page is
already on the disk.

## Regenerating

```
pip install openpyxl
python3 build_data.py
```

The script reads the `lunar_ref` sheet (the Hong Kong Observatory
transcription), the `lookup` sheet, and the dharma events typed off the DRBA
printed calendar, applies the fast-day rules, and rewrites `data.js`,
`data.json` and `data.csv`. Paths are at the top of the script.

## The record shape

One object per day:

```json
{
  "date": "2026-09-09",
  "weekday": "Wed",
  "monthCn": "七月",   "monthPy": "qi yue",  "monthNum": 7,
  "monthLabel": "7th month", "leap": false,
  "dayCn": "廿八",     "dayPy": "nian ba",   "dayNum": 28,
  "monthLength": 29,
  "fast": true,
  "moon": "",
  "longFast": false,
  "source": "DRBA 2026 calendar",
  "event": ""
}
```

`moon` is `"new"`, `"full"` or empty. `source` says whether that day's lunar
data came off the DRBA printed calendar or the HKO tables. Same-day events are
packed into `event` separated by pipes.

What is stored is what is fixed. Anything that is a reading rather than a rule
— which days carry the recitation, whether a leap month carries the long fast
— is derived in the browser from a setting, so changing your mind costs
nothing and rebuilds nothing.

## The rules it applies

- **Six fast days**: lunar 8, 14, 15, 23 and the last two days of the month.
  A 29-day month therefore uses 28 and 29. The day list is the one given in
  佛說四天王經 (Fo shuo si tianwang jing, Taisho T15n0590), where envoys
  descend on the 8th and 23rd, princes on the 14th and 29th, and the kings
  themselves on the 15th and 30th.
- **Three long fasting months**: the 1st, 5th and 9th lunar months.
- **Leap months** are flagged as leap wherever they appear. Whether the
  repeat also carries the long fast is a reading rather than a rule, so it is
  a setting, off by default: the DRBA 2023 calendar points the other way — its
  leap 2nd month got no repeat of the monthly memorial and no repeat of Guan
  Yin's birthday — and it is worth confirming at CTTB before 2028-06-23, when
  the next one starts.
- **New and full moon** follow the calendar convention, day 1 and day 15,
  rather than the astronomical instant. The discs are drawn from the day
  number, so the 15th shows as very nearly rather than exactly full — that gap
  is the convention, not a bug.
- **Quarter moons** follow from the same convention: a quarter cycle either
  side of the full moon puts them at lunar 8 and 23, which the tradition
  already keeps as fast days. They show as the disc alone, unnamed, so a
  glance at a card or a row gives the phase without another label. Derived in
  the browser, like the recitation days.
- **Precept Recitation** (布薩, bùsà): the days the assembly gathers to recite
  the precepts. This is the one flag whose days are a choice rather than a
  rule, so it is a setting and the footer says so. Out of the box it is every
  other Saturday. Where it lands on a fast day the flag is an extra marking on
  top; where it does not — most of a fortnightly weekend, and lunar 1 under
  the other reckoning — the card takes a colour of its own.

The last day of a lunar month is found by looking ahead to the next day 1
rather than from `monthLength`, which is short for the truncated month at the
end of the dataset.

## Settings

The gear opens a Settings view. Its panels run in the order they are most
often touched, the rarest last — **Week start**, **Days on the Today view**,
**Precept Recitation days**, **Leap months**, **Install**, and then **Where
this is kept**. A new panel goes second from the bottom, above *Where this is
kept*, which stays the tail of the page.

**Week start** — any of the seven days, or none; Saturday out of the box. It
draws a break where each new week begins, on both Today and Upcoming, so a run
of fast days can be read against a working week. Rows are grouped by the week
they fall in rather than by adjacency, so the break still lands correctly
between two filtered rows that sit weeks apart.

**Days on the Today view** — how many day cards to show, counting today as the
first. Eight out of the box, any whole number from 1 to 366.

**Precept Recitation days** — which days carry the flag, reckoned one of four
ways:

- **Every other Saturday** (the default) or **every other Sunday**, for an
  assembly that gathers at weekends: every fourteenth day either side of a
  reference date, 12 September 2026 out of the box. The fortnight never
  skips — anchoring on the nearer moon instead would stretch to three weeks
  whenever the moons drift, and keeping the rhythm matters more. The trade is
  that a fixed fortnight loses the moon over the years: across this dataset
  these days sit a mean of 2.9 days from a new or full moon in the first year
  and 3.7 in the last. Picking Saturday or Sunday pulls the reference date
  onto that weekday, so the two cannot contradict each other.
- **By lunar day**, which then takes the two days themselves, typed in — 1 and
  15 to start with, the new moon and the full. Any day from 1 to 30 will do;
  leaving a box blank gives a single recitation a month, and leaving both
  blank drops the flag. Day 30 means a month of 29 days has none. A switch
  under the boxes makes the second day **the last day of the month** instead
  of a fixed number — the 29th or the 30th as the month falls, so it never
  skips a short month the way day 30 does. Turning it back off returns the box
  to whatever number it held, or to 15.
- **Not at all**, which drops the flag, its filter and its column from every
  view.

**Leap months** — whether a leap month carries the long fast, off out of the
box. The dataset's one leap month, the leap 5th of 2028, is 29 days.

**Install** — the button, or the instructions for the browser in front of you.
See *Installing it* above.

**Where this is kept** — and a button to put everything back.

### What a reader who has set nothing gets

Weeks beginning on Saturday, eight day cards, Precept Recitation on every
other Saturday, leap months carrying no long fast, and Upcoming showing every
day in the dataset with the dharma events hidden.

### Upcoming's own controls

Its table opens on every day in the dataset; the filters sit right above it
and say what it is showing, so it carries no heading of its own. They gather
rather than replace one another: each chip is its own toggle, a day shows if
any chosen chip matches it, and with none chosen every day shows. **Show
dharma events** sits apart from them and is not a filter at all — it decides
whether the events are drawn, and they arrive not as a column but as a second
line under the day, wearing that day's colour and hatch so the two read as one
block. A start date trims the front of the table, and the first 500 matching
days are drawn; past that it says so and points at `data.csv`. **Copy what is
shown** puts every matching day on the clipboard as TSV, not only the drawn
500.

### Where it is kept

These settings, the theme, and Upcoming's filters and start date are kept in
`localStorage` under `bodhi.settings`. Nothing is sent anywhere, and storage
failures — private mode, or a browser that blocks it over `file://` — fall
back to the defaults silently. Settings saved by an older version are read
where they still make sense and ignored where they do not.

Which day is today is rechecked every minute rather than read once at load, so
a page left open overnight — the usual state of a phone — moves on at midnight
instead of holding yesterday. A start date on Upcoming that the reader never
chose follows along; one they did choose stays where they put it.

## The look

Sumi: ink on paper, cinnabar for what matters. Warm paper ground, hairline
rules, a lot of empty space, and two inks only — black for the substance,
seal red for the fast days. Dark is evening ink: diluted 墨 is never black but
a blue-grey, so the ground is slate rather than soot, the strokes are warm
paper, and the cinnabar drops back to the dustier clay it dries to.

The masthead sets 六齋日 over *Days of Abstinence*, the glyphs and their
reading stacked as a title and its gloss rather than run together on one line.
The launcher and the browser tab carry the app's own name instead, *Bodhi
Precepts 齋日*, shortened to *Bodhi Precepts* where a home screen has no room
for it.

A long fasting month is a hatch — Indra's net — laid over whatever colour the
row or card already carries, on both Today and Upcoming. It reads as one
continuous stretch rather than a run of separate days, and because it sits
over the colour rather than replacing it, the marks for the single days inside
it are undisturbed. The hatch is anchored to the table's own origin, so the
diagonals do not restart at every row edge. That anchoring is measured from
the laid-out rows, so it is redone when Upcoming is first shown and again
after the window changes width — a phone turned on its side — or the rows
would move out from under it.

A day card is coloured by what falls on it, so the overlaps read at a glance:
an ordinary day is bare, a Precept Recitation on its own is a cool ink wash, a
fast day is a cinnabar one, and a recitation landing on a fast day — the
heaviest of the three — takes the cinnabar deeper still. Recitation days are
marked in the moon band with a four-pointed pole star.

The moon band is a rolling window of 29 days centred on today, numbered by
Gregorian day so today is easy to find. It carries nothing but the phase, the
fast days, the recitation days and today. Today's disc is marked by the cell
around it — a wash, a hairline box and a caret above the bold date — and not
by the disc itself, which is drawn exactly like its neighbours so the phase is
read the same way all along the band.

The exact new and full moons carry a halo, **but only in the band**, where
they sit in a run of all but identical discs and need telling apart: the disc
under the halo is either wholly lit or wholly dark. On paper that halo is a
soft grey; on the dark ground a grey halo is lost against an already-bright
full moon, so there it becomes actual light spilling onto the ground.
Everywhere else — the day cards, Upcoming's lists, its table — a disc stands
alone among the four shapes the calendar draws, and is named beside it on a
card, so it needs no such mark and goes without one.

The icon is a cinnabar seal carrying the two marks the app uses: the moon of
the lunar month and the four-pointed pole star of the Precept Recitation. The
seal is its own ground, so it needs no light and dark variant — it reads the
same on either tab strip. The maskable one runs that ground edge to edge with
the mark pulled into the safe zone, so an Android launcher cropping to its own
shape cannot take the star off.

On a phone the browser's own chrome — the address bar, or the status bar in a
standalone window — is tinted to the paper the page is on, and follows the
theme as it changes. It is set from the `--paper` token itself rather than
from a second copy of the colour, so the chrome cannot drift from the page.
The manifest deliberately carries **no** `theme_color`: a static one there
governs an installed app's status bar and cannot follow a theme that changes,
which left a dark app under a light strip. With the field absent the meta tag
governs instead. A small script in the head settles the theme, and that meta,
before the body exists, so an installed copy never opens on a flash of the
wrong ground.

On an iPhone the standalone status bar is still fixed light
(`apple-mobile-web-app-status-bar-style: default`); following the theme there
needs `black-translucent` with `viewport-fit=cover` and safe-area padding, and
is not done yet.

The icon beside the gear cycles three themes — auto, light, dark — and the
choice is kept with the rest. Auto follows the **device clock**, not the
system setting: light from 6am to 6pm, dark outside it, rechecked while the
page is left open.

Lunar dates are written month then day throughout — `7月28日`, and `閏5月1日`
in a leap month. Gregorian dates stay in the Western order, and a span names
the year once unless it turns over: *26 Aug to 23 Sep 2026*, but *14 Dec 2026
to 11 Jan 2027*.

Upcoming's two lists run on one grid rather than a row each, so their four
columns — Gregorian date, weekday, moon, lunar date — line up down the panel
instead of each row placing its own. The moon cell is drawn whether or not a
moon falls there, or the column would come and go.

Its table has six columns — Date, Day, Lunar, Fast, Recitation, Moon — centres
every heading and cell, and shares the width out by proportion rather than
letting whichever row holds the longest text decide. The lunar date is set as
two unbreakable pieces, so a narrow column can only ever break at 月, and each
number sits in a box of the same width, which puts the 月 and 日 of a wrapped
date in the same column.

The year sits on the week heading rather than on every row; with weeks off
there is no heading to carry it, so it stays on the row. The Fast column does
double duty: **Long Fast** for a day inside a long fasting month, and the
day's own fast marked under it as 齋. Recitation is the pole star and the moon
is the same disc the band draws. The day cards name their marks and carry the
same glyphs — *Fast day 齋*, *Precept Recitation ✦*, *Full moon* with its
disc.

## Sources

- Lunar dates: Hong Kong Observatory Gregorian-Lunar Calendar Conversion
  Tables, 2026–2029.
- Dharma events, and all lunar data through 2027-01-31: the DRBA printed
  calendar for 2026.
- The six-day list: 佛說四天王經, Taisho T15n0590.
- The `verification` sheet in the workbook records what has been checked
  against a source, what was decided by hand, and what is still open.

## Coverage

2026-08-12 to 2029-12-31. Past that the Today view says so instead of
guessing. To extend, add years to `lunar_ref` in the workbook from the HKO
tables and re-run `build_data.py`.
