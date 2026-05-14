import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Habilitar animaciones de layout en Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─── Datos ────────────────────────────────────────────────────────────────────

const ULTIMA_ACTUALIZACION = "13 de mayo de 2025";
const CONTACTO_EMAIL = "privacidad@mientrenador.app";

const DATA_SECTIONS = [
  {
    icon: "person-outline",
    title: "Datos de perfil",
    description: "Nombre, correo electrónico y foto de perfil que proporcionas al registrarte.",
    color: "#A47BFF",
  },
  {
    icon: "barbell-outline",
    title: "Datos de entrenamiento",
    description: "Rutinas, series, repeticiones, pesos y progreso registrado en la app.",
    color: "#7BE4A4",
  },
  {
    icon: "notifications-outline",
    title: "Preferencias",
    description: "Configuración de notificaciones y ajustes personalizados de la app.",
    color: "#FFB347",
  },
  {
    icon: "phone-portrait-outline",
    title: "Datos del dispositivo",
    description: "Modelo, sistema operativo y token de notificaciones push (solo si los activas).",
    color: "#FF7BB5",
  },
];

const FAQ_ITEMS = [
  {
    question: "¿Venden mis datos a terceros?",
    answer:
      "No. Nunca vendemos, alquilamos ni comercializamos tus datos personales con terceros. Tu información solo se usa para brindarte la experiencia de MiEntrenador.",
  },
  {
    question: "¿Cómo puedo eliminar mi cuenta?",
    answer:
      "Puedes solicitar la eliminación completa de tu cuenta y datos enviando un correo a privacidad@mientrenador.app. Procesamos la solicitud en un máximo de 7 días hábiles.",
  },
  {
    question: "¿Dónde se almacenan mis datos?",
    answer:
      "Tus datos se almacenan en servidores seguros. La información de entrenamiento se guarda localmente en tu dispositivo usando AsyncStorage para funcionar sin conexión.",
  },
  {
    question: "¿Usan mis datos para entrenar IA?",
    answer:
      "No. Tus datos de entrenamiento personal no se utilizan para entrenar modelos de inteligencia artificial ni para ningún propósito que no sea mostrarte tu propio progreso.",
  },
  {
    question: "¿Qué pasa si cambias esta política?",
    answer:
      "Te notificaremos dentro de la app con al menos 15 días de anticipación ante cualquier cambio relevante en esta política de privacidad.",
  },
];

// ─── Sub-componentes ──────────────────────────────────────────────────────────

const DataCard = ({ icon, title, description, color }) => (
  <View style={styles.dataCard}>
    <View style={[styles.dataIconWrapper, { backgroundColor: color + "22" }]}>
      <Ionicons name={icon} size={22} color={color} />
    </View>
    <View style={styles.dataTextGroup}>
      <Text style={styles.dataTitle}>{title}</Text>
      <Text style={styles.dataDesc}>{description}</Text>
    </View>
  </View>
);

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  function toggle() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((prev) => !prev);
  }

  return (
    <View style={styles.faqItem}>
      <TouchableOpacity
        style={styles.faqHeader}
        onPress={toggle}
        activeOpacity={0.75}
      >
        <Text style={styles.faqQuestion}>{question}</Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={18}
          color="#A47BFF"
        />
      </TouchableOpacity>
      {open && <Text style={styles.faqAnswer}>{answer}</Text>}
    </View>
  );
};

// ─── Componente principal ─────────────────────────────────────────────────────

