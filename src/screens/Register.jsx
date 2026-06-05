import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { supabase } from "../db_connection/supabase";
import { useNavigation } from "@react-navigation/native";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigation = useNavigation();

  function validate() {
    if (!email || !password || !confirmPassword) {
      setError("Por favor llena todos los campos.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Ingresa un correo electrónico válido.");
      return false;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return false;
    }
    return true;
  }

  async function handleRegister() {
    setError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        setError(error.message);
        return;
      }

      // Supabase puede requerir confirmación por email según tu config
      if (data?.user && !data?.session) {
        Alert.alert(
          "Revisa tu correo",
          "Te enviamos un enlace de confirmación. Verifica tu bandeja de entrada para activar tu cuenta.",
          [{ text: "Entendido", onPress: () => navigation.navigate("Login") }]
        );
        return;
      }

      // Si no requiere confirmación, ya tiene sesión → ir a Home
      if (data?.session) {
        navigation.navigate("Home");
      }
    } catch (err) {
      setError(err?.message || "Error desconocido al registrarse.");
    } finally {
      setLoading(false);
    }
  }

  // Indicador de fortaleza de contraseña
  const passwordStrength = () => {
    if (!password) return null;
    if (password.length < 6) return { label: "Muy corta", color: "#ff6b8a", width: "25%" };
    if (password.length < 8) return { label: "Débil", color: "#f0a500", width: "50%" };
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) return { label: "Fuerte", color: "#4caf7d", width: "100%" };
    return { label: "Aceptable", color: "#7c5cbf", width: "75%" };
  };
  const strength = passwordStrength();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" />

      {/* Header con botón de regreso */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={20} color="#c4a8ff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crear cuenta</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.brandArea}>
          <View style={styles.logoCircle}>
            <Feather name="user-plus" size={28} color="#c4a8ff" />
          </View>
          <Text style={styles.appName}>Regístrate</Text>
          <Text style={styles.subtitle}>Crea tu cuenta para empezar</Text>
        </View>

        <View style={styles.card}>

          {/* Email */}
          <View style={styles.fieldWrapper}>
            <View style={styles.fieldLabel}>
              <Feather name="mail" size={12} color="#7c5cbf" style={{ marginRight: 5 }} />
              <Text style={styles.label}>Correo electrónico</Text>
            </View>
            <TextInput
              onChangeText={setEmail}
              value={email}
              placeholder="correo@ejemplo.com"
              placeholderTextColor="#4a3570"
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />
          </View>

          {/* Contraseña */}
          <View style={styles.fieldWrapper}>
            <View style={styles.fieldLabel}>
              <Feather name="lock" size={12} color="#7c5cbf" style={{ marginRight: 5 }} />
              <Text style={styles.label}>Contraseña</Text>
            </View>
            <View style={styles.passwordRow}>
              <TextInput
                onChangeText={setPassword}
                value={password}
                placeholder="Mín. 6 caracteres"
                placeholderTextColor="#4a3570"
                autoCapitalize="none"
                secureTextEntry={!showPassword}
                style={[styles.input, styles.passwordInput]}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword((p) => !p)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name={showPassword ? "eye" : "eye-off"} size={18} color="#7c5cbf" />
              </TouchableOpacity>
            </View>

            {/* Barra de fortaleza */}
            {strength && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthTrack}>
                  <View style={[styles.strengthBar, { width: strength.width, backgroundColor: strength.color }]} />
                </View>
                <Text style={[styles.strengthLabel, { color: strength.color }]}>{strength.label}</Text>
              </View>
            )}
          </View>

          {/* Confirmar contraseña */}
          <View style={styles.fieldWrapper}>
            <View style={styles.fieldLabel}>
              <Feather name="check-circle" size={12} color="#7c5cbf" style={{ marginRight: 5 }} />
              <Text style={styles.label}>Confirmar contraseña</Text>
            </View>
            <View style={styles.passwordRow}>
              <TextInput
                onChangeText={setConfirmPassword}
                value={confirmPassword}
                placeholder="Repite tu contraseña"
                placeholderTextColor="#4a3570"
                autoCapitalize="none"
                secureTextEntry={!showConfirm}
                style={[
                  styles.input,
                  styles.passwordInput,
                  confirmPassword && password !== confirmPassword && styles.inputError,
                  confirmPassword && password === confirmPassword && styles.inputSuccess,
                ]}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowConfirm((p) => !p)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name={showConfirm ? "eye" : "eye-off"} size={18} color="#7c5cbf" />
              </TouchableOpacity>
              {/* Checkmark si coinciden */}
              {confirmPassword && password === confirmPassword && (
                <View style={styles.matchIcon}>
                  <Feather name="check" size={14} color="#4caf7d" />
                </View>
              )}
            </View>
          </View>

          {/* Error */}
          {error ? (
            <View style={styles.errorBox}>
              <Feather name="alert-circle" size={13} color="#ff6b8a" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Botón registrar */}
          <TouchableOpacity
            style={[styles.primaryBtn, loading && styles.btnDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <Text style={styles.primaryBtnText}>Creando cuenta...</Text>
            ) : (
              <>
                <Feather name="user-plus" size={17} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.primaryBtnText}>Crear cuenta</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Link a login */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>¿Ya tienes cuenta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.footerLink}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#120829",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(108, 79, 170, 0.2)",
  },
  headerTitle: {
    color: "#e8d9ff",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(108, 79, 170, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  brandArea: {
    alignItems: "center",
    marginBottom: 28,
  },
  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: "rgba(108, 79, 170, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(108, 79, 170, 0.4)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    shadowColor: "#9b6dff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
  },
  appName: {
    color: "#f0e6ff",
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  subtitle: {
    color: "#5a3d8a",
    fontSize: 14,
    marginTop: 4,
  },
  card: {
    backgroundColor: "rgba(44, 27, 77, 0.5)",
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(108, 79, 170, 0.25)",
    marginBottom: 24,
  },
  fieldWrapper: {
    marginBottom: 16,
  },
  fieldLabel: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  label: {
    color: "#7c5cbf",
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: "rgba(18, 8, 41, 0.6)",
    color: "#e8d9ff",
    borderWidth: 1,
    borderColor: "rgba(108, 79, 170, 0.35)",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  inputError: {
    borderColor: "rgba(255, 107, 138, 0.5)",
  },
  inputSuccess: {
    borderColor: "rgba(76, 175, 125, 0.5)",
  },
  passwordRow: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 46,
  },
  eyeBtn: {
    position: "absolute",
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  matchIcon: {
    position: "absolute",
    right: 40,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  strengthContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 10,
  },
  strengthTrack: {
    flex: 1,
    height: 4,
    backgroundColor: "rgba(108, 79, 170, 0.2)",
    borderRadius: 2,
    overflow: "hidden",
  },
  strengthBar: {
    height: "100%",
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 11,
    fontWeight: "600",
    minWidth: 60,
    textAlign: "right",
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 107, 138, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 107, 138, 0.25)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    gap: 7,
  },
  errorText: {
    color: "#ff6b8a",
    fontSize: 13,
    flexShrink: 1,
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 14,
    backgroundColor: "#6c3db5",
    marginTop: 4,
    shadowColor: "#9b6dff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  btnDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  footerText: {
    color: "#5a3d8a",
    fontSize: 14,
  },
  footerLink: {
    color: "#c4a8ff",
    fontSize: 14,
    fontWeight: "700",
  },
});

export default Register;