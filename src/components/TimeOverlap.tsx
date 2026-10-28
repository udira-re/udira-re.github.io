"use client";

import { useSyncExternalStore } from "react";

// Nepal Standard Time is UTC+5:45 all year (no daylight saving).
const NPT_OFFSET_MIN = 5 * 60 + 45;
// Working day in Kathmandu, and the visitor's assumed working day, in local hours.
const MY_DAY = { start: 10, end: 19 };
const THEIR_DAY = { start: 9, end: 18 };

type Zone = { label: string; offsetMin: number };

// Rome is where most of my clients sit, so it is the default before the visitor's zone is known.
const DEFAULT_ZONE: Zone = { label: "Rome", offsetMin: 60 };

function toUtcRange(day: { start: number; end: number }, offsetMin: number) {
  return [day.start * 60 - offsetMin, day.end * 60 - offsetMin] as const;
}

function overlapMinutes(a: readonly [number, number], b: readonly [number, number]) {
  let best = 0;
  for (const shift of [-1440, 0, 1440]) {
    best = Math.max(best, Math.min(a[1], b[1] + shift) - Math.max(a[0], b[0] + shift));
  }
  return Math.max(0, best);
}

// Converts a UTC minute range into one or two segments on the visitor's 0–24h axis.
function segments(range: readonly [number, number], offsetMin: number) {
  const start = (((range[0] + offsetMin) % 1440) + 1440) % 1440;
  const end = start + (range[1] - range[0]);
  return end <= 1440 ? [[start, end]] : [[start, 1440], [0, end - 1440]];
}

function formatDuration(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function cityFromZone(tz: string) {
  const city = tz.split("/").pop() ?? tz;
  return city.replace(/_/g, " ");
}

let clientZone: Zone | null = null;
function getClientZone(): Zone {
  if (!clientZone) {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const offsetMin = -new Date().getTimezoneOffset();
    // Visitors in Nepal (zone may be spelled "Katmandu") see the Rome comparison instead of themselves.
    clientZone = offsetMin === NPT_OFFSET_MIN ? DEFAULT_ZONE : { label: cityFromZone(tz), offsetMin };
  }
  return clientZone;
}

const clockFormat = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kathmandu", hour: "2-digit", minute: "2-digit" });
function subscribeClock(onChange: () => void) {
  const id = setInterval(onChange, 30_000);
  return () => clearInterval(id);
}
const noSubscribe = () => () => {};

export function TimeOverlap() {
  // Server render uses Rome and a blank clock; the browser swaps in the visitor's zone and live time.
  const zone = useSyncExternalStore(noSubscribe, getClientZone, () => DEFAULT_ZONE);
  const now = useSyncExternalStore(subscribeClock, () => clockFormat.format(new Date()), () => null);

  const mine = toUtcRange(MY_DAY, NPT_OFFSET_MIN);
  const theirs = toUtcRange(THEIR_DAY, zone.offsetMin);
  const overlap = overlapMinutes(mine, theirs);

  const pct = (m: number) => `${(m / 1440) * 100}%`;
  const bar = (range: readonly [number, number], cls: string) =>
    segments(range, zone.offsetMin).map(([s, e], i) => (
      <span key={i} className={cls} style={{ left: pct(s), width: pct(e - s) }} />
    ));

  return (
    <aside className="tz" aria-label="Working hours overlap">
      <div className="tz__head">
        <span className="tz__label">Kathmandu · UTC+5:45</span>
        <span className="tz__clock">{now ?? "--:--"}</span>
      </div>

      <div className="tz__rows">
        <div className="tz__row">
          <span className="tz__who">Me</span>
          <div className="tz__track">{bar(mine, "tz__seg tz__seg--me")}</div>
        </div>
        <div className="tz__row">
          <span className="tz__who">{zone.label}</span>
          <div className="tz__track">{bar(theirs, "tz__seg tz__seg--you")}</div>
        </div>
        <div className="tz__axis" aria-hidden="true">
          <span>00</span>
          <span>06</span>
          <span>12</span>
          <span>18</span>
          <span>24</span>
        </div>
      </div>

      <p className="tz__result">
        {overlap > 0 ? (
          <>
            <strong>{formatDuration(overlap)}</strong> of shared working hours with {zone.label}.
          </>
        ) : (
          <>No shared hours with {zone.label} in a standard 9-to-6 day.</>
        )}
      </p>
      <p className="tz__note">Axis shows {zone.label} local time. Working day assumed 09:00–18:00.</p>
    </aside>
  );
}
