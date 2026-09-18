# Bodhi Precepts 齋日

A small web view of the six fast days (六齋日, liù zhāi rì), the three long
fasting months (三長齋月, sān cháng zhāi yuè), the new and full moons, and the
days the assembly gathers to recite the precepts (布薩, bùsà), built from the
DRBA calendar spreadsheet — and, beside the calendar, an index of what
actually triggers an offense under the Brahma Net precepts (梵網經).

Open `index.html`. No build step, no dependencies, works straight off the
filesystem — and, served over the web, installs as an app on a phone or a
desktop.

## What is here

| File | What it is |
| --- | --- |
| `index.html` | The whole app. Four views: **Today**, **Upcoming**, **Precepts** and **Settings**. |
| `manifest.webmanifest` | Makes it installable: the name, the icons, the standalone display. |
| `sw.js` | The service worker. Keeps a copy of the app so an installed one opens offline. |
| `icon.svg` | The icon: a cinnabar seal carrying a crescent and the pole star. The source the rest are cut from. |
| `icon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` | Rasterised from `icon.svg` — for browsers that will not take an SVG, for an iOS home screen, and for an Android launcher that crops to its own shape. |
| `data.js` | The calendar dataset as `window.DRBA_DATA`. Loaded by `index.html`; a plain script tag so it works over `file://`. |
| `precepts.js` | The Brahma Net dataset as `window.BRAHMA_DATA` — the offense clauses, the Upasaka precepts and the legend the Precepts view reads. Loaded the same way. |
| `data.json` | The same records, indented, for anything that wants to read them programmatically. |
| `data.csv` | The same records as CSV, UTF-8 **with BOM** so Excel on Windows keeps the diacritics. |
| `build_data.py` | Regenerates all three from `DRBA_Calendar.xlsx`. |
| `DRBA_Calendar.xlsx` | The source workbook. Still the place to change rules or extend dates. |

`data.js`, `data.json` and `data.csv` are **generated**. Change the workbook or
the script and re-run it; never edit them by hand. `precepts.js` is not
generated here — it came off the CBETA P5 XML of T24n1484 with the editorial
work the Precepts view's own Methodology note describes.

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
icons on the device. The page itself is fetched fresh whenever there is a
network, so a new version is there the moment it is published rather than one
launch late, and the fetch races a 2.5-second timer so a slow connection
cannot hang the launch — the copy on the device wins if the network is not
back in time. Everything else is served from that copy and refreshed behind
it.

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

`monthLength` is `null` for the lunar month the dataset is cut off in, whose
end is past the last row and so cannot be measured. The page never counts on
it: the last day of a month, and the distance back from it, are found by
looking ahead to the next day 1.

What is stored is what is fixed. Anything that is a reading rather than a rule
— which days carry the recitation, whether a leap month carries the long fast
— is derived in the browser from a setting, so changing your mind costs
nothing and rebuilds nothing.

## The rules it applies

- **Six fast days**: lunar 8, 14, 15, 23 and the last two days of the month.
  A 29-day month therefore uses 28 and 29. The day list is the one given in
  佛說四天王經 (Fo shuo si tianwang jing, Taisho T15n0590), where envoys
  descend on the 8th and 23rd, princes on the 14th and 29th, and the kings
  themselves on the 15th and 30th. Which days actually carry the fast is a
  setting — that list is where it starts, not where it is fixed. See *Fast
  days* below.
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
- **Dhūta period** (頭陀, dhutaṅga): off out of the box. The austerities are
  kept over two
  stretches of the lunar year — from 1月15日 to 3月15日, and from 8月15日 to
  10月15日. Read off the month and the day rather than by walking between the
  boundary dates, so a period the dataset opens or closes in the middle of
  still marks the days it does have. A leap month falling inside a span
  carries it: that is a different question from the leap long fast, which
  asks whether a repeated month is itself one of the three named months,
  where this is a stretch of time with two ends. Nothing in this dataset
  tests it — the one leap month here, the leap 5th of 2028, is outside both
  spans.
