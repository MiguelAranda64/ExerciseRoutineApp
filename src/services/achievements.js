import { supabase } from "../db_connection/supabase";
export const achievementsWithStatus = async (userId) => {
  try {
    const { data: achData, error } = await supabase.from("achievements").select("*");
    if (!userId) return achData;

    const { data: unlocked } = await supabase
      .from("user_achievements")
      .select("achievement_id, completed_at")
      .eq("user_id", userId);

    const result = achData.map((a) => {
      const userAchievement = unlocked?.find((u) => u.achievement_id === a.id);
      return {
        ...a,
        unlocked: !!userAchievement, // If userAchievement exists, then it's unlocked
        completed_at: userAchievement?.completed_at ?? null, // Add completed_at to the achievement object if it's unlocked, otherwise set it to null
      };
    });
    return result;
  } catch (error){
    console.error(error);
  }
};
