import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@color_interfaz";

const PALETAS = [
  {
    id: "morado",
    nombre: "Morado Cósmico",
    descripcion: "El tema por defecto",
    primary: "#A47BFF",
    secondary: "#7B3FE4",
    bg: "#1E0F3A",
    card: "#2A1660",
  },
  {
    id: "azul",
    nombre: "Azul Océano",
    descripcion: "Fresco y concentrado",
    primary: "#60A5FA",
    secondary: "#2563EB",
    bg: "#0A1628",
    card: "#112240",
  },
  {
    id: "verde",
    nombre: "Verde Bosque",
    descripcion: "Natural y energizante",
    primary: "#4ADE80",
    secondary: "#16A34A",
    bg: "#0A1F0F",
    card: "#112318",
  },
  {
    id: "rojo",
    nombre: "Rojo Fuego",
    descripcion: "Intenso y motivador",
    primary: "#F87171",
    secondary: "#DC2626",
    bg: "#1F0A0A",
    card: "#2D1010",
  },
  {
    id: "naranja",
    nombre: "Naranja Energía",
    descripcion: "Cálido y activo",
    primary: "#FB923C",
    secondary: "#EA580C",
    bg: "#1F0F05",
    card: "#2D1A08",
  },
  {
    id: "rosa",
    nombre: "Rosa Neón",
    descripcion: "Vibrante y moderno",
    primary: "#F472B6",
    secondary: "#DB2777",
    bg: "#1F0A16",
    card: "#2D0F20",
  },
];

const ColorInterfaz = ({ navigation }) => {
  const [selected, setSelected] = useState("morado");

  async function handleSelect(id) {
    setSelected(id);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, id);
    } catch {}
    // Aquí conectarías con tu contexto/theme provider global
  }

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color="#A47BFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Color e Interfaz</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          Elige el tema visual de MiEntrenador. El cambio se aplica en toda la app.
        </Text>

        <Text style={styles.sectionTitle}>Temas disponibles</Text>

        <View style={styles.grid}>
          {PALETAS.map((paleta) => {
            const isSelected = selected === paleta.id;
            return (
              <TouchableOpacity
                key={paleta.id}
                style={[styles.paletaCard, isSelected && styles.paletaCardSelected]}
                onPress={() => handleSelect(paleta.id)}
                activeOpacity={0.8}
              >
                {/* Preview de colores */}
                <View style={[styles.preview, { backgroundColor: paleta.bg }]}>
                  <View style={[styles.previewBar, { backgroundColor: paleta.card }]}>
                    <View style={[styles.previewDot, { backgroundColor: paleta.primary }]} />
                    <View style={[styles.previewLine, { backgroundColor: paleta.primary + "66" }]} />
                  </View>
                  <View style={styles.previewBody}>
                    <View style={[styles.previewBlock, { backgroundColor: paleta.card }]}>
                      <View style={[styles.previewAccent, { backgroundColor: paleta.primary }]} />
                      <View style={[styles.previewTextLine, { backgroundColor: paleta.secondary + "55" }]} />
                    </View>
                    <View style={[styles.previewBlock, { backgroundColor: paleta.card }]}>
                      <View style={[styles.previewAccent, { backgroundColor: paleta.secondary }]} />
                      <View style={[styles.previewTextLine, { backgroundColor: paleta.primary + "55" }]} />
                    </View>
                  </View>
                </View>

                {/* Info */}
                <View style={styles.paletaInfo}>
                  <View style={styles.paletaTextGroup}>
                    <Text style={styles.paletaNombre}>{paleta.nombre}</Text>
                    <Text style={styles.paletaDesc}>{paleta.descripcion}</Text>
                  </View>
                  {isSelected && (
                    <View style={styles.checkCircle}>
                      <Ionicons name="checkmark" size={13} color="#1E0F3A" />
                    </View>
                  )}
                </View>

                {/* Chips de color */}
                <View style={styles.chips}>
                  {[paleta.primary, paleta.secondary, paleta.bg, paleta.card].map((c, i) => (
                    <View key={i} style={[styles.chip, { backgroundColor: c }]} />
                  ))}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.noteBox}>
          <Ionicons name="color-palette-outline" size={15} color="#7B5DB5" />
          <Text style={styles.noteText}>
            El tema seleccionado se guardará y se aplicará cada vez que abras la app.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#1E0F3A" },
  header: {
    flexDirection: "row", alignItems: "center",
    marginTop: 40, paddingHorizontal: 20, paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#3D2070", gap: 12,
  },
  backBtn: { padding: 4 },
  headerTitle: { color: "#FFFFFF", fontSize: 26, fontWeight: "700", letterSpacing: 0.4 },
  scroll: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 48 },
  subtitle: { color: "#7B5DB5", fontSize: 14, lineHeight: 20, marginBottom: 28, paddingLeft: 4 },
  sectionTitle: {
    color: "#A47BFF", fontSize: 12, fontWeight: "700",
    letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 14, paddingLeft: 4,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 14, marginBottom: 24 },
  paletaCard: {
    width: "47%", backgroundColor: "#2A1660", borderRadius: 14,
    overflow: "hidden", borderWidth: 2, borderColor: "transparent",
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  paletaCardSelected: { borderColor: "#A47BFF" },
  preview: { height: 90, padding: 8, justifyContent: "space-between" },
  previewBar: {
    flexDirection: "row", alignItems: "center",
    borderRadius: 4, padding: 4, gap: 6,
  },
  previewDot: { width: 6, height: 6, borderRadius: 3 },
  previewLine: { flex: 1, height: 3, borderRadius: 2 },
  previewBody: { flexDirection: "row", gap: 6 },
  previewBlock: { flex: 1, borderRadius: 6, padding: 6, gap: 4 },
  previewAccent: { height: 5, borderRadius: 2, width: "60%" },
  previewTextLine: { height: 3, borderRadius: 2, width: "80%" },
  paletaInfo: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 10, paddingTop: 10, paddingBottom: 6,
  },
  paletaTextGroup: { flex: 1 },
  paletaNombre: { color: "#E0D0FF", fontSize: 13, fontWeight: "700" },
  paletaDesc: { color: "#7B5DB5", fontSize: 11, marginTop: 1 },
  checkCircle: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: "#A47BFF", alignItems: "center", justifyContent: "center",
  },
  chips: { flexDirection: "row", gap: 5, paddingHorizontal: 10, paddingBottom: 10 },
  chip: { width: 14, height: 14, borderRadius: 7 },
  noteBox: { flexDirection: "row", alignItems: "flex-start", gap: 8, paddingHorizontal: 4 },
  noteText: { flex: 1, color: "#6B4FAA", fontSize: 12, lineHeight: 18 },
});

export default ColorInterfaz;