- **Precept Recitation** (布薩, bùsà): the days the assembly gathers to recite
  the precepts. This is the one flag whose days are a choice rather than a
  rule, so it is a setting and the footer says so. Out of the box it is every
  other Saturday. Where it lands on a fast day the flag is an extra marking on
  top; where it does not — most of a fortnightly weekend, and lunar 1 under
  the other reckoning — the card takes a colour of its own.

The last day of a lunar month, and the distance back from it that a fast-day
rule counts, are found by looking ahead to the next day 1 rather than from
`monthLength`, which is null for the month the dataset is cut off in. Where
there is no next day 1 to look ahead to — the last few weeks of the data — a
rule counted from the end simply does not fire, rather than firing on a guess.

## Getting around

Four views, and one set of tabs drawn twice. On a phone they are a bar across
the foot of the screen; from 820px up the same cells stand on end as a narrow
rail down the left — 6.5rem, half what it began at, because it is a place to
change view from rather than a column of the page — with the active one marked by a leading rule rather than a
filled cell — a cell a quarter of the screen tall, filled, reads as a slab
rather than a selection. Both navs are always in the markup and the media
query alone decides which one shows, so turning a tablet on its side costs
nothing: no resize listener, nothing to redraw. A fifth tab would be one row
in `TABS` and no layout change in either nav.

The bar is **in ordinary flow** at the foot of a column exactly one viewport
tall, not `position:fixed`. A fixed bar is placed against the layout
viewport, which on Android Chrome keeps the taller URL-bar-hidden height; the
bar then hangs below the glass with its labels cut off, and no amount of
measuring from script corrects it, because the compositor moves fixed
elements itself during a fling. A bar in flow at the end of a `100dvh` column
cannot be anywhere but on screen. The cost, taken knowingly: the browser's
URL bar no longer auto-hides while scrolling, because the document itself no
longer scrolls. An installed copy has no URL bar to hide, and that is the
case this is for.

The consequence is that `#scroll`, not the document, is the thing that
scrolls. Anything reading or setting `window.scrollY` goes through
`scroller()` instead.

## Precepts

The third tab, under the 戒 glyph: what actually triggers an offense in the
ten major and forty-eight minor precepts of the Brahma Net Sutra, with the
Upasaka precepts on a second tab beside them. Clauses can be sorted by
precept, by canonical order or by how intrusive they are, filtered by band
and by a dozen facets, searched, and hidden one by one — each view keeping
its own hidden set. Its own corner of storage, `bodhi.precepts`, and its own
Reset inside the filter sheet.

It arrived as a separate page and is re-skinned onto this app's tokens
rather than keeping its own, so it follows light and dark with everything
else; its four webfonts are gone, which is what lets the app keep working
offline and over `file://`. Its band and remark colours are the `--t1`…`--t5`
and `--bn-*` tokens at the top of the stylesheet, stated once per theme.

Two things about it are worth knowing before editing it:

- **Its CSS is scoped to `#view-precepts`, and the seven class names this
  page already spends elsewhere are prefixed `p-`** — `.p-card`, `.p-tags`,
  `.p-lit` and so on. `.card` above all: unprefixed, the day cards on Today
  would take the offense cards' rules and vice versa.
- **Its script is its own IIFE and every listener is bound to the view
  element, never to the document.** Its delegated `.card` handler on the
  document would otherwise open and close the day cards on Today along with
  its own.

Nothing in it is drawn until the tab is first opened: the dataset is the
largest thing the app carries and this is not the view it opens on.

## Settings

Settings is the last tab. Its panels run in the order they are most
often touched, the rarest last — **Week start**, **Days on the Today view**,
**Fast days**, **Precept Recitation days**, **Dhūta period**, **Leap
months**, **Install**, and then **Where this is kept**. The two panels that say which days carry a mark
sit together in the middle. A new panel goes second from the bottom, above
*Where this is kept*, which stays the tail of the page.

