import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

import SplashScreen from "./src/screens/SplashScreen";
import HomeScreen from "./src/screens/HomeScreen";
import CheckoutScreen from "./src/screens/CheckoutScreen";
import AdminScreen from "./src/screens/AdminScreen";
import AdminLoginScreen from "./src/screens/AdminLoginScreen";
import { COLORS } from "./src/constants/colors";
import { initDatabase, seedProducts } from "./src/services/database";

const Stack = createNativeStackNavigator();

export default function App() {
  // Initialiser la base de données au démarrage
  useEffect(() => {
    console.log("🔄 Initialisation de la base de données...");
    initDatabase();
    seedProducts();
    console.log("✅ Base de données prête!");
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: COLORS.white,
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{ title: "Checkout" }}
        />
        <Stack.Screen
          name="AdminLogin"
          component={AdminLoginScreen}
          options={{
            title: "🔐 Admin Login",
            headerStyle: {
              backgroundColor: COLORS.primary,
            },
          }}
        />
        <Stack.Screen
          name="Admin"
          component={AdminScreen}
          options={{
            title: "🗄️ Base de Données SQLite",
            headerStyle: {
              backgroundColor: COLORS.primary,
            },
            headerLeft: () => null, // Désactiver le bouton retour
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
