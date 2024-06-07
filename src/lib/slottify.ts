import { DateTime, DurationLike } from "luxon";

export function generateLabels(delta: DurationLike) {
  const now = DateTime.now();
  const then = now.minus(delta);
  // console.log(then, now)

  const timeLabels = ["M", "A", "E", "N"];

  let compare = then;
  let daysBetween: Array<DateTime> = [];
  let labels: Array<string> = [];

  let i = 0;

  while (!now.equals(compare)) {
    i++;
    if (i > 300)
      throw "generateLabels did not resolve in reasonable amount of time";
    compare = compare.plus({ days: 1 });
    // console.log(compare.toSQLDate(), now.toSQLDate())
    // if (compare.toSQLDate() === now.toSQLDate()) {
    // console.log(now, then)
    // }
    daysBetween.push(compare);
  }

  for (const day of daysBetween) {
    for (const time of timeLabels) {
      labels.push(`${day.toFormat("LLL dd")} ${time}`);
    }
  }

  return labels;
}
