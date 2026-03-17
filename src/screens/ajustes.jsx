import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const Ajustes = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#1E0F3A" }}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Ajustes</Text>
        </View>
      </View>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.subtitle}>Cuenta</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Notificaciones</Text>
          </TouchableOpacity>
          <View style={styles.line}></View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Privacidad</Text>
          </TouchableOpacity>
          <View style={styles.line}></View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Idioma</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.container}>
          <Text style={styles.subtitle}>General</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Color de interfaz</Text>
          </TouchableOpacity>
          <View style={styles.line}></View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Objetivo diario</Text>
          </TouchableOpacity>
          <View style={styles.line}></View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Preferencias</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.container}>
          <Text style={styles.subtitle}>Soporte</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Preguntas frecuentes</Text>
          </TouchableOpacity>
          <View style={styles.line}></View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Contáctanos</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 15, paddingHorizontal: 20 }}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    backgroundColor: "#1E0F3A",
    padding: 20,
  },

  container: {
    backgroundColor: "#1E0F3A",
    paddingHorizontal: 20,
    marginTop: 10,
  },

  headerTitle: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#A47BFF",
    fontWeight: "bold",
    fontFamily: "inter",
    marginBottom: 10,
  },

  button: {
    backgroundColor: "#341578",
    width: "100%",
    minHeight: 45,
    borderRadius: 6,
    alignSelf: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },

  buttonText: {
    color: "#D3BFFF",
    fontWeight: "bold",
    fontFamily: "inter",
    textAlign: "center",
    fontSize: 16,
  },

  line: {
    flex: 1,
    height: 0.5,
    backgroundColor: "#8249FF",
  },

  versionText: {
    color: "#A47BFF",
    fontFamily: "inter",
    textAlign: "right",
    fontSize: 14,
  },
});

export default Ajustes;
