import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import TabNavigator from './src/navigation/TabNavigator'
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { supabase } from "./src/db_connection/supabase";

export default function App() {

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    const { data, error} = await supabase
      .from('achievements')
      .select('*')
    
      if(error) {
        console.log('Error', error)
      } else {
        console.log('Conexion exitosa', data)
      }
  }
  
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light"/>
        <TabNavigator />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})