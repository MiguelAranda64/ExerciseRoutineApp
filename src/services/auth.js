import { supabase } from "../db_connection/supabase";
export const getUser = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error(error);
  }
};

export const getSession = async () => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error("Supabase session error: ", error);
  }
};

export const getProfile = async (userId) => {
  try {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", userId)
      .single();
      return profile;
  } catch (error) {
    console.error(error);
  }
};
