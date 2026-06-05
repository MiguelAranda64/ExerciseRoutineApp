import { useState, useEffect, useCallback } from "react";
import { supabase } from "../db_connection/supabase";
import {
  StyleSheet,
  View,
  Alert,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import Avatar from "./Avatar";
import { Entypo, Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

const Profile = ({ route, navigation }) => {
  const { id, email } = route.params;
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [avatar_url, setAvatarurl] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [originalData, setOriginalData] = useState(null);
  const [pendingImageFile, setPendingImageFile] = useState(null);
  const [localImageUri, setLocalImageUri] = useState(null);

  const hasUnsavedChanges = useCallback(() => {
    if (!originalData) return false;
    return (
      name !== originalData.name ||
      surname !== originalData.surname ||
      weight !== originalData.weight ||
      height !== originalData.height ||
      pendingImageFile !== null
    );
  }, [name, surname, weight, height, pendingImageFile, originalData]);

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener("beforeRemove", (e) => {
        if (!hasUnsavedChanges()) return;
        e.preventDefault();
        Alert.alert(
          "Cambios sin guardar",
          "Los cambios no se han guardado. ¿Deseas salir de todas formas?",
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Salir sin guardar",
              style: "destructive",
              onPress: () => {
                setPendingImageFile(null);
                setLocalImageUri(null);
                navigation.dispatch(e.data.action);
              },
            },
          ]
        );
      });
      return unsubscribe;
    }, [navigation, hasUnsavedChanges])
  );

  useEffect(() => {
    if (id) getProfile();
    checkAuthStatus();
  }, [id]);

  async function checkAuthStatus() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      Alert.alert("Error", "No se pudo verificar el estado de autenticación.");
      return;
    }
    if (!session) {
      console.log("No active session - user should log in again");
    }
  }

  async function getProfile() {
    try {
      setLoading(true);
      const { data, error, status } = await supabase
        .from("profiles")
        .select(`name, surname, avatar_url, weight, height, email`)
        .eq("id", id)
        .single();

      if (error && status !== 406) throw error;

      if (data) {
        const loaded = {
          name: data.name ?? "",
          surname: data.surname ?? "",
          avatar_url: data.avatar_url ?? "",
          weight: data.weight?.toString() ?? "",
          height: data.height?.toString() ?? "",
        };
        setName(loaded.name);
        setSurname(loaded.surname);
        setAvatarurl(loaded.avatar_url);
        setWeight(loaded.weight);
        setHeight(loaded.height);
        setOriginalData(loaded);
      }
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function uploadPendingImage() {
    if (!pendingImageFile) return avatar_url;
    const { file, fileName, mimeType } = pendingImageFile;
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, { contentType: mimeType, upsert: true });
    if (error) throw new Error("Error subiendo imagen: " + error.message);
    return data.path;
  }

  async function updateProfile() {
    try {
      setLoading(true);
      const finalAvatarUrl = await uploadPendingImage();
      const updates = {
        id, email, name, surname,
        avatar_url: finalAvatarUrl,
        weight, height,
        updated_at: new Date(),
      };
      const { error } = await supabase.from("profiles").upsert(updates);
      if (error) throw error;

      setAvatarurl(finalAvatarUrl);
      setPendingImageFile(null);
      setLocalImageUri(null);
      setOriginalData({ name, surname, avatar_url: finalAvatarUrl, weight, height });
      Alert.alert("✓ Guardado", "Perfil actualizado correctamente");
    } catch (error) {
      if (error instanceof Error) Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  }

  // --- Logout ---
  async function handleLogout() {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que quieres salir?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase.auth.signOut();
            if (error) {
              Alert.alert("Error", "No se pudo cerrar la sesión.");
              return;
            }
            // Navega a la pantalla de login (ajusta el nombre de la ruta)
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          },
        },
      ]
    );
  }

  function handleImageSelected({ file, fileName, mimeType, localUri }) {
    setPendingImageFile({ file, fileName, mimeType });
    setLocalImageUri(localUri);
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <Entypo name="arrow-left" size={22} color="#c4a8ff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Mi perfil</Text>

        {/* Botón de logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Feather name="log-out" size={18} color="#ff6b8a" />
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Avatar section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarGlow}>
            <Avatar
              url={localImageUri || avatar_url}
              size={100}
              userId={id}
              onImageSelected={handleImageSelected}
            />
          </View>

          <Text style={styles.userName}>
            {name || surname ? `${name} ${surname}`.trim() : "Tu nombre"}
          </Text>
          <Text style={styles.userEmail}>{email}</Text>

          {hasUnsavedChanges() && (
            <View style={styles.unsavedBadge}>
              <View style={styles.unsavedDot} />
              <Text style={styles.unsavedText}>Cambios sin guardar</Text>
            </View>
          )}
        </View>

        {/* Form card */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>INFORMACIÓN PERSONAL</Text>

          <Field label="Correo electrónico" icon="mail">
            <TextInput
              editable={false}
              value={email}
              autoCapitalize="none"
              keyboardType="email-address"
              style={[styles.input, styles.inputDisabled]}
              placeholderTextColor="#4a3570"
            />
          </Field>

          <View style={styles.row}>
            <View style={styles.rowField}>
              <Field label="Nombre" icon="user">
                <TextInput
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  style={styles.input}
                  placeholderTextColor="#4a3570"
                />
              </Field>
            </View>
            <View style={styles.rowField}>
              <Field label="Apellido" icon="user">
                <TextInput
                  value={surname}
                  onChangeText={setSurname}
                  autoCapitalize="words"
                  style={styles.input}
                  placeholderTextColor="#4a3570"
                />
              </Field>
            </View>
          </View>

          <Text style={[styles.sectionLabel, { marginTop: 20 }]}>MÉTRICAS</Text>

          <View style={styles.row}>
            <View style={styles.rowField}>
              <Field label="Peso (kg)" icon="activity">
                <TextInput
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                  style={styles.input}
                  placeholderTextColor="#4a3570"
                />
              </Field>
            </View>
            <View style={styles.rowField}>
              <Field label="Estatura (cm)" icon="trending-up">
                <TextInput
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="numeric"
                  style={styles.input}
                  placeholderTextColor="#4a3570"
                />
              </Field>
            </View>
          </View>
        </View>

        {/* Save button */}
        <TouchableOpacity
          style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
          onPress={updateProfile}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <Text style={styles.saveBtnText}>Guardando...</Text>
          ) : (
            <>
              <Feather name="check" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.saveBtnText}>Guardar cambios</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

// Helper component para campos con label e icono
const Field = ({ label, icon, children }) => (
  <View style={styles.fieldWrapper}>
    <View style={styles.fieldLabel}>
      <Feather name={icon} size={12} color="#7c5cbf" style={{ marginRight: 5 }} />
      <Text style={styles.label}>{label}</Text>
    </View>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#120829",
  },

  // Header
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
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255, 107, 138, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 107, 138, 0.25)",
    gap: 6,
  },
  logoutText: {
    color: "#ff6b8a",
    fontSize: 13,
    fontWeight: "600",
  },

  // Scroll
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  // Avatar section
  avatarSection: {
    alignItems: "center",
    marginBottom: 28,
  },
  avatarGlow: {
    shadowColor: "#9b6dff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 14,
  },
  userName: {
    color: "#f0e6ff",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  userEmail: {
    color: "#7c5cbf",
    fontSize: 13,
    marginTop: 4,
  },
  unsavedBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "rgba(240, 165, 0, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(240, 165, 0, 0.3)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    gap: 6,
  },
  unsavedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#f0a500",
  },
  unsavedText: {
    color: "#f0a500",
    fontSize: 12,
    fontWeight: "500",
  },

  // Card
  card: {
    backgroundColor: "rgba(44, 27, 77, 0.5)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(108, 79, 170, 0.25)",
    marginBottom: 20,
  },
  sectionLabel: {
    color: "#5a3d8a",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 14,
  },

  // Fields
  row: {
    flexDirection: "row",
    gap: 12,
  },
  rowField: {
    flex: 1,
  },
  fieldWrapper: {
    marginBottom: 14,
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
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  inputDisabled: {
    color: "#5a3d8a",
    borderColor: "rgba(108, 79, 170, 0.15)",
  },

  // Save button
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "#6c3db5",
    shadowColor: "#9b6dff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  saveBtnDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});

export default Profile;