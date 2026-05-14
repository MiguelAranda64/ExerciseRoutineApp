import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "../i18n/i18n"; // ajusta la ruta según tu estructura

// ─── Idiomas disponibles ───────────────────────────────────────────────────────

const LANGUAGES = [
  {
    code: "es",
    nombre: "Español",
    region: "España / Latinoamérica",
    flag: "🇪🇸",
  },
  {
    code: "en",
    nombre: "English",
    region: "United States / Global",
    flag: "🇺🇸",
  },
];

// ─── Componente principal ──────────────────────────────────────────────────────

const Idioma = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const [selected, setSelected] = useState(i18n.language ?? "es");
  const [applying, setApplying] = useState(false);

  async function handleSelect(code) {
    if (code === selected || applying) return;
    setApplying(true);
    setSelected(code);
    await changeLanguage(code);
    setApplying(false);
  }

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={28} color="#A47BFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("idioma.titulo")}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Subtítulo */}
        <Text style={styles.subtitle}>{t("idioma.subtitulo")}</Text>

        {/* Lista de idiomas */}
        <Text style={styles.sectionTitle}>{t("idioma.seccion")}</Text>
        <View style={styles.card}>
          {LANGUAGES.map((lang, index) => {
            const isSelected = selected === lang.code;
            const isLast = index === LANGUAGES.length - 1;

            return (
              <React.Fragment key={lang.code}>
                <TouchableOpacity
                  style={[
                    styles.langItem,
                    isSelected && styles.langItemSelected,
                  ]}
                  onPress={() => handleSelect(lang.code)}
                  activeOpacity={0.75}
                >
                  {/* Bandera */}
                  <View style={styles.flagWrapper}>
                    <Text style={styles.flagEmoji}>{lang.flag}</Text>
                  </View>

                  {/* Nombre e info */}
                  <View style={styles.langTextGroup}>
                    <Text
                      style={[
                        styles.langNombre,
                        isSelected && styles.langNombreSelected,
                      ]}
                    >
                      {lang.nombre}
                    </Text>
                    <Text style={styles.langRegion}>{lang.region}</Text>
                  </View>

                  {/* Check o indicador */}
                  {isSelected ? (
                    <View style={styles.checkCircle}>
                      <Ionicons name="checkmark" size={14} color="#1E0F3A" />
                    </View>
                  ) : (
                    <View style={styles.emptyCircle} />
                  )}
                </TouchableOpacity>

                {!isLast && <View style={styles.separator} />}
              </React.Fragment>
            );
          })}
        </View>

        {/* Nota informativa */}
        <View style={styles.noteBox}>
          <Ionicons
            name="information-circle-outline"
            size={15}
            color="#7B5DB5"
          />
          <Text style={styles.noteText}>{t("idioma.nota")}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

// ─── Estilos ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#1E0F3A",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#3D2070",
    gap: 12,
  },
  backBtn: { padding: 4 },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: 0.4,
  },

  scroll: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 48,
  },

  subtitle: {
    color: "#7B5DB5",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 28,
    paddingLeft: 4,
  },

  sectionTitle: {
    color: "#A47BFF",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 10,
    paddingLeft: 4,
  },

  // Card
  card: {
    backgroundColor: "#2A1660",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  // Item de idioma
  langItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 14,
  },
  langItemSelected: {
    backgroundColor: "#33196B",
  },

  flagWrapper: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#3D2070",
    alignItems: "center",
    justifyContent: "center",
  },
  flagEmoji: {
    fontSize: 22,
  },

  langTextGroup: {
    flex: 1,
  },
  langNombre: {
    color: "#C4ADFF",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  langNombreSelected: {
    color: "#FFFFFF",
  },
  langRegion: {
    color: "#7B5DB5",
    fontSize: 12,
  },

  // Check / círculo vacío
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#A47BFF",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#3D2070",
  },

  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#3D2070",
    marginLeft: 72,
  },

  // Nota
  noteBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    paddingHorizontal: 4,
    marginTop: -8,
  },
  noteText: {
    flex: 1,
    color: "#6B4FAA",
    fontSize: 12,
    lineHeight: 18,
  },
});

export default Idioma;