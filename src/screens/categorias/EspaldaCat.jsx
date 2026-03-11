import { View, Text, Image, StyleSheet } from "react-native";
import espaldaPrincipiante from "../../assets/img/ejerciciosCat/espaldaPrincipiante.png";
import espaldaIntermedio from "../../assets/img/ejerciciosCat/espaldaIntermedio.png";
import espaldaAvanzado from "../../assets/img/ejerciciosCat/espaldaAvanzado.jpg";

const EspaldaCat = () => {
  return (
    <View style={styles.container}>
      <View style={styles.exercisesCard}>
        <View>
          <Image style={styles.exerciseImg} source={espaldaPrincipiante} />
        </View>

        <View>
          <Text style={styles.mainTitle}>Espalda Principiante</Text>
          <Text style={styles.info}>11 ejercicios | 17 minutos</Text>
          <Text style={styles.stars}>★★</Text>
        </View>
      </View>
      <View style={styles.line}></View>

      <View style={styles.exercisesCard}>
        <View>
          <Image style={styles.exerciseImg} source={espaldaIntermedio} />
        </View>
        <View>
          <Text style={styles.mainTitle}>Espalda Intermedio</Text>
          <Text style={styles.info}>13 ejercicios | 25 minutos</Text>
          <Text style={styles.stars}>★★★</Text>
        </View>
      </View>
      <View style={styles.line}></View>

      <View style={styles.exercisesCard}>
        <View>
          <Image style={styles.exerciseImg} source={espaldaAvanzado} />
        </View>

        <View>
          <Text style={styles.mainTitle}>Espalda Avanzando</Text>
          <Text style={styles.info}>15 ejercicios | 40 minutos</Text>
          <Text style={styles.stars}>★★★★</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },

  exercisesCard: {
    flexDirection: "row",
    padding: 10,
  },

  exercises: {},

  exerciseImg: {
    height: 70,
    width: 85,
    borderRadius: 3,
    marginRight: 12,
  },

  mainTitle: {
    color: "white",
    fontWeight: "bold",
  },

  info: {
    color: "white",
  },

  stars: {
    color: "white",
  },

  line: {
    flex: 1,
    height: 0.5,
    backgroundColor: "#422774",
  },
});

export default EspaldaCat;
