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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigation = useNavigation();

  async function handleLogin() {
    setError("");
    if (!email || !password) {
      setError("Por favor ingresa tu correo y contraseña.");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data?.session) {
        setError("Email o contraseña incorrectos.");
        return;
      }
      navigation.navigate("Home");
    } catch (err) {
      setError(err?.message || "Error desconocido al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* Logo / branding area */}
        <View style={styles.brandArea}>
          <View style={styles.logoCircle}>
            <Feather name="user" size={32} color="#c4a8ff" />
          </View>
          <Text style={styles.appName}>Bienvenido</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
        </View>

        {/* Form card */}
        <View style={styles.card}>
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

          <View style={styles.fieldWrapper}>
            <View style={styles.fieldLabel}>
              <Feather name="lock" size={12} color="#7c5cbf" style={{ marginRight: 5 }} />
              <Text style={styles.label}>Contraseña</Text>
            </View>
            <View style={styles.passwordRow}>
              <TextInput
                onChangeText={setPassword}
                value={password}
                placeholder="Ingresa tu contraseña"
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
                <Ionicons
                  name={showPassword ? "eye" : "eye-off"}
                  size={18}
                  color="#7c5cbf"
                />
              </TouchableOpacity>
            </View>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Feather name="alert-circle" size={13} color="#ff6b8a" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.primaryBtn, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <Text style={styles.primaryBtnText}>Ingresando...</Text>
            ) : (
              <>
                <Feather name="log-in" size={17} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.primaryBtnText}>Iniciar sesión</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Registro */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No tienes cuenta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.footerLink}>Crear cuenta</Text>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  brandArea: {
    alignItems: "center",
    marginBottom: 36,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: "rgba(108, 79, 170, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(108, 79, 170, 0.4)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#9b6dff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
  },
  appName: {
    color: "#f0e6ff",
    fontSize: 28,
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

export default Login;