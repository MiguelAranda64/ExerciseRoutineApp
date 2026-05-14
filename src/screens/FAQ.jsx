import React, { useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, LayoutAnimation, Platform, UIManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─── Preguntas ─────────────────────────────────────────────────────────────────

const CATEGORIAS = [
  {
    titulo: "Cuenta y perfil",
    icon: "person-circle-outline",
    color: "#A47BFF",
    items: [
      {
        q: "¿Cómo cambio mi foto de perfil?",
        a: "Ve a Preferencias → Mi perfil y toca tu foto actual. Podrás elegir una imagen de tu galería o tomar una nueva foto.",
      },
      {
        q: "¿Puedo usar MiEntrenador sin crear una cuenta?",
        a: "Sí, puedes usar la app en modo local. Tus datos se guardan en el dispositivo, pero no podrás sincronizarlos ni acceder desde otro celular.",
      },
      {
        q: "¿Cómo elimino mi cuenta?",
        a: "Envía un correo a privacidad@mientrenador.app solicitando la eliminación. La procesamos en máximo 7 días hábiles.",
      },
    ],
  },
  {
    titulo: "Entrenamiento",
    icon: "barbell-outline",
    color: "#FB923C",
    items: [
      {
        q: "¿Puedo crear mis propias rutinas?",
        a: "Sí. En la sección de Entrenamientos toca el botón '+' para crear una rutina personalizada con los ejercicios que prefieras.",
      },
      {
        q: "¿La app funciona sin conexión a internet?",
        a: "Sí, todas las rutinas y tu historial de entrenamiento están disponibles sin conexión. Solo las funciones de sincronización requieren internet.",
      },
      {
        q: "¿Cómo registro un peso personal (PR)?",
        a: "Al registrar una serie, si superas tu mejor marca la app lo detecta automáticamente y lo guarda como nuevo PR con notificación de logro.",
      },
    ],
  },
  {
    titulo: "Notificaciones",
    icon: "notifications-outline",
    color: "#34D399",
    items: [
      {
        q: "¿Por qué no recibo los recordatorios de entrenamiento?",
        a: "Verifica que las notificaciones estén habilitadas en Ajustes → Notificaciones de tu dispositivo. En iOS también revisa que no estés en modo No Molestar.",
      },
      {
        q: "¿Puedo cambiar la hora del recordatorio?",
        a: "Sí. Ve a Preferencias → Notificaciones, activa el recordatorio diario y toca la hora para cambiarla con el selector.",
      },
    ],
  },
  {
    titulo: "Objetivos y nutrición",
    icon: "flame-outline",
    color: "#F472B6",
    items: [
      {
        q: "¿De dónde salen mis objetivos de calorías?",
        a: "Los estableces tú mismo en Preferencias → Objetivo Diario. Te recomendamos consultar con un nutricionista para metas más precisas.",
      },
      {
        q: "¿La app cuenta automáticamente mis pasos?",
        a: "Actualmente el conteo de pasos es manual. En futuras versiones integraremos conexión con Apple Health y Google Fit.",
      },
    ],
  },
  {
    titulo: "Privacidad y datos",
    icon: "shield-checkmark-outline",
    color: "#7BE4A4",
    items: [
      {
        q: "¿Venden mis datos?",
        a: "Nunca. Tus datos personales y de entrenamiento no se venden ni comparten con terceros. Revisa nuestra política de privacidad para más detalle.",
      },
      {
        q: "¿Puedo exportar mis datos?",
        a: "Puedes solicitarlo escribiéndonos a privacidad@mientrenador.app. Te enviamos un archivo con toda tu información en formato legible.",
      },
    ],
  },
];

// ─── Sub-componentes ──────────────────────────────────────────────────────────

const FAQItem = ({ pregunta, respuesta }) => {
  const [open, setOpen] = useState(false);

  function toggle() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((p) => !p);
  }

  return (
    <View style={styles.faqItem}>
      <TouchableOpacity style={styles.faqHeader} onPress={toggle} activeOpacity={0.75}>
        <Text style={styles.faqQ}>{pregunta}</Text>
        <Ionicons name={open ? "chevron-up" : "chevron-down"} size={17} color="#A47BFF" />
      </TouchableOpacity>
      {open && (
        <View style={styles.faqAnswerWrap}>
          <Text style={styles.faqA}>{respuesta}</Text>
        </View>
      )}
    </View>
  );
};

