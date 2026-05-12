import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";

// Cada sección con sus items
const SECTIONS = [
  {
    title: "Cuenta",
    items: [
      { label: "Notificaciones", icon: "notifications-outline", lib: "Ionicons", screen: "Notificaciones" },
      { label: "Privacidad",     icon: "lock-closed-outline",   lib: "Ionicons", screen: "Privacidad" },
      { label: "Idioma",         icon: "globe-outline",          lib: "Ionicons", screen: "Idioma" },
    ],
  },
  {
    title: "General",
    items: [
      { label: "Color de interfaz", icon: "color-palette-outline", lib: "Ionicons",  screen: "ColorInterfaz" },
      { label: "Objetivo diario",   icon: "star-outline",           lib: "Ionicons",  screen: "ObjetivoDiario" },
      { label: "Preferencias",      icon: "options-outline",        lib: "Ionicons",  screen: "Preferencias" },
    ],
  },
  {
    title: "Soporte",
    items: [
      { label: "Preguntas frecuentes", icon: "help-circle-outline", lib: "Ionicons", screen: "FAQ" },
      { label: "Contáctanos",          icon: "chatbox-outline",     lib: "Ionicons", screen: "Contacto" },
    ],
  },
];

const SettingsItem = ({ item, isFirst, isLast, onPress }) => (
  <>
    <TouchableOpacity
      style={[
        styles.item,
        isFirst && styles.itemFirst,
        isLast  && styles.itemLast,
      ]}
      onPress={() => onPress?.(item.screen)}
      activeOpacity={0.7}
    >
      {/* Icono izquierdo */}
      <View style={styles.iconWrapper}>
        <Ionicons name={item.icon} size={20} color="#A47BFF" />
      </View>

      {/* Texto */}
      <Text style={styles.itemLabel}>{item.label}</Text>

      {/* Flecha derecha */}
      <Ionicons name="chevron-forward" size={20} color="#7B5DB5" />
    </TouchableOpacity>

    {/* Separador interno (excepto en el último) */}
    {!isLast && <View style={styles.separator} />}
  </>
);

const Ajustes = ({ navigation }) => {
  const handlePress = (screen) => {
    // Navega a la pantalla correspondiente cuando estén creadas
    navigation?.navigate?.(screen);
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ajustes</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            {/* Título de sección */}
            <Text style={styles.sectionTitle}>{section.title}</Text>

            {/* Card con todos los items */}
            <View style={styles.card}>
              {section.items.map((item, index) => (
                <SettingsItem
                  key={item.label}
                  item={item}
                  isFirst={index === 0}
                  isLast={index === section.items.length - 1}
                  onPress={handlePress}
                />
              ))}
            </View>
          </View>
        ))}

        {/* Versión */}
        <Text style={styles.version}>Versión 1.00</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#1E0F3A",
  },

  header: {
    marginTop: 47,
    paddingHorizontal: 24,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#3D2070",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  scroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    color: "#A47BFF",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    marginBottom: 10,
    paddingLeft: 4,
  },

  // Card que envuelve todos los items de una sección
  card: {
    backgroundColor: "#2A1660",
    borderRadius: 14,
    overflow: "hidden",
    // Sombra sutil
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
  },

  // Bordes redondeados solo en el primero/último para no romper el overflow del card
  itemFirst: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  itemLast: {
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },

  iconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#3D2070",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  itemLabel: {
    flex: 1,
    color: "#E0D0FF",
    fontSize: 16,
    fontWeight: "500",
  },

  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#3D2070",
    marginLeft: 64, // alineado con el texto, después del icono
  },

  version: {
    color: "#6B4FAA",
    fontSize: 13,
    textAlign: "right",
    marginTop: 8,
    paddingRight: 4,
  },
});

export default Ajustes;