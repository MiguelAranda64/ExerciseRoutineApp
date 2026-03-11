import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Pressable,
  ImageBackground,
} from "react-native";

import userProfile from "../assets/img/user-profile-default.png";
import * as Progress from "react-native-progress";
import fondoRutina from "../assets/img/space-background.jpg";
import fondo1 from "../assets/img/fondo1.jpg";
import popularHiit from "../assets/img/ejercicios_populares/popular_hiit.png";
import popularYoga from "../assets/img/ejercicios_populares/popular_yoga_relajante.png"

// Importación de categorias
import PechoCat from "./categorias/pechoCat";
import PiernasAbdomenCat from "./categorias/piernasAbdomenCat";
import EspaldaCat from "./categorias/EspaldaCat";
import BrazosCat from "./categorias/BrazosCat";

const Main = () => {
  const [selectedCategory, setSelectedCategory] = useState("Pecho");
  const categories = ["Pecho", "Piernas y abdomen", "Brazos", "Espalda"];
  const categoryComponents = {
    Pecho: <PechoCat />,
    "Piernas y abdomen": <PiernasAbdomenCat />,
    Brazos: <BrazosCat />,
    Espalda: <EspaldaCat />,
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#1E0F3A" }}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola Miguel</Text>
          <Text style={styles.subtitle}>¿Listo para entrenar?</Text>
        </View>
        <Image source={userProfile} style={styles.avatar} />
      </View>

      {/* Racha card */}
      <ScrollView style={styles.container}>
        <ImageBackground source={fondoRutina} style={styles.rachaCard} imageStyle={{borderRadius: 20}}>
          <View style={{ marginRight: 4 }}>
            <Text style={styles.rachaTitle}>🔥</Text>
          </View>

          <View style={{ marginRight: 4 }}>
            <Text style={styles.rachaTitle}>20 Dias en racha</Text>
            <Progress.Bar
              style={styles.rachaProgreso}
              progress={0.3}
              width={272}
              color={"#f7d307"}
            />
          </View>

          <View>
            <Text style={styles.rachaCount}>20/100</Text>
          </View>
        </ImageBackground>

        {/* card principal */}
        <ImageBackground source={fondo1} style={styles.mainCard} imageStyle={{borderRadius: 20}}>
          <Text style={styles.mainTitle}>¿No tienes rutina?</Text>
          <Text style={styles.mainSubtitle}>Personaliza tu rutina</Text>

          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startText}>Empezar</Text>
          </TouchableOpacity>
        </ImageBackground>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.statNumber}>💪 320</Text>
              <Text style={styles.statLabel}>Calorías</Text>
            </View>
            <Text style={styles.statLabel}>Hoy</Text>
          </View>

          <View style={styles.statBox}>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.statNumber}>⏱️ 12</Text>
              <Text style={styles.statLabel}>Minutos</Text>
            </View>
            <Text style={styles.statLabel}>Tiempo activo</Text>
          </View>
        </View>

        {/* Lista de ejercicios */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Centrado en el cuerpo</Text>
          <View style={styles.line}></View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          {categories.map((item) => (
            <Pressable
              key={item}
              onPress={() => setSelectedCategory(item)}
              style={[
                styles.chip,
                selectedCategory === item && styles.chipActive,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedCategory === item && styles.chipTextActive,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Mostrar ejercicios */}
        {categoryComponents[selectedCategory]}

        {/* Ejercicios populares */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Ejercicios Populares</Text>
          <View style={styles.line}></View>
        </View>

        <View style={styles.cardRow}>
          <ImageBackground source={popularHiit} style={styles.exerciseCard} imageStyle={styles.popularExImg}>
            <Text style={styles.exerciseTitle}>Entrenamiento HIIT</Text>
          </ImageBackground>

          <ImageBackground source={popularYoga} style={styles.exerciseCard} imageStyle={styles.popularExImg}>
            <Text style={styles.exerciseTitle}>Yoga relajante</Text>
          </ImageBackground>
        </View>

        {/* Datos de esta semana */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Datos de esta semana</Text>
          <View style={styles.line}></View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
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

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  rachaCard: {
    borderRadius: 20,
    marginTop: 10,
    padding: 20,
    flexDirection: "row",
  },

  rachaTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  rachaProgreso: {
    marginTop: 5,
  },

  rachaCount: {
    color: "white",
  },

  mainCard: {
    padding: 20,
    marginTop: 30,
  },

  mainTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  mainSubtitle: {
    color: "#C5B3FF",
    marginTop: 4,
  },

  startButton: {
    marginTop: 20,
    backgroundColor: "#7B3FE4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: "flex-end",
  },

  startText: {
    color: "white",
    fontWeight: "bold",
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },

  statBox: {
    backgroundColor: "#2C1A4D",
    padding: 20,
    borderRadius: 15,
    width: "48%",
  },

  statNumber: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 6,
  },

  statLabel: {
    color: "#BFA2FF",
    paddingTop: 4,
    textAlign: "center",
  },

  sectionCard: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 15,
  },

  sectionTitle: {
    color: "white",
    fontSize: 18,
    marginRight: 10,
  },

  line: {
    flex: 1,
    height: 0.5,
    backgroundColor: "#422774",
  },

  chipsContainer: {
    flexDirection: "row",
    marginTop: 15,
  },

  chip: {
    backgroundColor: "#5B2E91",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },

  chipActive: {
    backgroundColor: "#A855F7",
  },

  chipText: {
    color: "#D1C4E9",
    fontWeight: "600",
  },

  chipTextActive: {
    color: "white",
  },

  cardRow: {
    flexDirection: "row",
  },

  exerciseCard: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "auto"
  },

  popularExImg: {
    width: "70%",
    height: 120,
  },

  exerciseTitle: {
    color: "white",
    fontWeight: "bold",
    paddingBottom: 0,
  },
});

export default Main;
