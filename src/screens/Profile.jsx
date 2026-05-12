import { useState, useEffect, useCallback } from "react";
import { supabase } from "../db_connection/supabase";
import {
  StyleSheet,
  View,
  Alert,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import Avatar from "./Avatar";
import { Entypo } from "@expo/vector-icons";
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

  // Determine if there are unsaved changes by comparing current state with original data
  const hasUnsavedChanges = useCallback(() => {
    if (!originalData) return false;
    return (
      name !== originalData.name ||
      surname !== originalData.surname ||
      weight !== originalData.weight ||
      height !== originalData.height ||
      pendingImageFile !== null // image selected but not saved
    );
  }, [name, surname, weight, height, pendingImageFile, originalData]);

  // Intercept navigation attempts to warn about unsaved changes
  useFocusEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener("beforeRemove", (e) => {
        if (!hasUnsavedChanges()) return; // Unless there are unsaved changes, don't do anything

        e.preventDefault(); // Block navigation

        Alert.alert(
          "Cambios sin guardar",
          "Los cambios no se han guardado. ¿Deseas salir de todas formas?",
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Salir sin guardar",
              style: "destructive",
              onPress: () => {
                // Discard pending image if user chooses to leave without saving
                setPendingImageFile(null);
                setLocalImageUri(null);
                navigation.dispatch(e.data.action);
              },
            },
          ],
        );
      });

      return unsubscribe;
    }, [navigation, hasUnsavedChanges]),
  );

  useEffect(() => {
    if (id) getProfile();
    checkAuthStatus();
  }, [id]);

  async function checkAuthStatus() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) {
      console.log("Error checking auth status:", error);
      Alert.alert("Error", "No se pudo verificar el estado de autenticación.");
      return;
    }

    // If no session, you might want to redirect to login
    if (!session) {
      console.log("No active session - user should log in again");
      // navigation.navigate('Login');
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
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  // --- NUEVO: Sube la imagen al bucket y devuelve el path ---
  async function uploadPendingImage() {
    if (!pendingImageFile) return avatar_url; // Sin imagen nueva, usa la actual

    const { file, fileName, mimeType } = pendingImageFile;

    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, {
        contentType: mimeType,
        upsert: true,
      });

    if (error) throw new Error("Error subiendo imagen: " + error.message);

    return data.path; // Devuelve el path en el bucket
  }

  async function updateProfile() {
    try {
      setLoading(true);

      // Primero sube la imagen si hay una pendiente
      const finalAvatarUrl = await uploadPendingImage();

      const updates = {
        id,
        email,
        name,
        surname,
        avatar_url: finalAvatarUrl,
        weight,
        height,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);
      if (error) throw error;

      // Actualiza estado con la imagen ya subida
      setAvatarurl(finalAvatarUrl);
      setPendingImageFile(null);
      setLocalImageUri(null);

      // Actualiza el "original" para que ya no detecte cambios
      setOriginalData({
        name,
        surname,
        avatar_url: finalAvatarUrl,
        weight,
        height,
      });

      Alert.alert("Éxito", "Perfil actualizado correctamente");
    } catch (error) {
      console.error("Profile update error:", error);
      if (error instanceof Error) Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  }

  // --- NUEVO: Recibe el archivo local desde Avatar SIN subirlo aún ---
  // Avatar debe llamar a este callback con { file, fileName, mimeType, localUri }
  // en lugar de subir directamente al bucket.
  function handleImageSelected({ file, fileName, mimeType, localUri }) {
    setPendingImageFile({ file, fileName, mimeType });
    setLocalImageUri(localUri); // Para mostrar preview inmediato
  }

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Entypo name={"arrow-left"} size={60} color="#bda7ee" />
        </TouchableOpacity>

        {/* 
          Avatar ahora recibe dos props nuevas:
          - onImageSelected: callback con el archivo local (NO sube al bucket)
          - localImageUri: URI local para mostrar el preview antes de guardar
          
          Elimina la lógica de upload dentro de Avatar y llama a onImageSelected
          en su lugar. Ver instrucciones debajo del componente.
        */}

        <Avatar
          url={localImageUri || avatar_url}
          size={100}
          userId={id}
          onImageSelected={handleImageSelected}
        />

        {/* Indicador visual de cambios sin guardar */}
        {hasUnsavedChanges() && (
          <Text style={styles.unsavedBadge}>● Cambios sin guardar</Text>
        )}

        <Text style={styles.title}>Perfil</Text>

        <View style={[styles.verticalSpacing, styles.mt10]}>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            editable={false}
            value={email}
            placeholder=""
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
        </View>

        <View style={[styles.verticalSpacing, styles.mt10]}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder=""
            autoCapitalize="none"
            keyboardType="text"
            style={styles.input}
          />
        </View>

        <View style={[styles.verticalSpacing, styles.mt10]}>
          <Text style={styles.label}>Apellido</Text>
          <TextInput
            value={surname}
            onChangeText={setSurname}
            placeholder=""
            autoCapitalize="none"
            keyboardType="text"
            style={styles.input}
          />
        </View>

        <View style={[styles.verticalSpacing, styles.mt10]}>
          <Text style={styles.label}>Peso</Text>
          <TextInput
            value={weight}
            onChangeText={setWeight}
            placeholder=""
            autoCapitalize="none"
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <View style={[styles.verticalSpacing, styles.mt10]}>
          <Text style={styles.label}>Estatura</Text>
          <TextInput
            value={height}
            onChangeText={setHeight}
            placeholder=""
            autoCapitalize="none"
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <View style={[styles.verticalSpacing, styles.mt10]}>
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={updateProfile}
            disabled={loading}
          >
            <Text style={styles.title}>
              {loading ? "Guardando..." : "Actualizar"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E0F3A",
    paddingHorizontal: 20,
  },
  body: {
    marginTop: 40,
  },
  // avatar: {
  //   width: 100,
  //   height: 100,
  //   borderRadius: 50,
  // },
  verticalSpacing: {
    paddingTop: 4,
    paddingBottom: 4,
  },
  mt10: {
    marginTop: 10,
  },
  title: {
    color: "white",
    fontSize: 26,
  },
  label: {
    color: "#6c4faa",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#2c1b4d",
    color: "white",
    borderWidth: 1,
    borderColor: "#6c4faa",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  button: {
    marginTop: 15,
    paddingVertical: 12,
    backgroundColor: "#5A2D82",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#5A2D82",
    opacity: 0.6,
  },
    unsavedBadge: {
    color: "#f0a500",
    fontSize: 13,
    marginTop: 6,
    marginBottom: 2,
  },
});

export default Profile;