**Week start** — any of the seven days, or none; Saturday out of the box. It
draws a break where each new week begins, on both Today and Upcoming, so a run
of fast days can be read against a working week. Rows are grouped by the week
they fall in rather than by adjacency, so the break still lands correctly
between two filtered rows that sit weeks apart.

**Days on the Today view** — how many day cards to show, counting today as the
first. Eight out of the box, any whole number from 1 to 366.

**Fast days** — which days carry the fast, in every view. Each day is a rule
of two parts: which end of the lunar month it counts from, and how far along.
Counting from the start, 8 is the 8th. Counting from the end, 1 is the last
day of the month — the 30th of a long month, the 29th of a short one — so it
resolves by itself rather than by special-casing 29 and 30, and can never land
on a day the month does not have. The default six are 8, 14, 15, 23, and the
last two days.

Three presets:

- **The default six** — 8, 14, 15, 23, and the last two days of the month.
- **Six, aligned to the moon** — 1, 8, 14, 15, 23, and the last day of the
  month: the last day of one month and the 1st of the next, in place of the
  last two days. It follows the shape underneath the list — the two half
  moons, the full moon and the new, and the day before each. The full moon is
  paired with the day before it, 14 and 15; this pairs the new moon the same
  way, the month's last day with the 1st, which is where the Chinese calendar
  puts the conjunction. Still six days a month.
- **The ten fast days** — 1, 8, 14, 15, 18, 23, 24, 28, and the last two days,
  as listed in the Earth Store Sutra, Taisho T13n0412.

Days are added and removed freely, up to thirty — a lunar month has no more
than that, so a longer set could only repeat itself. Naming the same day twice
folds the two rows into one. Rows stay in the order they were built, so
nothing moves under a reader mid-edit, and a preset is still recognised
whatever order its days were arrived at.

The preview under the rows says what the set gives in the month in front of
you, in a 30-day month and in a 29-day month, with each month's last day
marked — that being where counting from one end and from the other part
company. Clearing every day drops the fast entirely: no mark on any view, and
the filter and the band's legend entry go with it. The table's Fast column
stays, because it also carries the long fasting months.

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

**Dhūta period** — whether the two dhūta stretches are drawn, off out of the
box. They show as a houndstooth over the days they cover, on both Today and
Upcoming, and when they are on they also get a filter chip and a line on
Upcoming's third card.

**Leap months** — whether a leap month carries the long fast, off out of the
box. The dataset's one leap month, the leap 5th of 2028, is 29 days.

**Install** — the button, or the instructions for the browser in front of you.
See *Installing it* above.

**Where this is kept** — and a button to put everything back. It puts back
the settings on this page; the Precepts view keeps its own, with its own
Reset inside its filter sheet.

### What a reader who has set nothing gets

Weeks beginning on Saturday, eight day cards, the default six fast days,
Precept Recitation on every other Saturday, the dhūta periods unmarked, leap
months carrying no long fast, and Upcoming showing every day in the dataset
with the dharma events hidden.

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

The chips and the start date share one wrapping row. The date carries no
`margin-left:auto` — pushing it to the far edge is what stranded it on a line
of its own as soon as the chips filled the first — so it flows with them and
wraps only when it has to. **Dhūta periods** appears among them only while
that setting is on, the way the Precept Recitation chip does.

The `fast` column in `data.csv` and `data.json` is the **default** six, fixed
when they were generated; the page reads whichever days are set under the
gear, and the copy button follows the page rather than the files. A note under
the download links says so.

### Where it is kept

These settings — the fast-day rules among them — the theme, and Upcoming's
filters and start date are kept in `localStorage` under `bodhi.settings`. Nothing is sent anywhere, and storage
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
It carries the open view's own name: three of the four are the calendar and
take the app's, while Precepts is a different book and says so — 梵網戒 over
*Brahmā Net Precepts* — which is why that view needs no second heading inside
itself.
The launcher and the browser tab carry the app's own name instead, *Bodhi
Precepts 齋日*, shortened to *Bodhi Precepts* where a home screen has no room
for it.

