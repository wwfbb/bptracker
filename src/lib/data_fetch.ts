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
  morning: Array<number|null>;
  afternoon: Array<number|null>;
  night: Array<number|null>;
};

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
  let hrValues: TimedList = { morning: [], afternoon: [], night: [] };
  let sysValues: TimedList = { morning: [], afternoon: [], night: [] };
  let diaValues: TimedList = { morning: [], afternoon: [], night: [] };

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

    // if (Number(record.time) == Time.MORNING) {
    //   hrValues.morning.push(record.heart_rate);
    //   sysValues.morning.push(record.value_sys);
    //   diaValues.morning.push(record.value_dia);
    // } else if (Number(record.time) == Time.AFTERNOON) {
    //   hrValues.afternoon.push(record.heart_rate);
    //   sysValues.afternoon.push(record.value_sys);
    //   diaValues.afternoon.push(record.value_dia);
    // } if (Number(record.time) == Time.NIGHT) {
    //   hrValues.night.push(record.heart_rate);
    //   sysValues.night.push(record.value_sys);
    //   diaValues.night.push(record.value_dia);
    // }
  });

  const labels_deduped = [...new Set(labels)];

  for (const day of labels_deduped) {
    const day_records = data.filter((record) => {
      return DateTime.fromSQL(record.date).toFormat("LLL dd") == day;
    });

    const morning_record = day_records.filter((record) => {
      return Number(record.time) == Time.MORNING;
    })[0];

    if (morning_record) {
      hrValues.morning.push(morning_record.heart_rate);
      sysValues.morning.push(morning_record.value_sys);
      diaValues.morning.push(morning_record.value_dia);
    } else {
      hrValues.morning.push(null);
      sysValues.morning.push(null);
      diaValues.morning.push(null);
    }

    const afternoon_record = day_records.filter((record) => {
      return Number(record.time) == Time.AFTERNOON;
    })[0];

    if (afternoon_record) {
      hrValues.afternoon.push(afternoon_record.heart_rate);
      sysValues.afternoon.push(afternoon_record.value_sys);
      diaValues.afternoon.push(afternoon_record.value_dia);
    } else {
      hrValues.afternoon.push(null);
      sysValues.afternoon.push(null);
      diaValues.afternoon.push(null);
    }

    const night_record = day_records.filter((record) => {
      return Number(record.time) == Time.NIGHT;
    })[0];

    if (night_record) {
      hrValues.night.push(night_record.heart_rate);
      sysValues.night.push(night_record.value_sys);
      diaValues.night.push(night_record.value_dia);
    } else {
      hrValues.night.push(null);
      sysValues.night.push(null);
      diaValues.night.push(null);
    }

    console.log(day, day_records);
  }

  return {
    labels: labels_deduped,
    hrValues,
    sysValues,
    diaValues,
    chart_labels,
  };
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
