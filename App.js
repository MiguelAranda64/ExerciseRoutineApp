import { View } from "react-native";
import TabNavigator from "./src/navigation/TabNavigator";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./src/screens/Login";
import Main from "./src/screens/Main";
import Profile from "./src/screens/Profile";
import Avatar from "./src/screens/Avatar";
import Notificaciones from "./src/screens/Notificaciones";
import Privacidad from "./src/screens/Privacidad";
import Idioma from "./src/screens/Idioma";
import ColorInterfaz from "./src/screens/ColorInterfaz";
import ObjetivoDiario from "./src/screens/ObjetivoDiario";
import Preferencias from "./src/screens/Preferencias";
import FAQ from "./src/screens/FAQ";
import Contacto from "./src/screens/Contacto";
import "./src/i18n/i18n";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <View style={{ flex: 1, backgroundColor: "#1E0F3A" }}>
          <StatusBar style="light" />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={TabNavigator} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Main" component={Main} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Avatar" component={Avatar} />
            {/* Screens for settings and preferences */}
            <Stack.Screen name="Notificaciones" component={Notificaciones} />
            <Stack.Screen name="Privacidad" component={Privacidad} />
            <Stack.Screen name="Idioma" component={Idioma} />
            <Stack.Screen name="ColorInterfaz" component={ColorInterfaz} />
            <Stack.Screen name="ObjetivoDiario" component={ObjetivoDiario} />
            <Stack.Screen name="Preferencias" component={Preferencias} />
            <Stack.Screen name="FAQ" component={FAQ} />
            <Stack.Screen name="Contacto" component={Contacto} />
          </Stack.Navigator>
        </View>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
