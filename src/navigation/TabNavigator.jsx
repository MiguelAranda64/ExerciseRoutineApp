import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// importar pantallas

import Main from '../screens/Main';
import Logros from '../screens/Logros'
import Ajustes from '../screens/ajustes'

const Tab = createBottomTabNavigator();


export default function TabNavigator(){
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: "#1E0F3A",
                        borderTopWidth: 0,
                    },
                    tabBarActiveTintColor: "#7B3FE4",
                    tabBarInactiveTintColor: "gray"
                }}
            >
                <Tab.Screen 
                    name="Principal" 
                    component = {Main}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="home" size={size} color={color} />
                        ),
                    }}
                />

                <Tab.Screen 
                    name="Logros" 
                    component = {Logros} 
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="trophy" size={size} color={color} />
                        ),
                    }}
                />
                
                <Tab.Screen name="Ajustes" 
                    component = {Ajustes} 
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="person" size={size} color={color} />
                        )
                    }}
                    />
                
            </Tab.Navigator>
        </NavigationContainer>
    );
}