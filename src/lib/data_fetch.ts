import { supabase } from "./supaclient";
import { DateTime, Duration } from "luxon";
import { currentUserUUID } from "./supaclient";
import { get } from "svelte/store";
import { generateLabels } from "../lib/slottify";

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

type TimedList = {
  morning: Array<number>
  afternoon: Array<number>
  night: Array<number>
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
  let hrValues: TimedList = {morning: [], afternoon: [], night: []};
  let sysValues: TimedList = {morning: [], afternoon: [], night: []};
  let diaValues: TimedList = {morning: [], afternoon: [], night: []};

  let { error, data } = await supabase
    .from("record")
    .select("*")
    .filter("user_uid", "eq", get(currentUserUUID))
    .filter("date", "gt", filterDate.toSQLDate())
    .order("date", { ascending: true });
  if (error) throw error;
  if (!data) throw error;

  data.map((record) => {
    labels.push(`${DateTime.fromSQL(record.date).toFormat("LLL dd")}`);

    if (Number(record.time) == Time.MORNING) {
      hrValues.morning.push(record.heart_rate);
      sysValues.morning.push(record.value_sys);
      diaValues.morning.push(record.value_dia);
    } else if (Number(record.time) == Time.AFTERNOON) {
      hrValues.afternoon.push(record.heart_rate);
      sysValues.afternoon.push(record.value_sys);
      diaValues.afternoon.push(record.value_dia);
    } if (Number(record.time) == Time.NIGHT) {
      hrValues.night.push(record.heart_rate);
      sysValues.night.push(record.value_sys);
      diaValues.night.push(record.value_dia);
    }
  });

  const labels_deduped = [...new Set(labels)];

  return {  labels: labels_deduped, hrValues, sysValues, diaValues, chart_labels };
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
