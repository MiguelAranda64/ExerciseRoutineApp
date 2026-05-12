import { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../db_connection/supabase";

export default function Avatar({
  url,
  size = 120,
  userId,
  onImageSelected, // NUEVO: recibe { file, fileName, mimeType, localUri }
  // onUpload ya no se usa — la subida ocurre en Profile al presionar Actualizar
}) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Si `url` empieza con "file://" o "content://" es un URI local (preview),
  // lo mostramos directo sin pasar por Supabase Storage.
  useEffect(() => {
    if (!url) {
      setAvatarUrl(null);
    } else if (url.startsWith("file://") || url.startsWith("content://")) {
      // Preview local — mostrar directamente sin firmar URL
      setAvatarUrl(url);
    } else {
      // Path del bucket — obtener URL firmada
      downloadImage(url);
    }
  }, [url]);

  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .createSignedUrl(path, 60);
      if (error) throw error;
      setAvatarUrl(data.signedUrl);
    } catch (error) {
      console.log("Error downloading image: ", error?.message ?? error);
    }
  }

  // Selecciona la imagen y prepara el archivo — NO sube al bucket
  async function pickImage() {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        alert("Se requiere permiso para acceder a las fotos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
        base64: true,
      });

      if (result.canceled || !result.assets?.length) return;

      setUploading(true); // Reutilizamos el estado para mostrar el indicador mientras se procesa

      const asset = result.assets[0];
      const localUri = asset.uri;

      // Convertir base64 a ArrayBuffer para tenerlo listo al momento de subir
      const base64 = asset.base64;
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const fileName = `avatar_${userId}.jpg`;

      // Notifica a Profile con el archivo preparado y el URI local para el preview
      // La subida real ocurre en Profile.jsx > updateProfile()
      onImageSelected?.({
        file: bytes.buffer,      // ArrayBuffer listo para supabase.storage.upload()
        fileName,
        mimeType: "image/jpeg",
        localUri,                // URI local para mostrar el preview inmediato
      });
    } catch (error) {
      console.error("Error procesando imagen:", error?.message ?? error);
      alert(`Error al seleccionar imagen: ${error?.message ?? "Error desconocido"}`);
    } finally {
      setUploading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={
          avatarUrl
            ? { uri: avatarUrl }
            : require("../assets/img/profile_pic/blank-avatar.png")
        }
        style={[
          styles.image,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      />

      <TouchableOpacity
        style={[styles.button, { width: size }]}
        onPress={pickImage}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Cambiar foto</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#1E0F3A",
  },
  image: {
    backgroundColor: "#ddd",
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
    backgroundColor: "#5A2D82",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});