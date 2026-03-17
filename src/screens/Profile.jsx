import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { StyleSheet, View, Alert, TouchableOpacity } from "react-native";
import ProfilePic from "../assets/img/profile_pic";

const Profile = ({ id, email }) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [avatarUrl, setAvatarurl] = useState("");
  const [Weight, setWeight] = useState(null);
  const [Height, setHeight] = useState(null);

  /* UNDER CONSTRUCTION... NOT WORKING YET */
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
        setAvatarurl(data.avatarurl);
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

  async function updateProfile({ name, surname, avatarurl, weight, height }) {
    try {
      setLoading(true);

      const updates = {
        id: id,
        name,
        surname,
        avatarurl,
        weight,
        height,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
    } catch {
      Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }
};

export default Profile;
