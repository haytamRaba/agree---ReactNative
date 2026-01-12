import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { COLORS } from "../constants/colors";
import { CATEGORIES } from "../data/productsData";
import { getAllProducts } from "../services/database";

export default function HomeScreen({ navigation, route }) {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les produits depuis la base de données
  useEffect(() => {
    loadProducts();
  }, []);

  // Recharger les produits quand on revient sur l'écran
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadProducts();
    });
    return unsubscribe;
  }, [navigation]);

  // Vider le panier après une commande
  useEffect(() => {
    if (route.params?.clearCart) {
      setCart([]);
      // Réinitialiser le paramètre
      navigation.setParams({ clearCart: false });
    }
  }, [route.params?.clearCart]);

  const loadProducts = () => {
    try {
      const dbProducts = getAllProducts();
      setProducts(dbProducts);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);
      setLoading(false);
    }
  };

  const popularProducts = products.filter((product) => product.id <= 4);

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const increaseQuantity = (productId) => {
    setCart(
      cart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    const item = cart.find((item) => item.id === productId);
    if (item.quantity === 1) {
      removeFromCart(productId);
    } else {
      setCart(
        cart.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  // Calculer la quantité totale d'articles dans le panier
  const getTotalQuantity = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const renderProductCard = ({ item }) => (
    <View style={styles.productCard}>
      <Text style={styles.productImage}>{item.image}</Text>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productDescription}>{item.description}</Text>
      <View style={styles.productFooter}>
        <Text style={styles.productPrice}>DH{item.price}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addToCart(item)}
        >
          <Text style={styles.addButtonText}>Add +</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCategoryCard = ({ item }) => (
    <TouchableOpacity style={styles.categoryCard}>
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerGreeting}>Hello! 👋</Text>
          <Text style={styles.headerTitle}>What would you like to eat?</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.adminButton}
            onPress={() => navigation.navigate("AdminLogin")}
          >
            <Text style={styles.adminIcon}>⚙️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigation.navigate("Checkout", { cart })}
          >
            <Text style={styles.cartIcon}>🛒</Text>
            {cart.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{getTotalQuantity()}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Panier flottant */}
      {cart.length > 0 && (
        <View style={styles.cartPreview}>
          <Text style={styles.cartPreviewTitle}>
            🛒 Votre Panier ({getTotalQuantity()} articles)
          </Text>
          <ScrollView
            style={styles.cartItems}
            showsVerticalScrollIndicator={false}
          >
            {cart.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <Text style={styles.cartItemEmoji}>{item.image}</Text>
                <View style={styles.cartItemInfo}>
                  <Text style={styles.cartItemName}>{item.name}</Text>
                  <Text style={styles.cartItemPrice}>DH{item.price}</Text>
                </View>
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => decreaseQuantity(item.id)}
                  >
                    <Text style={styles.quantityButtonText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => increaseQuantity(item.id)}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => removeFromCart(item.id)}
                >
                  <Text style={styles.deleteButtonText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => navigation.navigate("Checkout", { cart })}
          >
            <Text style={styles.checkoutButtonText}>
              Commander - DH
              {cart
                .reduce((sum, item) => sum + item.price * item.quantity, 0)
                .toFixed(2)}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.contentWrapper}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Chargement des produits...</Text>
            </View>
          ) : (
            <>
              {/* Popular Products Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Popular Dishes</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.productList}
                >
                  {popularProducts.map((item) => renderProductCard({ item }))}
                </ScrollView>
              </View>

              {/* Categories Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Categories</Text>
                <View style={styles.categoriesGrid}>
                  {CATEGORIES.map((item) => renderCategoryCard({ item }))}
                </View>
              </View>

              {/* All Products Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>All Products</Text>
                {products.map((product) => (
                  <View key={product.id} style={styles.listProductCard}>
                    <Text style={styles.listProductImage}>{product.image}</Text>
                    <View style={styles.listProductInfo}>
                      <Text style={styles.listProductName}>{product.name}</Text>
                      <Text style={styles.listProductDescription}>
                        {product.description}
                      </Text>
                      <Text style={styles.listProductPrice}>
                        DH{product.price}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.listAddButton}
                      onPress={() => addToCart(product)}
                    >
                      <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </>
          )}
        </ScrollView>
      </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerGreeting: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginTop: 5,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 15,
  },
  adminButton: {
    padding: 5,
  },
  adminIcon: {
    fontSize: 28,
  },
  cartButton: {
    position: "relative",
  },
  cartIcon: {
    fontSize: 32,
  },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginLeft: 20,
    marginBottom: 15,
  },
  productList: {
    paddingLeft: 20,
  },
  productCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    width: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    fontSize: 60,
    textAlign: "center",
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 10,
    height: 35,
  },
  productFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 14,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    gap: 15,
  },
  categoryRow: {
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  categoryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    width: "30%",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  listProductCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listProductImage: {
    fontSize: 50,
    marginRight: 15,
  },
  listProductInfo: {
    flex: 1,
  },
  listProductName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  listProductDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  listProductPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  listAddButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  contentWrapper: {
    flex: 1,
  },
  cartPreview: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    maxHeight: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 1000,
  },
  cartPreviewTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  cartItems: {
    maxHeight: 150,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  cartItemEmoji: {
    fontSize: 30,
    marginRight: 10,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  cartItemPrice: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 3,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginHorizontal: 12,
  },
  deleteButton: {
    marginLeft: 8,
    padding: 5,
  },
  deleteButtonText: {
    fontSize: 20,
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
