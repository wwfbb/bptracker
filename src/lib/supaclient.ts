import { writable } from "svelte/store";
import { createClient, type User } from '@supabase/supabase-js'
import { Database } from './database.types';
import { switchToUser } from "./access";

const supabaseUrl = 'https://qipnvyttafkjlwfkolsq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcG52eXR0YWZramx3ZmtvbHNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIwNTc5NzksImV4cCI6MjAyNzYzMzk3OX0.8D2UoQHC89N9KQDej-5v1N13n6mCSjP0WiO_xs2Vh34'
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export let signInUser: User;
export let loggedIn = false;

export let currentUserUUID = writable<string>();
export let currentUserEmail = writable<string>();

export async function checkAuthStatus() {
    let { data, error } = await supabase.auth.getUser();

    if (error) {
        console.log("Not logged in!");
        return false;
    }
    if (!data.user) return
    if (!data.user.email) return

    console.log(data)

    loggedIn = true

    signInUser = data.user;
    currentUserUUID.set(data.user.id);
    currentUserEmail.set(data.user.email);

    const prevSessionUUID = localStorage.getItem("uuid");
    const prevSessionEmail = localStorage.getItem("email");

    if (prevSessionUUID && prevSessionEmail) {
        currentUserUUID.set(prevSessionUUID)
        switchToUser(prevSessionEmail, prevSessionUUID)
    }

    return true
}

export async function loginDone(event) {
    signInUser = event.detail;
    loggedIn = true;
}
