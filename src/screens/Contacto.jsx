import React, { useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, TextInput, Linking, Alert, KeyboardAvoidingView, Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CONTACTO_EMAIL = "hola@mientrenador.app";
const CONTACTO_INSTAGRAM = "https://instagram.com/mientrenador";

const TEMAS = [
  { id: "bug",       label: "Reportar un error",     icon: "bug-outline" },
  { id: "sugerencia",label: "Sugerencia de mejora",  icon: "bulb-outline" },
  { id: "cuenta",    label: "Problema con mi cuenta",icon: "person-outline" },
  { id: "otro",      label: "Otro",                  icon: "chatbubble-outline" },
];

const Contacto = ({ navigation }) => {
  const [nombre, setNombre]   = useState("");
  const [email, setEmail]     = useState("");
  const [tema, setTema]       = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [sent, setSent]       = useState(false);

  function validate() {
    if (!nombre.trim())   { Alert.alert("Campo requerido", "Por favor ingresa tu nombre."); return false; }
    if (!email.trim() || !email.includes("@")) { Alert.alert("Email inválido", "Ingresa un email válido."); return false; }
    if (!tema)            { Alert.alert("Selecciona un tema", "Elige el tema de tu mensaje."); return false; }
    if (mensaje.trim().length < 10) { Alert.alert("Mensaje muy corto", "Escribe al menos 10 caracteres."); return false; }
    return true;
  }

  async function handleSend() {
    if (!validate()) return;

    const temaLabel = TEMAS.find((t) => t.id === tema)?.label ?? tema;
    const body = encodeURIComponent(
      `Nombre: ${nombre}\nTema: ${temaLabel}\n\n${mensaje}`
    );
    const subject = encodeURIComponent(`[MiEntrenador] ${temaLabel}`);
    const url = `mailto:${CONTACTO_EMAIL}?subject=${subject}&body=${body}`;

    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
      setSent(true);
    } else {
      Alert.alert("Sin cliente de correo", `Escríbenos directamente a ${CONTACTO_EMAIL}`);
    }
  }

  function handleReset() {
    setNombre(""); setEmail(""); setTema(null); setMensaje(""); setSent(false);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.root}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={28} color="#A47BFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Contacto</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {!sent ? (
            <>
              {/* Canales directos */}
              <Text style={styles.sectionTitle}>Canales directos</Text>
              <View style={styles.card}>
                {[
                  {
                    icon: "mail-outline", color: "#A47BFF",
                    label: "Email", value: CONTACTO_EMAIL,
                    onPress: () => Linking.openURL(`mailto:${CONTACTO_EMAIL}`),
                  },
                  {
                    icon: "logo-instagram", color: "#F472B6",
                    label: "Instagram", value: "@mientrenador",
                    onPress: () => Linking.openURL(CONTACTO_INSTAGRAM),
                  },
                ].map((canal, index, arr) => (
                  <React.Fragment key={canal.label}>
                    <TouchableOpacity style={styles.canalItem} onPress={canal.onPress} activeOpacity={0.75}>
                      <View style={[styles.canalIcon, { backgroundColor: canal.color + "22" }]}>
                        <Ionicons name={canal.icon} size={20} color={canal.color} />
                      </View>
                      <View style={styles.canalTextGroup}>
                        <Text style={styles.canalLabel}>{canal.label}</Text>
                        <Text style={styles.canalValue}>{canal.value}</Text>
                      </View>
                      <Ionicons name="open-outline" size={16} color="#4A3070" />
                    </TouchableOpacity>
                    {index < arr.length - 1 && <View style={styles.separator} />}
                  </React.Fragment>
                ))}
              </View>

              {/* Formulario */}
              <Text style={styles.sectionTitle}>Envíanos un mensaje</Text>
              <View style={styles.card}>

                {/* Nombre */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Tu nombre</Text>
                  <TextInput
                    style={styles.textInput}
                    value={nombre}
                    onChangeText={setNombre}
                    placeholder="Ej. Carlos Hernández"
                    placeholderTextColor="#4A3070"
                    selectionColor="#A47BFF"
                  />
                </View>

                <View style={styles.separator} />

                {/* Email */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Tu email</Text>
                  <TextInput
                    style={styles.textInput}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="correo@ejemplo.com"
                    placeholderTextColor="#4A3070"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    selectionColor="#A47BFF"
                  />
                </View>

                <View style={styles.separator} />

                {/* Tema */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Tema</Text>
                  <View style={styles.temaGrid}>
                    {TEMAS.map((t) => {
                      const active = tema === t.id;
                      return (
                        <TouchableOpacity
                          key={t.id}
                          style={[styles.temaChip, active && styles.temaChipActive]}
                          onPress={() => setTema(t.id)}
                          activeOpacity={0.75}
                        >
                          <Ionicons name={t.icon} size={14} color={active ? "#1E0F3A" : "#A47BFF"} />
                          <Text style={[styles.temaChipText, active && styles.temaChipTextActive]}>
                            {t.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                <View style={styles.separator} />

                {/* Mensaje */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Mensaje</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    value={mensaje}
                    onChangeText={setMensaje}
                    placeholder="Cuéntanos en qué podemos ayudarte..."
                    placeholderTextColor="#4A3070"
                    multiline
                    numberOfLines={5}
                    textAlignVertical="top"
                    selectionColor="#A47BFF"
                  />
                  <Text style={styles.charCount}>{mensaje.length} / 500</Text>
                </View>
              </View>

              {/* Botón enviar */}
              <TouchableOpacity style={styles.sendBtn} onPress={handleSend} activeOpacity={0.8}>
                <Ionicons name="send-outline" size={18} color="#1E0F3A" />
                <Text style={styles.sendBtnText}>Enviar mensaje</Text>
              </TouchableOpacity>
            </>
          ) : (
            /* Estado de éxito */
            <View style={styles.successBox}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark-circle" size={52} color="#7BE4A4" />
              </View>
              <Text style={styles.successTitle}>¡Mensaje enviado!</Text>
              <Text style={styles.successSub}>
                Gracias por escribirnos. Te responderemos en un plazo de 24 a 48 horas a tu correo.
              </Text>
              <TouchableOpacity style={styles.resetBtn} onPress={handleReset} activeOpacity={0.8}>
                <Text style={styles.resetBtnText}>Enviar otro mensaje</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.noteBox}>
            <Ionicons name="time-outline" size={15} color="#7B5DB5" />
            <Text style={styles.noteText}>
              Tiempo de respuesta habitual: 24–48 horas hábiles.
            </Text>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
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

  sectionTitle: {
    color: "#A47BFF", fontSize: 12, fontWeight: "700",
    letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10, paddingLeft: 4,
  },
  card: {
    backgroundColor: "#2A1660", borderRadius: 14, overflow: "hidden", marginBottom: 24,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: "#3D2070", marginLeft: 16 },

  // Canales
  canalItem: { flexDirection: "row", alignItems: "center", padding: 16, gap: 14 },
  canalIcon: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  canalTextGroup: { flex: 1 },
  canalLabel: { color: "#E0D0FF", fontSize: 14, fontWeight: "600" },
  canalValue: { color: "#7B5DB5", fontSize: 12, marginTop: 2 },

  // Formulario
  fieldGroup: { paddingHorizontal: 16, paddingVertical: 14 },
  fieldLabel: { color: "#A47BFF", fontSize: 11, fontWeight: "700", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 8 },
  textInput: {
    color: "#E0D0FF", fontSize: 14, backgroundColor: "#3D2070",
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10,
  },
  textArea: { height: 110, paddingTop: 10 },
  charCount: { color: "#4A3070", fontSize: 11, textAlign: "right", marginTop: 6 },

  // Temas
  temaGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  temaChip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "#3D2070", borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1.5, borderColor: "transparent",
  },
  temaChipActive: { backgroundColor: "#A47BFF", borderColor: "#A47BFF" },
  temaChipText: { color: "#A47BFF", fontSize: 12, fontWeight: "600" },
  temaChipTextActive: { color: "#1E0F3A" },

  // Botón enviar
  sendBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 10, backgroundColor: "#A47BFF", borderRadius: 14,
    paddingVertical: 16, marginBottom: 20,
  },
  sendBtnText: { color: "#1E0F3A", fontSize: 16, fontWeight: "700" },

  // Success
  successBox: {
    backgroundColor: "#2A1660", borderRadius: 16, padding: 32,
    alignItems: "center", marginBottom: 24,
  },
  successIcon: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: "#0A1F15", alignItems: "center", justifyContent: "center", marginBottom: 18,
  },
  successTitle: { color: "#7BE4A4", fontSize: 22, fontWeight: "700", marginBottom: 10 },
  successSub: { color: "#7B5DB5", fontSize: 14, textAlign: "center", lineHeight: 21, marginBottom: 24 },
  resetBtn: {
    backgroundColor: "#3D2070", borderRadius: 10,
    paddingHorizontal: 24, paddingVertical: 12,
  },
  resetBtnText: { color: "#A47BFF", fontWeight: "600", fontSize: 14 },

  noteBox: { flexDirection: "row", alignItems: "flex-start", gap: 8, paddingHorizontal: 4 },
  noteText: { flex: 1, color: "#6B4FAA", fontSize: 12, lineHeight: 18 },
});

export default Contacto;