import { supabase, signInUser } from "./supaclient";
import { currentUserEmail, currentUserUUID } from "./supaclient";


export async function grantAccessTo(email: string) {
    const { data, error } = await supabase.from("access").insert({
        on: signInUser.id,
        on_email: signInUser.email,
        to: email
    })

    if (error) throw error

    return data
}

export async function revokeAccess(email: string) {
    const { data, error } = await supabase.from("access").delete().eq("on", signInUser.id).eq("to", email)
    if (error) throw error;
}

export async function getAccessGrantees() {
    const { data, error } = await supabase.from("access").select().filter("on_email", "eq", signInUser.email);
    if (error) throw error
    return data
}

export async function isGranteeOf() {
    const { data, error } = await supabase.from("access").select("*").filter("to", "eq", signInUser.email);
    if (error) throw error;
    return data
}

export function switchToUser(userEmail, userUUID) {
    console.log(userEmail, userUUID)
    currentUserEmail.set(userEmail);
    currentUserUUID.set(userUUID);
}