import { supabase } from "./supaclient"
import { DateTime, Duration } from "luxon";
import { currentUserUUID } from "./supaclient";
import { get } from "svelte/store";

export enum TimeFrame {
    LAST_WEEK,
    LAST_MONTH,
    LAST_3MONTH
}

export enum Time {
    MORNING = 0,
    AFTERNOON = 1,
    EVENING = 2,
    NIGHT = 3
}

export async function fetchData(timeFrame: TimeFrame) {
    let labels: Array<string> = []
    let hrValues: Array<number> = []
    let sysValues: Array<number> = []
    let diaValues: Array<number> = []
    let filterDate;

    if (timeFrame == TimeFrame.LAST_WEEK) {
        filterDate = DateTime.now().minus(Duration.fromObject({ days: 7 }))
    } else if (timeFrame == TimeFrame.LAST_MONTH) {
        filterDate = DateTime.now().minus(Duration.fromObject({ months: 1 }))
    } else if (timeFrame == TimeFrame.LAST_3MONTH) {
        filterDate = DateTime.now().minus(Duration.fromObject({ months: 3 }))
    }

    let { error, data } = await supabase.from("record").select("*").filter("user_uid", "eq", get(currentUserUUID)).filter("date", "gt", filterDate.toSQLDate());
    if (error) throw error
    if (!data) throw error

    data.map(record => {
        labels.push(record.date);
        hrValues.push(record.heart_rate);
        sysValues.push(record.value_sys);
        diaValues.push(record.value_dia);
    })

    return { labels, hrValues, sysValues, diaValues }


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