// ─── Componente principal ──────────────────────────────────────────────────────

const FAQ = ({ navigation }) => {
  const [search, setSearch] = useState("");

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color="#A47BFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preguntas Frecuentes</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.heroBox}>
          <View style={styles.heroIcon}>
            <Ionicons name="help-circle" size={34} color="#A47BFF" />
          </View>
          <Text style={styles.heroTitle}>¿En qué podemos ayudarte?</Text>
          <Text style={styles.heroSub}>
            Encuentra respuestas rápidas a las preguntas más comunes sobre MiEntrenador.
          </Text>
        </View>

        {/* Categorías */}
        {CATEGORIAS.map((cat) => (
          <View key={cat.titulo}>
            {/* Encabezado de categoría */}
            <View style={styles.catHeader}>
              <View style={[styles.catIconWrap, { backgroundColor: cat.color + "22" }]}>
                <Ionicons name={cat.icon} size={16} color={cat.color} />
              </View>
              <Text style={[styles.catTitulo, { color: cat.color }]}>{cat.titulo}</Text>
            </View>

            <View style={styles.card}>
              {cat.items.map((item, index) => (
                <React.Fragment key={item.q}>
                  <FAQItem pregunta={item.q} respuesta={item.a} />
                  {index < cat.items.length - 1 && (
                    <View style={styles.separator} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}

        {/* CTA a contacto */}
        <View style={styles.ctaBox}>
          <Text style={styles.ctaText}>¿No encontraste lo que buscabas?</Text>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => navigation?.navigate("Contacto")}
            activeOpacity={0.8}
          >
            <Ionicons name="mail-outline" size={18} color="#1E0F3A" />
            <Text style={styles.ctaBtnText}>Contáctanos</Text>
          </TouchableOpacity>
        </View>
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
  headerTitle: { color: "#FFFFFF", fontSize: 22, fontWeight: "700", letterSpacing: 0.4, flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 48 },

  heroBox: {
    backgroundColor: "#2A1660", borderRadius: 16, padding: 24,
    alignItems: "center", marginBottom: 28,
  },
  heroIcon: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: "#3D2070", alignItems: "center", justifyContent: "center", marginBottom: 14,
  },
  heroTitle: { color: "#E0D0FF", fontSize: 17, fontWeight: "700", textAlign: "center", marginBottom: 8 },
  heroSub: { color: "#7B5DB5", fontSize: 13, textAlign: "center", lineHeight: 20 },

  catHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10, paddingLeft: 4 },
  catIconWrap: { width: 26, height: 26, borderRadius: 6, alignItems: "center", justifyContent: "center" },
  catTitulo: { fontSize: 12, fontWeight: "700", letterSpacing: 1.1, textTransform: "uppercase" },

  card: {
    backgroundColor: "#2A1660", borderRadius: 14, overflow: "hidden", marginBottom: 22,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  faqItem: { paddingHorizontal: 16, paddingVertical: 14 },
  faqHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 },
  faqQ: { flex: 1, color: "#E0D0FF", fontSize: 14, fontWeight: "600" },
  faqAnswerWrap: { marginTop: 10 },
  faqA: { color: "#7B5DB5", fontSize: 13, lineHeight: 20 },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: "#3D2070", marginLeft: 16 },

  ctaBox: {
    backgroundColor: "#2A1660", borderRadius: 14, padding: 20,
    alignItems: "center", gap: 14,
  },
  ctaText: { color: "#C4ADFF", fontSize: 14, fontWeight: "600" },
  ctaBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#A47BFF", borderRadius: 10,
    paddingHorizontal: 24, paddingVertical: 12,
  },
  ctaBtnText: { color: "#1E0F3A", fontWeight: "700", fontSize: 15 },
});

export default FAQ;