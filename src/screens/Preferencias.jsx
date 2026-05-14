import React from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// ─── Estructura del menú ───────────────────────────────────────────────────────

const SECTIONS = [
  {
    title: "Personalización",
    items: [
      {
        icon: "color-palette-outline",
        label: "Color e Interfaz",
        description: "Tema y paleta de colores",
        color: "#A47BFF",
        screen: "ColorInterfaz",
      },
      {
        icon: "language-outline",
        label: "Idioma",
        description: "Español, English",
        color: "#60A5FA",
        screen: "Idioma",
      },
    ],
  },
  {
    title: "Salud y objetivos",
    items: [
      {
        icon: "flame-outline",
        label: "Objetivo Diario",
        description: "Calorías, macros, agua y pasos",
        color: "#FB923C",
        screen: "ObjetivoDiario",
      },
      {
        icon: "notifications-outline",
        label: "Notificaciones",
        description: "Recordatorios y alertas",
        color: "#34D399",
        screen: "Notificaciones",
      },
    ],
  },
  {
    title: "Información",
    items: [
      {
        icon: "help-circle-outline",
        label: "Preguntas Frecuentes",
        description: "Resuelve tus dudas",
        color: "#FBBF24",
        screen: "FAQ",
      },
      {
        icon: "mail-outline",
        label: "Contacto",
        description: "Escríbenos directamente",
        color: "#F472B6",
        screen: "Contacto",
      },
      {
        icon: "shield-checkmark-outline",
        label: "Privacidad",
        description: "Cómo usamos tus datos",
        color: "#7BE4A4",
        screen: "Privacidad",
      },
    ],
  },
  {
    title: "Cuenta",
    items: [
      {
        icon: "person-outline",
        label: "Mi perfil",
        description: "Nombre, foto y datos personales",
        color: "#A47BFF",
        screen: "Perfil",
      },
      {
        icon: "log-out-outline",
        label: "Cerrar sesión",
        description: null,
        color: "#F87171",
        screen: null,
        danger: true,
      },
    ],
  },
];

// ─── Componente ────────────────────────────────────────────────────────────────

const Preferencias = ({ navigation }) => {
  function handlePress(item) {
    if (item.screen) {
      navigation?.navigate(item.screen);
    }
    // Para "Cerrar sesión" agregarías tu lógica de auth aquí
  }

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color="#A47BFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preferencias</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Avatar / info de usuario */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={32} color="#A47BFF" />
          </View>
          <View>
            <Text style={styles.profileName}>Tu nombre</Text>
            <Text style={styles.profileEmail}>usuario@email.com</Text>
          </View>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation?.navigate("Perfil")}
          >
            <Ionicons name="pencil-outline" size={16} color="#A47BFF" />
          </TouchableOpacity>
        </View>

        {/* Secciones */}
        {SECTIONS.map((section) => (
          <View key={section.title}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.card}>
              {section.items.map((item, index) => (
                <React.Fragment key={item.label}>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handlePress(item)}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.iconWrapper, { backgroundColor: item.color + "22" }]}>
                      <Ionicons name={item.icon} size={20} color={item.color} />
                    </View>
                    <View style={styles.menuTextGroup}>
                      <Text style={[styles.menuLabel, item.danger && styles.menuLabelDanger]}>
                        {item.label}
                      </Text>
                      {item.description && (
                        <Text style={styles.menuDesc}>{item.description}</Text>
                      )}
                    </View>
                    {item.screen && (
                      <Ionicons name="chevron-forward" size={18} color="#4A3070" />
                    )}
                  </TouchableOpacity>
                  {index < section.items.length - 1 && (
                    <View style={styles.separator} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}

        {/* Versión */}
        <Text style={styles.version}>MiEntrenador v1.0.0</Text>
      </ScrollView>
    </View>
  );
};

// ─── Estilos ───────────────────────────────────────────────────────────────────

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

  // Profile card
  profileCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#2A1660", borderRadius: 14, padding: 16, gap: 14,
    marginBottom: 28,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  avatarCircle: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: "#3D2070", alignItems: "center", justifyContent: "center",
  },
  profileName: { color: "#E0D0FF", fontSize: 16, fontWeight: "700" },
  profileEmail: { color: "#7B5DB5", fontSize: 13, marginTop: 2 },
  editBtn: {
    marginLeft: "auto",
    width: 34, height: 34, borderRadius: 8,
    backgroundColor: "#3D2070", alignItems: "center", justifyContent: "center",
  },

  sectionTitle: {
    color: "#A47BFF", fontSize: 12, fontWeight: "700",
    letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10, paddingLeft: 4,
  },
  card: {
    backgroundColor: "#2A1660", borderRadius: 14, overflow: "hidden", marginBottom: 24,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  menuItem: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 14, paddingHorizontal: 16, gap: 14,
  },
  iconWrapper: {
    width: 36, height: 36, borderRadius: 9, alignItems: "center", justifyContent: "center",
  },
  menuTextGroup: { flex: 1 },
  menuLabel: { color: "#E0D0FF", fontSize: 15, fontWeight: "600" },
  menuLabelDanger: { color: "#F87171" },
  menuDesc: { color: "#7B5DB5", fontSize: 12, marginTop: 2 },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: "#3D2070", marginLeft: 66 },
  version: { color: "#3D2070", fontSize: 12, textAlign: "center", marginTop: 8 },
});

export default Preferencias;