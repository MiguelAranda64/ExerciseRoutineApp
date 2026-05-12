import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import { supabase } from "../db_connection/supabase";

import * as Progress from "react-native-progress";
import fondoRutina from "../assets/img/space-background.jpg";

const Logros = () => {
  const [user, setUser] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const unlockedCount = achievements.filter((a) => a.unlocked).length; // Count how many achievements are unlocked
  const totalAchievements = achievements.length; // Total number of achievements

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    setLoading(true);
    setError(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      const { data: achievementsData, error } = await supabase
        .from("achievements")
        .select("*");

      if (!user) {
        setAchievements(achievementsData);
        return;
      }

      /* Get user_achievements in case they are unlocked by the user */
      const { data: unlocked } = await supabase
        .from("user_achievements")
        .select("achievement_id, completed_at")
        .eq("user_id", user.id);

      /* If achievements are unlocked then compare user.achievement_id and achievement.id */
      const achievementsWithStatus = achievementsData.map((a) => {
        const userAchievement = unlocked?.find(
          (u) => u.achievement_id === a.id,
        );
        return {
          ...a,
          unlocked: !!userAchievement, // If userAchievement exists, then it's unlocked
          completed_at: userAchievement?.completed_at ?? null, // Add completed_at to the achievement object if it's unlocked, otherwise set it to null
        };
      });

      setAchievements(achievementsWithStatus);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#1E0F3A" }}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Logros</Text>
          <Text style={styles.subtitle}>Desbloquéalos todos</Text>
        </View>
      </View>

      <ScrollView style={styles.container}>
        <ImageBackground
          source={fondoRutina}
          style={styles.DoneAchievements}
          imageStyle={{ borderRadius: 20 }}
        >
          <View style={{ marginRight: 4 }}>
            <Text style={styles.DoneAchievementsTitle}>🏆</Text>
          </View>

          <View style={{ marginRight: 4 }}>
            <Text style={styles.DoneAchievementsTitle}>
              {unlockedCount} / {totalAchievements} logros desbloqueados
            </Text>
            <Progress.Bar
              style={styles.AchievementProgress}
              progress={unlockedCount / totalAchievements || 0}
              width={272}
              color={"#f7d307"}
            />
          </View>

          <View style={{ marginLeft: "auto" }}>
            <Text style={{ color: "white" }}>
              {Math.round((unlockedCount / totalAchievements) * 100) || 0}%
            </Text>
          </View>
        </ImageBackground>

        <View style={{ marginTop: 20 }}>
          <View>
            {/* show if user has not logged in */}
            {!user && (
              <Text style={{ color: "white", marginBottom: 3 }}>
                Inicia sesión para desbloquear logros
              </Text>
            )}

            {loading ? (
              <Text style={{ color: "white" }}>Loading data ...</Text>
            ) : (
              achievements.map((a) => (
                <View
                  key={a.id}
                  style={[
                    styles.AchievementCard,
                    !a.unlocked && { opacity: 0.3 },
                  ]}
                >
                  <Text style={{ color: "white" }}>{a.title}</Text>
                  <Text style={{ color: "white" }}>{a.description}</Text>
                  {/* If user has unlocked this achievement, it shows the points of completition */}
                  {a.unlocked ? (
                    <View>
                      {/* <Text style={{ color: "white" }}>{a.points} pts</Text> */}
                      <Text style={{ color: "#BFA2FF", fontSize: 12 }}> Desbloqueado el {""}
                        {a.completed_at
                          ? new Date(a.completed_at).toLocaleDateString(
                              "es-MX",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )
                          : ""}
                      </Text>
                    </View>
                  ) : (
                    <Text style={{ color: "#BFA2FF", fontSize: 12 }}>
                      Logro bloqueado
                    </Text>
                  )}
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    backgroundColor: "#1E0F3A",
    padding: 20,
  },

  container: {
    backgroundColor: "#1E0F3A",
    paddingHorizontal: 20,
  },

  greeting: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#BFA2FF",
    marginTop: 4,
  },

  line: {
    flex: 1,
    height: 0.5,
    backgroundColor: "#422774",
  },

  DoneAchievements: {
    borderRadius: 20,
    marginTop: 10,
    padding: 20,
    flexDirection: "row",
  },

  DoneAchievementsTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  AchievementProgress: {
    marginTop: 5,
  },

  AchievementCard: {
    marginTop: 6,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#2C1A4D",
  },
});

export default Logros;