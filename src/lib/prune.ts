import { TimeFrame } from "./data_fetch";
import { DateTime, Duration } from "luxon";

/*
    THIS FEATURE IS NOT IN USE
*/

export function pruneData(significantRecords, timeFrame: TimeFrame) {
  const now = DateTime.now();
  let idealLabels: Array<string> = [];

  console.log("Pruning...");

  let resolutionTimeout = setTimeout(() => {
    throw "pruneData did not resolve in a reasonable amount of time";
  }, 3000);

  if (timeFrame == TimeFrame.LAST_3MONTH) {
    /* If we are looking at a 3 month interval, show the first significant value of each week ~12 values */
    let then = now.minus({ weeks: 12 });
    /* Minus 12 weeks plus 1 * 12 week should be today right?*/
    while (!now.equals(then)) {
      then = then.plus({ week: 1 });
      idealLabels.push(then.toFormat("LLL dd"));
    }
  } else if (timeFrame == TimeFrame.LAST_MONTH) {
    let then = now.minus({ weeks: 4 });
    while (!now.equals(then)) {
      then = then.plus({ days: 4 });
      idealLabels.push(then.toFormat("LLL dd"));
    }
  } else if (timeFrame == TimeFrame.LAST_WEEK) {
    let then = now.minus({ week: 1 });
    while (!now.equals(then)) {
      then = then.plus({ days: 1 });
      idealLabels.push(then.toFormat("LLL dd"));
    }
  }

  console.log("Pruning successful");
  clearTimeout(resolutionTimeout);

  return idealLabels;
}
