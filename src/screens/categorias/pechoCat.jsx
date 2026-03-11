import { View, Text, Image, StyleSheet } from "react-native";
import pechoPrincipiante from "../../assets/img/ejerciciosCat/pechoPrincipiante.png";
import pechoIntermedio from "../../assets/img/ejerciciosCat/pechoIntermedio.png";
import pechoAvanzado from "../../assets/img/ejerciciosCat/pechoAvanzado.png";

const PechoCat = () => {
  return (
    <View style={styles.container}>
      <View style={styles.exercisesCard}>
        <View>
          <Image style={styles.exerciseImg} source={pechoPrincipiante} />
        </View>

        <View>
          <Text style={styles.mainTitle}>Pecho Principiante</Text>
          <Text style={styles.info}>11 ejercicios | 17 minutos</Text>
          <Text style={styles.stars}>★★</Text>
        </View>
      </View>
      <View style={styles.line}></View>

      <View style={styles.exercisesCard}>
        <View>
          <Image style={styles.exerciseImg} source={pechoIntermedio} />
        </View>
        <View>
          <Text style={styles.mainTitle}>Pecho Intermedio</Text>
          <Text style={styles.info}>13 ejercicios | 25 minutos</Text>
          <Text style={styles.stars}>★★★</Text>
        </View>
      </View>
      <View style={styles.line}></View>

      <View style={styles.exercisesCard}>
        <View>
          <Image style={styles.exerciseImg} source={pechoAvanzado} />
        </View>

        <View>
          <Text style={styles.mainTitle}>Pecho Avanzando</Text>
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

export default PechoCat;
