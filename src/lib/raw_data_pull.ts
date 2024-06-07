import { get } from "svelte/store";
import { supabase, currentUserUUID } from "./supaclient";

export const PAGE_SIZE = 20;

export async function getPage(page: number) {
  const { data, error } = await supabase
    .from("record")
    .select()
    .eq("user_uid", get(currentUserUUID))
    .order("date", { ascending: false })
    .order("time", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (error) throw error;
  console.log(`Fetched page ${page}`, data);

  return data;
}

export async function deleteRecordServer(id: number) {
  const { data, error } = await supabase.from("record").delete().eq("id", id);

  console.log("Deleting", id, data);

  if (error) throw error;
}
