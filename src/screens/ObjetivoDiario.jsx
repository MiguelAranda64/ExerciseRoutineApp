import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, TextInput, Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@objetivo_diario";

const OBJETIVOS = [
  {
    key: "calorias",
    icon: "flame-outline",
    label: "Calorías",
    unidad: "kcal",
    color: "#FB923C",
    bgColor: "#2D1A08",
    placeholder: "2000",
    min: 800, max: 6000,
  },
  {
    key: "proteina",
    icon: "barbell-outline",
    label: "Proteína",
    unidad: "g",
    color: "#A47BFF",
    bgColor: "#2A1660",
    placeholder: "150",
    min: 20, max: 400,
  },
  {
    key: "carbohidratos",
    icon: "nutrition-outline",
    label: "Carbohidratos",
    unidad: "g",
    color: "#60A5FA",
    bgColor: "#0F1E35",
    placeholder: "250",
    min: 20, max: 700,
  },
  {
    key: "grasas",
    icon: "water-outline",
    label: "Grasas",
    unidad: "g",
    color: "#F472B6",
    bgColor: "#2A0F1E",
    placeholder: "65",
    min: 10, max: 300,
  },
  {
    key: "agua",
    icon: "rainy-outline",
    label: "Agua",
    unidad: "ml",
    color: "#34D399",
    bgColor: "#0A1F15",
    placeholder: "2500",
    min: 500, max: 6000,
  },
  {
    key: "pasos",
    icon: "footsteps-outline",
    label: "Pasos diarios",
    unidad: "pasos",
    color: "#FBBF24",
    bgColor: "#1F1805",
    placeholder: "8000",
    min: 1000, max: 30000,
  },
];

