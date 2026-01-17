import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

import { CartProvider } from "./src/context/CartContext";
import { UserProvider } from "./src/context/UserContext";
import { ToastProvider } from "./src/context/ToastContext";

import SplashScreen from "./src/screens/SplashScreen";
import HomeScreen from "./src/screens/HomeScreen";
import CheckoutScreen from "./src/screens/CheckoutScreen";
import OrdersScreen from "./src/screens/OrdersScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import AdminScreen from "./src/screens/AdminScreen";
import AdminLoginScreen from "./src/screens/AdminLoginScreen";
import { COLORS } from "./src/constants/colors";
import {
  initDatabase,
  seedProducts,
  seedTestOrders,
} from "./src/services/database";

const Stack = createNativeStackNavigator();

function RootNavigator() {
  return (
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
        options={{ title: "🛒 Commander" }}
      />
      <Stack.Screen
        name="Orders"
        component={OrdersScreen}
        options={{ title: "📦 Mes Commandes" }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "👤 Mon Profil" }}
      />
      <Stack.Screen
        name="AdminLogin"
        component={AdminLoginScreen}
        options={{
          title: "🔐 Connexion Admin",
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
        }}
      />
      <Stack.Screen
        name="Admin"
        component={AdminScreen}
        options={{
          title: "🗄️ Gestion Base de Données",
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerLeft: () => null,
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    console.log("🔄 Initialisation de la base de données...");
    initDatabase();
    seedProducts();
    seedTestOrders();
    console.log("✅ Base de données prête!");
  }, []);

  return (
    <CartProvider>
      <UserProvider>
        <ToastProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <RootNavigator />
          </NavigationContainer>
        </ToastProvider>
      </UserProvider>
    </CartProvider>
  );
}
