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
          </Stack.Navigator>
        </View>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
