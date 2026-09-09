# Fast days

A small web view of the six fast days (六齋日, liù zhāi rì), the three long
fasting months (三長齋月, sān cháng zhāi yuè), and the new and full moons,
built from the DRBA calendar spreadsheet.

Open `index.html`. No build step, no dependencies, works straight off the
filesystem.

## What is here

| File | What it is |
| --- | --- |
| `index.html` | The whole app. Three views: **Today**, **Upcoming**, and **Settings** (the gear). |
| `data.js` | The dataset as `window.DRBA_DATA`. Loaded by `index.html`; a plain script tag so it works over `file://`. |
| `data.json` | The same records, indented, for anything that wants to read them programmatically. |
| `data.csv` | The same records as CSV, UTF-8 **with BOM** so Excel on Windows keeps the diacritics. |
| `build_data.py` | Regenerates all three from `DRBA_Calendar.xlsx`. |
| `DRBA_Calendar.xlsx` | The source workbook. Still the place to change rules or extend dates. |

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
data came off the DRBA printed calendar or the HKO tables.

## The rules it applies

- **Six fast days**: lunar 8, 14, 15, 23 and the last two days of the month.
  A 29-day month therefore uses 28 and 29. The day list is the one given in
  佛說四天王經 (Fo shuo si tianwang jing, Taisho T15n0590), where envoys
  descend on the 8th and 23rd, princes on the 14th and 29th, and the kings
  themselves on the 15th and 30th.
- **Three long fasting months**: the 1st, 5th and 9th lunar months.
- **Leap months** are counted as long fasting months and flagged everywhere
  they appear. This reading is provisional. The DRBA 2023 calendar points the
  other way — its leap 2nd month got no repeat of the monthly memorial and no
  repeat of Guan Yin's birthday — so it is worth confirming at CTTB before
  2028-06-23, when the next one starts.
- **New and full moon** follow the calendar convention, day 1 and day 15,
  rather than the astronomical instant. The moon discs in the Today view are
  drawn from the day number, so the 15th shows as very nearly rather than
  exactly full — that gap is the convention, not a bug. The discs are a
  rolling window of 29 days centred on today, numbered by Gregorian day, so
  today is easy to find; they carry nothing but the phase, the fast days, the
  recitation days and today.
- **Precept Recitation** (布薩, bùsà): the days the assembly gathers to recite
  the precepts. Two a month by default — lunar 1 and 15, the new moon and the
  full. The 15th is already a fast day, so there the flag is an extra marking
  on top; the 1st is not, nor is most of a fortnightly weekend, so those take
  the third card colour. Which days count is a setting, not a fixed rule, so this is
  derived in the browser rather than stored in the dataset. The last day is found by looking ahead to the next
  day-1 rather than from `monthLength`, which is short for the truncated month
  at the end of the dataset.

## Settings

The gear opens a Settings view, which decides which days carry the Precept
Recitation flag. It is reckoned one of four ways:

- **By lunar day** (the default), which then takes the two days themselves,
  typed in: 1 and 15 by default, the new moon and the full. Any day from 1 to
  30 will do; leaving a box blank gives a single recitation a month, and
  leaving both blank drops the flag. Day 30 means a month of 29 days has none.
- **Every other Saturday** or **every other Sunday**, for an assembly that
  gathers at weekends: every fourteenth day either side of a reference date,
  12 September 2026 by default. The fortnight never skips — anchoring on the
  nearer moon instead would stretch to three weeks whenever the moons drift,
  and keeping the rhythm matters more. The trade is that a fixed fortnight
  loses the moon over the years: across this dataset these days sit a mean of
  2.9 days from a new or full moon in the first year and 3.7 in the last.
  Picking Saturday or Sunday pulls the reference date onto that weekday, so
  the two cannot contradict each other. Recitation then usually falls on a day
  that is not a fast day, which is what the third card colour is for.
- **Not at all**, which drops the flag, its filter and its column from every
  view.

Settings also carries how many day cards the Today view shows, counting today
as the first — seven by default, any whole number from 1 to 366.

The week start — any of the seven days, or none — draws a break where each new
week begins, on both Today and Upcoming, so a run of fast days can be read
against a working week. Rows are grouped by the week they fall in rather than
by adjacency, so the break still lands correctly between two filtered rows
that sit weeks apart.

These settings, the theme, and Upcoming's filter and start date are kept in
`localStorage` under `bodhi.settings`. Nothing is sent anywhere, and storage
failures (private mode, or a browser that blocks it over `file://`) fall back
to the defaults silently.

## The look

Sumi: ink on paper, cinnabar for what matters. Warm paper ground, hairline
rules, a lot of empty space, and two inks only — black for the substance,
seal red for the fast days. Dark is evening ink: diluted 墨 is never black but
a blue-grey, so the ground is slate rather than soot, the strokes are warm
paper, and the cinnabar drops back to the dustier clay it dries to.

A long fasting month is a hatch — Indra's net — laid over whatever colour the
row or card already carries, on both Today and Upcoming. It reads as one
continuous stretch rather than a run of separate days, and because it sits
over the colour rather than replacing it, the marks for the single days inside
it are undisturbed. The hatch is anchored to the table's own origin, so the
diagonals do not restart at every row edge.

A day card is coloured by what falls on it, so the overlaps read at a glance:
an ordinary day is bare, a Precept Recitation on its own is a cool ink wash, a
fast day is a cinnabar one, and a recitation landing on a fast day — the
heaviest of the three — takes the cinnabar deeper still. Recitation days are
marked in the moon band with a four-pointed pole star.

The exact new and full moons carry a halo. The days either side of them are
all but identical discs, and this tells them apart without another key: the
disc under the halo is either wholly lit or wholly dark. On paper the halo is
a soft grey; on the dark ground a grey halo is lost against an already-bright
full moon, so there it becomes actual light spilling onto the ground.

The icon beside the gear cycles three themes — auto, light, dark — and the
choice is kept with the rest. Auto follows the **device clock**, not the
system setting: light from 6am to 6pm, dark outside it, rechecked while the
page is left open.

Lunar dates are written month then day throughout — `7月28日`, and `閏5月1日`
in a leap month. Gregorian dates stay in the Western order, and a span names
the year once unless it turns over: *26 Aug to 23 Sep 2026*, but *14 Dec 2026
to 11 Jan 2027*.

Upcoming centres every heading and cell, and shares its columns out by
proportion rather than letting whichever row holds the longest text decide.
The lunar date is set as two unbreakable pieces, so a narrow column can only
ever break at 月, and each number sits in a box of the same width, which puts
the 月 and 日 of a wrapped date in the same column.

The year sits on the week heading rather than on every row; with weeks off
there is no heading to carry it, so it stays on the row. The Fast
column does double duty: **Long Fast** for a day inside a long fasting month,
and the day's own fast marked under it. Recitation is the pole star and the
moon is the same disc the band draws, halo and all.

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
