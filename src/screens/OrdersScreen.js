import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { COLORS } from "../constants/colors";
import { useUser } from "../context/UserContext";
import {
  getOrdersByPhone,
  getOrderDetails,
  updateOrderStatus,
} from "../services/database";

export default function OrdersScreen({ navigation }) {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [user]),
  );

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      if (user && user.phone) {
        const userOrders = getOrdersByPhone(user.phone);
        setOrders(userOrders || []);
      }
    } catch (error) {
      console.error("Erreur chargement commandes:", error);
      Alert.alert("Erreur", "Impossible de charger les commandes");
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#FF9800";
      case "confirmed":
        return "#2196F3";
      case "in-delivery":
        return "#9C27B0";
      case "delivered":
        return "#4CAF50";
      case "cancelled":
        return "#F44336";
      default:
        return COLORS.textSecondary;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: "⏳ En Attente",
      confirmed: "✓ Confirmée",
      "in-delivery": "🚚 En Livraison",
      delivered: "✓ Livrée",
      cancelled: "✕ Annulée",
    };
    return labels[status] || status;
  };

  const handleStatusUpdate = (orderId, currentStatus) => {
    const nextStatuses = {
      pending: "confirmed",
      confirmed: "in-delivery",
      "in-delivery": "delivered",
      delivered: "delivered",
      cancelled: "cancelled",
    };

    const newStatus = nextStatuses[currentStatus];
    if (newStatus === currentStatus) {
      Alert.alert("Info", "Cette commande est finalisée");
      return;
    }

    Alert.alert(
      "Confirmation",
      `Mettre à jour le statut à "${getStatusLabel(newStatus)}" ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Confirmer",
          onPress: () => {
            updateOrderStatus(orderId, newStatus);
            loadOrders();
            Alert.alert("Succès", "Statut mis à jour");
          },
        },
      ],
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyText}>
            Veuillez vous connecter pour voir vos commandes
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.loginButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📋 Mes Commandes</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Chargement des commandes...</Text>
          </View>
        ) : orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>Aucune commande</Text>
          </View>
        ) : (
          orders.map((order) => {
            const details = getOrderDetails(order.id);

            return (
              <TouchableOpacity
                key={order.id}
                style={styles.orderCard}
                onPress={() =>
                  setSelectedOrder(
                    selectedOrder?.id === order.id ? null : order,
                  )
                }
              >
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>Commande #{order.id}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(order.status) },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {getStatusLabel(order.status)}
                    </Text>
                  </View>
                </View>

                <Text style={styles.orderDate}>
                  📅{" "}
                  {new Date(order.created_at).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
                <Text style={styles.orderTotal}>
                  💰 Total: DH{" "}
                  {order.total_amount ? order.total_amount.toFixed(2) : "0.00"}
                </Text>

                {selectedOrder?.id === order.id && details?.items && (
                  <View style={styles.orderDetails}>
                    <Text style={styles.detailsTitle}>
                      📦 Articles commandés ({details.items.length}):
                    </Text>
                    {details.items.map((item, index) => (
                      <View key={index} style={styles.itemRow}>
                        <Text style={styles.itemIcon}>{item.image}</Text>
                        <View style={styles.itemInfo}>
                          <Text style={styles.itemName}>{item.name}</Text>
                          <Text style={styles.itemDetails}>
                            {item.quantity}x DH{item.price.toFixed(2)} = DH
                            {(item.quantity * item.price).toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 20,
    textAlign: "center",
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
  },
  loginButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  shopButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
  },
  shopButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    marginTop: 8,
  },
  detailsText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  ordersContainer: {
    padding: 15,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  orderDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  orderAmount: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  amountLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  amountValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  orderDetails: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray + "30",
  },
  itemIcon: {
    fontSize: 28,
    marginRight: 12,
    width: 40,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  detailText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  updateButton: {
    marginTop: 10,
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  updateButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },
});
