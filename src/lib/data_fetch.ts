import { supabase } from "./supaclient";
import { DateTime, Duration } from "luxon";
import { currentUserUUID } from "./supaclient";
import { get } from "svelte/store";
import { generateLabels } from "../lib/slottify";
import { Exception } from "sass";

export enum TimeFrame {
  LAST_WEEK,
  LAST_MONTH,
  LAST_3MONTH,
}

export enum Time {
  MORNING = 0,
  AFTERNOON = 1,
  EVENING = 2,
  NIGHT = 3,
}

function getShortCode(time) {
  switch (time) {
    case Time.MORNING:
      return "M";
    case Time.AFTERNOON:
      return "A";
    case Time.EVENING:
      return "E";
    case Time.NIGHT:
      return "N";
  }
}

export async function fetchData(timeFrame: TimeFrame) {
  let duration;

  if (timeFrame == TimeFrame.LAST_WEEK) {
    duration = Duration.fromObject({ days: 7 });
  } else if (timeFrame == TimeFrame.LAST_MONTH) {
    duration = Duration.fromObject({ months: 1 });
  } else if (timeFrame == TimeFrame.LAST_3MONTH) {
    duration = Duration.fromObject({ months: 3 });
  } else {
    throw "Invalid TimeFrame";
  }

  const filterDate = DateTime.now().minus(duration);

  let chart_labels: Array<string> = generateLabels(duration);
  let labels: Array<string> = [];
  let hrValues: Array<number> = [];
  let sysValues: Array<number> = [];
  let diaValues: Array<number> = [];

  let { error, data } = await supabase
    .from("record")
    .select("*")
    .filter("user_uid", "eq", get(currentUserUUID))
    .filter("date", "gt", filterDate.toSQLDate())
    .order("date", { ascending: true });
  if (error) throw error;
  if (!data) throw error;

  data.map((record) => {
    labels.push(`${record.date} ${record.time}`);
    hrValues.push(record.heart_rate);
    sysValues.push(record.value_sys);
    diaValues.push(record.value_dia);
  });

  return { labels, hrValues, sysValues, diaValues, chart_labels };
}

export function getLabels(fetchedData) {
  return fetchedData.labels;
}

export function getSysValues(fetchedData) {
  return fetchedData.sysValues;
}

export function getDiaValues(fetchedData) {
  return fetchedData.diaValues;
}

export function getHrValues(fetchedData) {
  return fetchedData.hrValues;
}
