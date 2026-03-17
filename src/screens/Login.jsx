import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
    console.log("Attempting login with:", email);
    setError("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data?.session) {
        const msg = "Email o contraseña incorrectos.";
        setError(msg);
        Alert.alert("Error", msg);
        console.log("Login error:", error);
        return;
      }
      navigation.navigate("Home");

    } catch (err) {
      const msg = err?.msg || "Error desconocido al iniciar sesión.";
      setError(msg);
      Alert.alert("Error", msg);
      console.log("Login exception:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inicia sesión</Text>
      <View style={[styles.verticalSpacing, styles.mt20]}>
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="correo@ejemplo.com"
          placeholderTextColor="#6c4faa"
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />
      </View>

      <View style={[styles.verticalSpacing, styles.mt20]}>
        <Text style={styles.label}>Contraseña</Text>
        <View style={styles.passwordRow}>
          <TextInput
            onChangeText={(text) => setPassword(text)}
            value={password}
            placeholder="Ingresa tu contraseña"
            placeholderTextColor="#6c4faa"
            autoCapitalize="none"
            secureTextEntry={!showPassword}
            style={[styles.input, styles.passwordInput]}
          />
          <TouchableOpacity
            style={styles.toggleIconContainer}
            onPress={() => setShowPassword((prev) => !prev)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={20}
              color="#D3BFFF"
            />
          </TouchableOpacity>
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      <View style={[styles.verticalSpacing, styles.mt20]}>
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={() => handleLogin()}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Ingresando..." : "Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E0F3A",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#A47BFF",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#8249FF",
    backgroundColor: "#341578",
    color: "#D3BFFF",
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
    width: 300,
  },
  passwordRow: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 44,
  },
  toggleIconContainer: {
    position: "absolute",
    right: 10,
    top: "35%",
    transform: [{ translateY: -12 }],
    padding: 6,
    borderRadius: 50,
    backgroundColor: "rgba(75, 42, 168, 0.3)",
  },
  errorText: {
    color: "#FF6B6B",
    marginTop: 4,
  },
  verticalSpacing: {
    paddingTop: 4,
    paddingBottom: 4,
  },
  mt20: {
    marginTop: 20,
  },
  button: {
    backgroundColor: "#341578",
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Login;