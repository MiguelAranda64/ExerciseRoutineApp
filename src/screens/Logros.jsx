import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground
} from "react-native";

import * as Progress from "react-native-progress";
import fondoRutina from "../assets/img/space-background.jpg";

const Logros = () => {
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
            <Text style={styles.DoneAchievementsTitle}>48 / 100 logros desbloqueados</Text>
            <Progress.Bar
              style={styles.AchievementProgress}
              progress={0.3}
              width={272}
              color={"#f7d307"}
            />
          </View>

          <View>
            <Text style={styles.AchievementCount}>20/100</Text>
          </View>
        </ImageBackground>
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
    flex: 1,
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
    fontWeight: "bold"
  },

  AchievementProgress: {
    marginTop: 5
  },

  AchievementCount: {
    color: "white"
  }
});

export default Logros;