Two stretches of time are drawn as textures rather than as marks on the days
inside them. A long fasting month is a hexagonal net — Indra's net; a dhūta
period is a houndstooth. They overlap for weeks at a time — the 1st and 9th
months sit inside a dhūta period entire — so a day can carry both at once,
and they stay separable by working at different scales and in different
marks rather than by fighting over the same one: hairlines on a 17×30 tile
against a woven check at 24px.

Both are tiled SVGs: neither hexagons nor a houndstooth weave can be drawn
with repeating gradients, and an SVG in a `background-image` has no CSS
context to read a token from, so each carries its colour and is restated for
the dark ground. Those are the only colours in the stylesheet kept twice; they
sit beside each other so they cannot drift apart unseen. The houndstooth is
generated from its weave — a 2/2 twill with a four-thread colour repeat —
rather than drawn by hand, which is the only way the teeth come out right.

Each is laid over whatever colour the
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
full moon, so there it becomes actual light spilling onto the ground — kept
to the least that still works. The full moon is the case that sets the floor:
a bright disc among near-identical bright discs, it stops being picked out
before the new moon does, which has the dark ground to sit against.
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
An **installed** app on Android is harder. Only the status bar is the app's to
colour at all — the navigation bar at the foot of the screen follows the
phone's own system theme and is not ours — and a `theme_color` in the manifest
would fix that status bar to one value for good, matching one theme and
clashing with the other. So the manifest deliberately carries none, leaving
the meta tag to govern, and a small script in the head settles the theme and
that meta **before the body exists**, which is the only point early enough for
the colour to be picked up.

`background_color`, which paints the splash, stays the light paper. That it
differs from the dark ground is useful: if a dark-themed app ever shows a
light status bar, the colour itself says the meta was ignored and one of the
manifest's values won.

On an iPhone the standalone status bar is fixed light
(`apple-mobile-web-app-status-bar-style: default`); following the theme there
needs `black-translucent` with `viewport-fit=cover` and safe-area padding, and
is not done yet.

A filled chip in the Precepts view — the active sort, the open filter button,
a tier pill — is the ink itself with the paper written on it. On the dark
ground that cannot simply invert: the ink token is a near-white, right as a
letterform and glaring as a slab, so the dark half of the pair is a parchment
instead. Both are `--bn-fill` and `--bn-fill-ink`.

The icon in the masthead cycles three themes — auto, light, dark — and the
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

## The footer

It opens with **what this page is marking** rather than what the tradition
says in general: a term and its reading, one row each, built from the
settings as they actually stand. Most of what the calendar draws is a setting,
and a reader who has changed one should not have to remember that they did.
A star marks the rows Settings can change, and a note under the list says so
once instead of every row repeating it. The dataset's own extent and the
sources follow.

## Sources

- Lunar dates: Hong Kong Observatory Gregorian-Lunar Calendar Conversion
  Tables, 2026–2029.
- Dharma events, and all lunar data through 2027-01-31: the DRBA printed
  calendar for 2026.
- The six-day list: 佛說四天王經, Taisho T15n0590.
- The `verification` sheet in the workbook records what has been checked
  against a source, what was decided by hand, and what is still open.
- The Brahma Net precepts: the CBETA P5 XML of 梵網經, Taisho T24n1484, in
  Bhikshu Dharmamitra's Kalavinka translation and his emended Chinese. The
  clause splits, the gates, the practical readings and the ranking are
  editorial; the Precepts view's own Methodology note says which is which.

## Coverage

2026-08-12 to 2029-12-31. Past that the Today view says so instead of
guessing. To extend, add years to `lunar_ref` in the workbook from the HKO
tables and re-run `build_data.py`.
