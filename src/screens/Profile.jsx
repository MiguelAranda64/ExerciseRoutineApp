import { useState, useEffect } from "react";
import { supabase } from "../db_connection/supabase";
import { StyleSheet, View, Alert, TextInput, Text, TouchableOpacity } from "react-native";
import Avatar from "./Avatar";

const Profile = ({ route, navigation}) => {
  const { id, email } = route.params;
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [avatar_url, setAvatarurl] = useState("");
  const [weight, setWeight] = useState(null);
  const [height, setHeight] = useState(null);

  useEffect(() => {
    if (id) getProfile();
  }, [id]);

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

      const updates = {
        id: id,
        name,
        surname,
        avatar_url,
        weight,
        height,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Avatar
        url={avatar_url}
        size={100}
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
          placeholder=""
          autoCapitalize="none"
          keyboardType="numeric"
          style={styles.input}
        />
      </View>

      <View style={[styles.verticalSpacing, styles.mt20]}>
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={() => updateProfile()}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Cargando..." : "Perfil Actualizado"}
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
    paddingHorizontal: 20,
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
});

export default Profile;
