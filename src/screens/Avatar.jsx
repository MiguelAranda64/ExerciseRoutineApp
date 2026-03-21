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

export default function Avatar({ url, size = 120, onUpload }) {
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

  async function pickImageAndUpload() {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        alert("Permission to access photos is required to upload an avatar.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.length) return;

      setUploading(true);

      const asset = result.assets[0];
      const uri = asset.uri;
      const response = await fetch(uri);
      const blob = await response.blob();

      const fileExt = uri.split(".").pop().split("?")[0];
      const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, blob, { upsert: true });
      if (uploadError) throw uploadError;

      onUpload?.(filePath);
      downloadImage(filePath);
    } catch (error) {
      console.log("Error uploading image: ", error?.message ?? error);
      alert(error?.message ?? "Unable to upload image");
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
    backgroundColor: "#1E0F3A"
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
