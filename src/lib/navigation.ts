import { writable } from "svelte/store";

export enum Screen {
    HOME_SCREEN,
    ADD_RECORD,
    SYNC_DETAILS,
    RAW_DATA,
    EDIT_RECORD
}

export const recordToEdit = writable();
export const currentPageId = writable(Screen.HOME_SCREEN);
export const hideNavBar = writable(false);