const ObjetivoDiario = ({ navigation }) => {
  const [valores, setValores] = useState({
    calorias: "2000",
    proteina: "150",
    carbohidratos: "250",
    grasas: "65",
    agua: "2500",
    pasos: "8000",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setValores(JSON.parse(raw));
      } catch {}
    })();
  }, []);

  function handleChange(key, text) {
    const clean = text.replace(/[^0-9]/g, "");
    setValores((prev) => ({ ...prev, [key]: clean }));
    setSaved(false);
  }

  async function handleSave() {
    // Validar rangos
    for (const obj of OBJETIVOS) {
      const val = parseInt(valores[obj.key], 10);
      if (isNaN(val) || val < obj.min || val > obj.max) {
        Alert.alert(
          "Valor fuera de rango",
          `${obj.label} debe estar entre ${obj.min} y ${obj.max} ${obj.unidad}.`
        );
        return;
      }
    }
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(valores));
      setSaved(true);
    } catch {
      Alert.alert("Error", "No se pudo guardar. Intenta de nuevo.");
    }
  }

  // Calcula % de macros para mostrar barra visual
  const totalMacros =
    (parseInt(valores.proteina) || 0) * 4 +
    (parseInt(valores.carbohidratos) || 0) * 4 +
    (parseInt(valores.grasas) || 0) * 9;

  const protPct = totalMacros ? (((parseInt(valores.proteina) || 0) * 4) / totalMacros) * 100 : 33;
  const carbPct = totalMacros ? (((parseInt(valores.carbohidratos) || 0) * 4) / totalMacros) * 100 : 34;
  const grasPct = totalMacros ? (((parseInt(valores.grasas) || 0) * 9) / totalMacros) * 100 : 33;

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color="#A47BFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Objetivo Diario</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Resumen de macros visual */}
        <View style={styles.macroCard}>
          <Text style={styles.macroCardTitle}>Distribución de macros</Text>
          <View style={styles.macroBar}>
            <View style={[styles.macroBarSegment, { flex: protPct, backgroundColor: "#A47BFF" }]} />
            <View style={[styles.macroBarSegment, { flex: carbPct, backgroundColor: "#60A5FA" }]} />
            <View style={[styles.macroBarSegment, { flex: grasPct, backgroundColor: "#F472B6" }]} />
          </View>
          <View style={styles.macroLegend}>
            {[
              { color: "#A47BFF", label: "Proteína", pct: protPct },
              { color: "#60A5FA", label: "Carbos", pct: carbPct },
              { color: "#F472B6", label: "Grasas", pct: grasPct },
            ].map((m) => (
              <View key={m.label} style={styles.macroLegendItem}>
                <View style={[styles.macroLegendDot, { backgroundColor: m.color }]} />
                <Text style={styles.macroLegendText}>
                  {m.label} {Math.round(m.pct)}%
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Inputs de objetivos */}
        <Text style={styles.sectionTitle}>Metas diarias</Text>
        <View style={styles.card}>
          {OBJETIVOS.map((obj, index) => (
            <React.Fragment key={obj.key}>
              <View style={styles.inputRow}>
                <View style={[styles.iconWrapper, { backgroundColor: obj.bgColor }]}>
                  <Ionicons name={obj.icon} size={20} color={obj.color} />
                </View>
                <View style={styles.inputTextGroup}>
                  <Text style={styles.inputLabel}>{obj.label}</Text>
                  <Text style={styles.inputUnidad}>{obj.unidad}</Text>
                </View>
                <TextInput
                  style={styles.input}
                  value={valores[obj.key]}
                  onChangeText={(t) => handleChange(obj.key, t)}
                  keyboardType="numeric"
                  maxLength={6}
                  placeholder={obj.placeholder}
                  placeholderTextColor="#4A3070"
                  selectionColor={obj.color}
                />
              </View>
              {index < OBJETIVOS.length - 1 && (
                <View style={styles.separator} />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* Botón guardar */}
        <TouchableOpacity
          style={[styles.saveBtn, saved && styles.saveBtnDone]}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Ionicons
            name={saved ? "checkmark-circle" : "save-outline"}
            size={20}
            color={saved ? "#1E0F3A" : "#fff"}
          />
          <Text style={[styles.saveBtnText, saved && styles.saveBtnTextDone]}>
            {saved ? "¡Guardado!" : "Guardar objetivos"}
          </Text>
        </TouchableOpacity>

        <View style={styles.noteBox}>
          <Ionicons name="information-circle-outline" size={15} color="#7B5DB5" />
          <Text style={styles.noteText}>
            Estos valores son una guía personal. Consulta a un profesional de salud para metas específicas.
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

  // Macro card
  macroCard: {
    backgroundColor: "#2A1660", borderRadius: 14, padding: 18, marginBottom: 28,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  macroCardTitle: { color: "#A47BFF", fontSize: 12, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 },
  macroBar: { flexDirection: "row", height: 10, borderRadius: 5, overflow: "hidden", gap: 2, marginBottom: 12 },
  macroBarSegment: { borderRadius: 5 },
  macroLegend: { flexDirection: "row", justifyContent: "space-around" },
  macroLegendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  macroLegendDot: { width: 8, height: 8, borderRadius: 4 },
  macroLegendText: { color: "#C4ADFF", fontSize: 12 },

  sectionTitle: {
    color: "#A47BFF", fontSize: 12, fontWeight: "700",
    letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10, paddingLeft: 4,
  },
  card: {
    backgroundColor: "#2A1660", borderRadius: 14, overflow: "hidden", marginBottom: 24,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  inputRow: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 13, paddingHorizontal: 16, gap: 14,
  },
  iconWrapper: {
    width: 36, height: 36, borderRadius: 9, alignItems: "center", justifyContent: "center",
  },
  inputTextGroup: { flex: 1 },
  inputLabel: { color: "#E0D0FF", fontSize: 14, fontWeight: "600" },
  inputUnidad: { color: "#7B5DB5", fontSize: 11, marginTop: 1 },
  input: {
    width: 80, textAlign: "right", color: "#A47BFF",
    fontSize: 18, fontWeight: "700",
    backgroundColor: "#3D2070", borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: "#3D2070", marginLeft: 66 },

  saveBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 10, backgroundColor: "#7B3FE4", borderRadius: 14,
    paddingVertical: 16, marginBottom: 20,
  },
  saveBtnDone: { backgroundColor: "#A47BFF" },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  saveBtnTextDone: { color: "#1E0F3A" },

  noteBox: { flexDirection: "row", alignItems: "flex-start", gap: 8, paddingHorizontal: 4 },
  noteText: { flex: 1, color: "#6B4FAA", fontSize: 12, lineHeight: 18 },
});

export default ObjetivoDiario;