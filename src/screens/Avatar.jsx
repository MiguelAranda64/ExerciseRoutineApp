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
import * as FileSystem from "expo-file-system";

export default function Avatar({ url, size = 120, onUpload, userId }) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  /* Every time the `url` prop changes, refresh the signed (or public) URL */
  useEffect(() => {
    if (url) {
      downloadImage(url);
    } else {
      setAvatarUrl(null);
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

  // Upload the image to Supabase Storage
  async function pickImageAndUpload() {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        alert("Permission to access photos is required.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
        base64: true,
      });

      if (result.canceled || !result.assets?.length) return;

      setUploading(true);

      const asset = result.assets[0];
      const base64 = asset.base64; // string representing the image in base64 format

      // Convertir base64 a ArrayBuffer
      const binaryString = atob(base64); // converts string to binary
      const bytes = new Uint8Array(binaryString.length); // converts binary string to byte array
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const fileName = `avatar_${userId}.jpg`;

      const { data, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, bytes.buffer, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      onUpload?.(fileName);
      downloadImage(fileName);
    } catch (error) {
      console.error("Error uploading image:", error?.message ?? error);
      alert(`Error uploading image: ${error?.message ?? "Unknown error"}`);
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
        onPress={pickImageAndUpload}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Upload</Text>
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
