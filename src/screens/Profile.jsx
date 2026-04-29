import { useState, useEffect } from "react";
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

const Profile = ({ route, navigation }) => {
  const { id, email } = route.params;
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [avatar_url, setAvatarurl] = useState("");
  const [weight, setWeight] = useState(null);
  const [height, setHeight] = useState(null);

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

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setName(data.name);
        setSurname(data.surname);
        setAvatarurl(data.avatar_url);
        setWeight(data.weight);
        setHeight(data.height);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ name, surname, avatar_url, weight, height }) {
    try {
      setLoading(true);
      console.log("Updating profile for user:", id);

      const updates = {
        id: id,
        email: email,  // Add the email field - it's required!
        name,
        surname,
        avatar_url,
        weight,
        height,
        updated_at: new Date(),
      };

      console.log("Profile updates:", updates);

      let { error } = await supabase.from("profiles").upsert(updates);


      if (error) {
        console.log("Update error:", error);
        throw error;
      }

      Alert.alert("Éxito", "Perfil actualizado correctamente");
    } catch (error) {
      console.error("Profile update error:", error);
      if (error instanceof Error) Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Avatar
          url={avatar_url}
          size={100}
          userId={id}
          onUpload={(filePath) => {
            setAvatarurl(filePath);
            updateProfile({
              name,
              surname,
              avatar_url: filePath,
              weight,
              height,
            });
          }}
        />
        <Text style={styles.title}>Perfil</Text>

        <View style={[styles.verticalSpacing, styles.mt20]}>
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

        <View style={[styles.verticalSpacing, styles.mt20]}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            value={name}
            onChangeText={(text) => setName(text)}
            placeholder=""
            autoCapitalize="none"
            keyboardType="text"
            style={styles.input}
          />
        </View>

        <View style={[styles.verticalSpacing, styles.mt20]}>
          <Text style={styles.label}>Apellido</Text>
          <TextInput
            value={surname}
            onChangeText={(text) => setSurname(text)}
            placeholder=""
            autoCapitalize="none"
            keyboardType="text"
            style={styles.input}
          />
        </View>

        <View style={[styles.verticalSpacing, styles.mt20]}>
          <Text style={styles.label}>Peso</Text>
          <TextInput
            value={weight}
            onChangeText={(text) => setWeight(text)}
            placeholder=""
            autoCapitalize="none"
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <View style={[styles.verticalSpacing, styles.mt20]}>
          <Text style={styles.label}>Estatura</Text>
          <TextInput
            value={height}
            onChangeText={(text) => setHeight(text)}
            placeholder=""
            autoCapitalize="none"
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <View style={[styles.verticalSpacing, styles.mt20]}>
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={() =>
              updateProfile({ name, surname, avatar_url, weight, height })
            }
            disabled={loading}
          >
            <Text style={styles.title}>Actualizar</Text>
          </TouchableOpacity>
          <Text style={styles.buttonText}>
            {loading ? "Cargando..." : "Perfil Actualizado"}
          </Text>
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
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  verticalSpacing: {
    paddingTop: 4,
    paddingBottom: 4,
  },
  mt20: {
    marginTop: 20,
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
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: "#5A2D82",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#5A2D82",
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "400",
  },
});

export default Profile;
