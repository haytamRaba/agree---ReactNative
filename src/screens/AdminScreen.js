import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  TextInput,
  Modal,
  Linking,
} from "react-native";
import { COLORS } from "../constants/colors";
import {
  getAllProducts,
  getAllOrders,
  getStats,
  getOrderDetails,
  addProduct,
  updateOrderStatus,
} from "../services/database";

// Catégories disponibles
const CATEGORIES = [
  { name: "Salads", icon: "🥗" },
  { name: "Drinks", icon: "🥤" },
  { name: "Breakfast", icon: "🥑" },
  { name: "Bowls", icon: "🥙" },
  { name: "Desserts", icon: "🍇" },
  { name: "Mains", icon: "🍔" },
];

export default function AdminScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("stats");
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Modal pour ajouter un produit
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductImage, setNewProductImage] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("Salads");
  const [newProductDescription, setNewProductDescription] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Voulez-vous vraiment vous déconnecter?", [
      {
        text: "Annuler",
        style: "cancel",
      },
      {
        text: "Déconnexion",
        onPress: () => navigation.navigate("Home"),
        style: "destructive",
      },
    ]);
  };

  const loadData = () => {
    try {
      const dbStats = getStats();
      const dbProducts = getAllProducts();
      const dbOrders = getAllOrders();

      setStats(dbStats);
      setProducts(dbProducts);
      setOrders(dbOrders);
      setRefreshing(false);
    } catch (error) {
      console.error("Erreur chargement données:", error);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Passer un appel téléphonique
  const handleCall = (phoneNumber) => {
    const url = `tel:${phoneNumber}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert(
            "Erreur",
            "Impossible de passer un appel sur cet appareil"
          );
        }
      })
      .catch((err) => Alert.alert("Erreur", "Une erreur est survenue"));
  };

  // Changer le statut d'une commande
  const handleChangeStatus = (orderId, currentStatus) => {
    const statusOptions = [
      { label: "En attente", value: "pending" },
      { label: "Complétée", value: "completed" },
      { label: "Annulée", value: "cancelled" },
    ];

    const buttons = statusOptions
      .filter((option) => option.value !== currentStatus)
      .map((option) => ({
        text: option.label,
        onPress: () => {
          const success = updateOrderStatus(orderId, option.value);
          if (success) {
            Alert.alert("Succès", "Statut de la commande mis à jour");
            loadData();
          } else {
            Alert.alert("Erreur", "Impossible de mettre à jour le statut");
          }
        },
      }));

    buttons.push({ text: "Annuler", style: "cancel" });

    Alert.alert(
      "Changer le statut",
      "Sélectionnez le nouveau statut:",
      buttons
    );
  };

  // Ajouter un produit
  const handleAddProduct = () => {
    if (
      !newProductName ||
      !newProductPrice ||
      !newProductImage ||
      !newProductCategory
    ) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires");
      return;
    }

    const price = parseFloat(newProductPrice);
    if (isNaN(price) || price <= 0) {
      Alert.alert("Erreur", "Le prix doit être un nombre positif");
      return;
    }

    const productId = addProduct(
      newProductName,
      price,
      newProductImage,
      newProductCategory,
      newProductDescription
    );

    if (productId) {
      Alert.alert("Succès", "Produit ajouté avec succès!");
      setShowAddProduct(false);
      // Réinitialiser les champs
      setNewProductName("");
      setNewProductPrice("");
      setNewProductImage("");
      setNewProductCategory("Salads");
      setNewProductDescription("");
      loadData();
    } else {
      Alert.alert("Erreur", "Impossible d'ajouter le produit");
    }
  };

  const renderStats = () => (
    <View style={styles.tabContent}>
      <Text style={styles.title}>📊 Statistiques de la Base de Données</Text>

      <View style={styles.statCard}>
        <Text style={styles.statIcon}>📦</Text>
        <Text style={styles.statValue}>{stats?.totalOrders || 0}</Text>
        <Text style={styles.statLabel}>Commandes Totales</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statIcon}>✅</Text>
        <Text style={styles.statValue}>{stats?.completedOrders || 0}</Text>
        <Text style={styles.statLabel}>Commandes Complétées</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statIcon}>💰</Text>
        <Text style={styles.statValue}>
          DH {stats?.totalRevenue?.toFixed(2) || "0.00"}
        </Text>
        <Text style={styles.statLabel}>Bénéfice (Commandes Complétées)</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statIcon}>👥</Text>
        <Text style={styles.statValue}>{stats?.totalCustomers || 0}</Text>
        <Text style={styles.statLabel}>Clients Enregistrés</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statIcon}>⏳</Text>
        <Text style={styles.statValue}>{stats?.pendingOrders || 0}</Text>
        <Text style={styles.statLabel}>Commandes En Attente</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statIcon}>🥗</Text>
        <Text style={styles.statValue}>{products.length}</Text>
        <Text style={styles.statLabel}>Produits dans le Catalogue</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>ℹ️ Informations</Text>
        <Text style={styles.infoText}>• Base de données: SQLite</Text>
        <Text style={styles.infoText}>• Fichier: agree.db</Text>
        <Text style={styles.infoText}>
          • Tables: products, customers, orders, order_items
        </Text>
        <Text style={styles.infoText}>
          • Le revenu ne compte que les commandes complétées
        </Text>
        <Text style={styles.infoText}>• Stockage: Local sur l'appareil</Text>
      </View>
    </View>
  );

  const renderProducts = () => (
    <View style={styles.tabContent}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>🥗 Produits en Base de Données</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddProduct(true)}
        >
          <Text style={styles.addButtonText}>+ Ajouter</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>
        Table: products ({products.length} entrées)
      </Text>

      {products.map((product) => (
        <View key={product.id} style={styles.dataCard}>
          <View style={styles.dataHeader}>
            <Text style={styles.dataId}>ID: {product.id}</Text>
            <Text style={styles.productIcon}>{product.image}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Nom:</Text>
            <Text style={styles.dataValue}>{product.name}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Prix:</Text>
            <Text style={styles.dataValue}>DH {product.price}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Catégorie:</Text>
            <Text style={styles.dataValue}>{product.category}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Stock:</Text>
            <Text style={styles.dataValue}>{product.stock}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Description:</Text>
            <Text style={styles.dataValue}>{product.description}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderOrders = () => (
    <View style={styles.tabContent}>
      <Text style={styles.title}>📦 Commandes en Base de Données</Text>
      <Text style={styles.subtitle}>
        Table: orders ({orders.length} entrées)
      </Text>

      {orders.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>Aucune commande pour le moment</Text>
          <Text style={styles.emptySubtext}>
            Passez une commande pour la voir ici
          </Text>
        </View>
      ) : (
        orders.map((order) => {
          const details = getOrderDetails(order.id);
          return (
            <View key={order.id} style={styles.dataCard}>
              <View style={styles.dataHeader}>
                <Text style={styles.dataId}>Commande #{order.id}</Text>
                <TouchableOpacity
                  onPress={() => handleChangeStatus(order.id, order.status)}
                >
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          order.status === "pending"
                            ? "#FFA50020"
                            : order.status === "completed"
                            ? "#4CAF5020"
                            : "#FF000020",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color:
                            order.status === "pending"
                              ? "#FFA500"
                              : order.status === "completed"
                              ? "#4CAF50"
                              : "#FF0000",
                        },
                      ]}
                    >
                      {order.status === "pending"
                        ? "En attente"
                        : order.status === "completed"
                        ? "Complétée"
                        : "Annulée"}{" "}
                      📝
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Client:</Text>
                <Text style={styles.dataValue}>
                  {order.first_name} {order.last_name}
                </Text>
              </View>

              <TouchableOpacity onPress={() => handleCall(order.phone)}>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Téléphone:</Text>
                  <Text style={[styles.dataValue, styles.phoneLink]}>
                    📞 {order.phone}
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Adresse:</Text>
                <Text style={styles.dataValue}>{order.address}</Text>
              </View>

              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Montant:</Text>
                <Text style={styles.dataValueBold}>
                  DH {order.total_amount.toFixed(2)}
                </Text>
              </View>

              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Date:</Text>
                <Text style={styles.dataValue}>
                  {new Date(order.created_at).toLocaleString("fr-FR")}
                </Text>
              </View>

              {details?.items && details.items.length > 0 && (
                <View style={styles.itemsSection}>
                  <Text style={styles.itemsTitle}>
                    Articles (table: order_items):
                  </Text>
                  {details.items.map((item, index) => (
                    <View key={index} style={styles.orderItem}>
                      <Text style={styles.orderItemIcon}>{item.image}</Text>
                      <View style={styles.orderItemInfo}>
                        <Text style={styles.orderItemName}>{item.name}</Text>
                        <Text style={styles.orderItemDetails}>
                          {item.quantity}x DH{item.price} = DH
                          {(item.quantity * item.price).toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header avec bouton déconnexion */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Administration</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>🚪 Déconnexion</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "stats" && styles.tabActive]}
          onPress={() => setActiveTab("stats")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "stats" && styles.tabTextActive,
            ]}
          >
            📊 Stats
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "products" && styles.tabActive]}
          onPress={() => setActiveTab("products")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "products" && styles.tabTextActive,
            ]}
          >
            🥗 Produits
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "orders" && styles.tabActive]}
          onPress={() => setActiveTab("orders")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "orders" && styles.tabTextActive,
            ]}
          >
            📦 Commandes
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === "stats" && renderStats()}
        {activeTab === "products" && renderProducts()}
        {activeTab === "orders" && renderOrders()}
      </ScrollView>

      {/* Modal pour ajouter un produit */}
      <Modal
        visible={showAddProduct}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddProduct(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter un produit</Text>

            <TextInput
              style={styles.input}
              placeholder="Nom du produit"
              value={newProductName}
              onChangeText={setNewProductName}
            />

            <TextInput
              style={styles.input}
              placeholder="Prix (DH)"
              keyboardType="numeric"
              value={newProductPrice}
              onChangeText={setNewProductPrice}
            />

            <TextInput
              style={styles.input}
              placeholder="Emoji (ex: 🥗)"
              value={newProductImage}
              onChangeText={setNewProductImage}
            />

            <Text style={styles.inputLabel}>Catégorie:</Text>
            <View style={styles.categoriesContainer}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.name}
                  style={[
                    styles.categoryChip,
                    newProductCategory === cat.name &&
                      styles.categoryChipActive,
                  ]}
                  onPress={() => setNewProductCategory(cat.name)}
                >
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  <Text
                    style={[
                      styles.categoryText,
                      newProductCategory === cat.name &&
                        styles.categoryTextActive,
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              multiline
              numberOfLines={4}
              value={newProductDescription}
              onChangeText={setNewProductDescription}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddProduct(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleAddProduct}
              >
                <Text style={styles.submitButtonText}>Ajouter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  logoutButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  infoBox: {
    backgroundColor: "#E8F5E9",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  dataCard: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dataHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  dataId: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  productIcon: {
    fontSize: 30,
  },
  dataRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  dataLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
    width: 100,
  },
  dataValue: {
    fontSize: 14,
    color: COLORS.textPrimary,
    flex: 1,
  },
  dataValueBold: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  phoneLink: {
    color: COLORS.primary,
    textDecorationLine: "underline",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: COLORS.lightGray,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButtonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 10,
    marginTop: 5,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
    gap: 8,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
  },
  categoryChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + "15",
  },
  categoryIcon: {
    fontSize: 18,
    marginRight: 5,
  },
  categoryText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  categoryTextActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  itemsSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  itemsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: COLORS.background,
    padding: 10,
    borderRadius: 8,
  },
  orderItemIcon: {
    fontSize: 30,
    marginRight: 10,
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  orderItemDetails: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});
