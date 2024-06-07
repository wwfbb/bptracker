import { supabase } from "./supaclient";

export async function submitData(form: FormData) {
  let recordobj = {};
  for (let [key, value] of form) {
    if (key != "comment" && !value) {
      alert(`Field ${key} is not filled in`);
      return false;
    }
    recordobj[key] = value;
  }

  const {
    value_sys,
    value_dia,
    heart_rate,
    comment,
    time,
    date,
    user_uid,
  }: any = Object.fromEntries(form.entries());
  console.log({
    value_sys,
    value_dia,
    heart_rate,
    comment,
    time,
    date,
    user_uid,
  });
  const { error, data } = await supabase
    .from("record")
    .insert([
      { value_sys, value_dia, heart_rate, comment, time, date, user_uid },
    ])
    .select();

  if (error) throw error;
  return true;
}

export async function submitEdit(form: FormData) {
  let recordobj = {};
  for (let [key, value] of form) {
    if (key != "comment" && !value) {
      alert(`Field ${key} is not filled in`);
      return false;
    }
    recordobj[key] = value;
  }

  const {
    id,
    value_sys,
    value_dia,
    heart_rate,
    comment,
    time,
    date,
    user_uid,
  }: any = Object.fromEntries(form.entries());
  console.log({
    value_sys,
    value_dia,
    heart_rate,
    comment,
    time,
    date,
    user_uid,
  });

  const { data, error } = await supabase
    .from("record")
    .update({ value_sys, value_dia, heart_rate, comment, time, date, user_uid })
    .eq("id", id)
    .select();

  if (error) throw error;

  return true;
}