const Privacidad = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>Privacidad</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.heroBox}>
          <View style={styles.heroIconCircle}>
            <Ionicons name="shield-checkmark" size={36} color="#A47BFF" />
          </View>
          <Text style={styles.heroTitle}>Tu privacidad, nuestra prioridad</Text>
          <Text style={styles.heroSub}>
            En MiEntrenador creemos que tus datos de entrenamiento son tuyos. Esta página explica qué recopilamos, cómo lo usamos y tus derechos.
          </Text>
          <View style={styles.updatedBadge}>
            <Ionicons name="time-outline" size={13} color="#7B5DB5" />
            <Text style={styles.updatedText}>
              Actualizado el {ULTIMA_ACTUALIZACION}
            </Text>
          </View>
        </View>

        {/* ── Sección: Qué datos recopilamos ── */}
        <Text style={styles.sectionTitle}>Datos que recopilamos</Text>
        <View style={styles.card}>
          {DATA_SECTIONS.map((item, index) => (
            <React.Fragment key={item.title}>
              <DataCard {...item} />
              {index < DATA_SECTIONS.length - 1 && (
                <View style={styles.cardSeparator} />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* ── Sección: Cómo usamos tus datos ── */}
        <Text style={styles.sectionTitle}>¿Para qué usamos tus datos?</Text>
        <View style={styles.card}>
          {[
            { icon: "trending-up-outline", text: "Mostrarte tu progreso y estadísticas de entrenamiento." },
            { icon: "notifications-outline", text: "Enviarte recordatorios si los activas en Notificaciones." },
            { icon: "construct-outline", text: "Mejorar la app con datos anónimos y agregados." },
            { icon: "lock-closed-outline", text: "Nunca para publicidad ni para venderlos a terceros." },
          ].map((item, i, arr) => (
            <React.Fragment key={i}>
              <View style={styles.useItem}>
                <View style={styles.useIconWrapper}>
                  <Ionicons name={item.icon} size={18} color="#A47BFF" />
                </View>
                <Text style={styles.useText}>{item.text}</Text>
              </View>
              {i < arr.length - 1 && <View style={styles.cardSeparator} />}
            </React.Fragment>
          ))}
        </View>

        {/* ── Sección: Tus derechos ── */}
        <Text style={styles.sectionTitle}>Tus derechos</Text>
        <View style={styles.card}>
          {[
            { icon: "eye-outline",    label: "Acceso",      desc: "Solicita una copia de todos tus datos." },
            { icon: "create-outline", label: "Corrección",  desc: "Corrige datos incorrectos en tu perfil." },
            { icon: "trash-outline",  label: "Eliminación", desc: "Elimina tu cuenta y todos tus datos." },
            { icon: "download-outline", label: "Exportación", desc: "Descarga tus datos en formato legible." },
          ].map((item, i, arr) => (
            <React.Fragment key={item.label}>
              <View style={styles.rightItem}>
                <View style={styles.rightIconWrapper}>
                  <Ionicons name={item.icon} size={18} color="#7BE4A4" />
                </View>
                <View style={styles.rightTextGroup}>
                  <Text style={styles.rightLabel}>{item.label}</Text>
                  <Text style={styles.rightDesc}>{item.desc}</Text>
                </View>
              </View>
              {i < arr.length - 1 && <View style={styles.cardSeparator} />}
            </React.Fragment>
          ))}
        </View>

        {/* ── Sección: FAQ ── */}
        <Text style={styles.sectionTitle}>Preguntas frecuentes</Text>
        <View style={styles.card}>
          {FAQ_ITEMS.map((item, i, arr) => (
            <React.Fragment key={item.question}>
              <FAQItem {...item} />
              {i < arr.length - 1 && <View style={styles.cardSeparator} />}
            </React.Fragment>
          ))}
        </View>

        {/* ── Contacto ── */}
        <Text style={styles.sectionTitle}>Contacto</Text>
        <TouchableOpacity
          style={styles.contactCard}
          activeOpacity={0.8}
          onPress={() => Linking.openURL(`mailto:${CONTACTO_EMAIL}`)}
        >
          <View style={styles.contactIconWrapper}>
            <Ionicons name="mail-outline" size={22} color="#A47BFF" />
          </View>
          <View style={styles.contactTextGroup}>
            <Text style={styles.contactLabel}>¿Tienes dudas o solicitudes?</Text>
            <Text style={styles.contactEmail}>{CONTACTO_EMAIL}</Text>
          </View>
          <Ionicons name="open-outline" size={18} color="#7B5DB5" />
        </TouchableOpacity>

        {/* Nota final */}
        <View style={styles.noteBox}>
          <Ionicons name="information-circle-outline" size={15} color="#7B5DB5" />
          <Text style={styles.noteText}>
            Al usar MiEntrenador aceptas esta política. Ante cambios importantes, te avisaremos dentro de la app.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

// ─── Estilos ──────────────────────────────────────────────────────────────────

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

  // Hero
  heroBox: {
    backgroundColor: "#2A1660",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 28,
  },
  heroIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#3D2070",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heroTitle: {
    color: "#E0D0FF",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  heroSub: {
    color: "#7B5DB5",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 14,
  },
  updatedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#3D2070",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  updatedText: {
    color: "#7B5DB5",
    fontSize: 12,
  },

  // Section title
  sectionTitle: {
    color: "#A47BFF",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 10,
    paddingLeft: 4,
  },

  // Card base
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
  cardSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#3D2070",
    marginLeft: 58,
  },

  // Data cards
  dataCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    gap: 14,
  },
  dataIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  dataTextGroup: { flex: 1 },
  dataTitle: {
    color: "#E0D0FF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 3,
  },
  dataDesc: {
    color: "#7B5DB5",
    fontSize: 12,
    lineHeight: 18,
  },

  // Use items
  useItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
  },
  useIconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#3D2070",
    alignItems: "center",
    justifyContent: "center",
  },
  useText: {
    flex: 1,
    color: "#C4ADFF",
    fontSize: 13,
    lineHeight: 19,
  },

  // Rights items
  rightItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
  },
  rightIconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#1A3D2B",
    alignItems: "center",
    justifyContent: "center",
  },
  rightTextGroup: { flex: 1 },
  rightLabel: {
    color: "#7BE4A4",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  rightDesc: {
    color: "#7B5DB5",
    fontSize: 12,
  },

  // FAQ
  faqItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  faqQuestion: {
    flex: 1,
    color: "#E0D0FF",
    fontSize: 14,
    fontWeight: "600",
  },
  faqAnswer: {
    color: "#7B5DB5",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
  },

  // Contact
  contactCard: {
    backgroundColor: "#2A1660",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  contactIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#3D2070",
    alignItems: "center",
    justifyContent: "center",
  },
  contactTextGroup: { flex: 1 },
  contactLabel: {
    color: "#E0D0FF",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 3,
  },
  contactEmail: {
    color: "#A47BFF",
    fontSize: 13,
  },

  // Note
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

export default Privacidad;