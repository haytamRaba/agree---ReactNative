import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  TextInput,
  Dimensions,
} from "react-native";
import { COLORS } from "../constants/colors";
import { CATEGORIES } from "../data/productsData";
import { getAllProducts } from "../services/database";
import { useCart } from "../context/CartContext";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.38;
const PRIMARY_LIGHT = COLORS.primary + "15";

const ProductCard = memo(({ item, onAddToCart }) => (
  <View style={styles.productCard}>
    <Text style={styles.productImage}>{item.image}</Text>
    <Text style={styles.productName}>{item.name}</Text>
    <Text style={styles.productDescription} numberOfLines={2}>
      {item.description}
    </Text>
    <View style={styles.productFooter}>
      <Text style={styles.productPrice}>DH{item.price.toFixed(2)}</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => onAddToCart(item)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  </View>
));

const CategoryCard = memo(({ item, isActive, onPress }) => (
  <TouchableOpacity
    style={[styles.categoryCard, isActive && styles.categoryCardActive]}
    onPress={onPress}
  >
    <Text style={styles.categoryIcon}>{item.icon}</Text>
    <Text style={[styles.categoryName, isActive && styles.categoryNameActive]}>
      {item.name}
    </Text>
  </TouchableOpacity>
));

export default function HomeScreen({ navigation, route }) {
  const { cart, addToCart, getTotalQuantity } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Charger les produits au montage
  useEffect(() => {
    loadProducts();
  }, []);

  // Recharger quand on revient à l'écran
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadProducts();
    });
    return unsubscribe;
  }, [navigation]);

  // Vider le panier après commande
  useEffect(() => {
    if (route.params?.clearCart) {
      navigation.setParams({ clearCart: false });
    }
  }, [route.params?.clearCart]);

  const loadProducts = useCallback(() => {
    try {
      const dbProducts = getAllProducts();
      setProducts(dbProducts);
      setFilteredProducts(dbProducts);
      setLoading(false);
    } catch (error) {
      console.error("Erreur chargement produits:", error);
      setLoading(false);
    }
  }, []);

  // Filtrer et rechercher les produits
  useEffect(() => {
    let results = products;

    // Filtrer par catégorie
    if (selectedCategory) {
      results = results.filter(
        (p) => p.category.toLowerCase() === selectedCategory.name.toLowerCase(),
      );
    }

    // Filtrer par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query),
      );
    }

    setFilteredProducts(results);
  }, [searchQuery, selectedCategory, products]);

  const popularProducts = useMemo(
    () => products.filter((p) => p.id <= 4),
    [products],
  );

  const handleCategoryPress = useCallback(
    (category) => {
      setSelectedCategory(
        selectedCategory?.id === category.id ? null : category,
      );
    },
    [selectedCategory],
  );

  const handleAddToCart = useCallback(
    (product) => {
      addToCart(product);
    },
    [addToCart],
  );

  const handleSearchChange = useCallback((text) => {
    setSearchQuery(text);
  }, []);

  const renderProductCard = useCallback(
    ({ item }) => <ProductCard item={item} onAddToCart={handleAddToCart} />,
    [handleAddToCart],
  );

  const renderCategoryCard = useCallback(
    ({ item }) => (
      <CategoryCard
        item={item}
        isActive={selectedCategory?.id === item.id}
        onPress={() => handleCategoryPress(item)}
      />
    ),
    [selectedCategory, handleCategoryPress],
  );

  const totalQuantity = getTotalQuantity();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerGreeting}>Bonjour! 👋</Text>
          <Text style={styles.headerTitle}>Que désirez-vous manger?</Text>
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
            onPress={() => navigation.navigate("Checkout")}
          >
            <Text style={styles.cartIcon}>🛒</Text>
            {totalQuantity > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{totalQuantity}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contentWrapper}>
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Chargement des produits...</Text>
            </View>
          ) : (
            <>
              {/* Barre de Recherche */}
              <View style={styles.searchContainer}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChangeText={handleSearchChange}
                  placeholderTextColor={COLORS.textSecondary}
                />
                {searchQuery ? (
                  <TouchableOpacity onPress={() => handleSearchChange("")}>
                    <Text style={styles.clearButton}>✕</Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              {/* Popular Products Section */}
              {!selectedCategory && !searchQuery && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Plats Populaires</Text>
                  <FlatList
                    horizontal
                    data={popularProducts}
                    renderItem={renderProductCard}
                    keyExtractor={(item) => item.id.toString()}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.productList}
                    scrollEventThrottle={16}
                  />
                </View>
              )}

              {/* Categories Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Catégories</Text>
                <View style={styles.categoriesGrid}>
                  {CATEGORIES.map((item) => (
                    <CategoryCard
                      key={item.id}
                      item={item}
                      isActive={selectedCategory?.id === item.id}
                      onPress={() => handleCategoryPress(item)}
                    />
                  ))}
                </View>
              </View>

              {/* Results */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {selectedCategory
                    ? `${selectedCategory.name} (${filteredProducts.length})`
                    : searchQuery
                      ? `Résultats (${filteredProducts.length})`
                      : `Tous les produits (${filteredProducts.length})`}
                </Text>

                {filteredProducts.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>🍽️</Text>
                    <Text style={styles.emptyText}>Aucun produit trouvé</Text>
                    {searchQuery && (
                      <TouchableOpacity
                        onPress={() => handleSearchChange("")}
                        style={styles.resetButton}
                      >
                        <Text style={styles.resetButtonText}>
                          Réinitialiser la recherche
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ) : (
                  <FlatList
                    scrollEnabled={false}
                    data={filteredProducts}
                    renderItem={({ item }) => (
                      <View style={styles.listProductCard}>
                        <Text style={styles.listProductImage}>
                          {item.image}
                        </Text>
                        <View style={styles.listProductInfo}>
                          <Text style={styles.listProductName}>
                            {item.name}
                          </Text>
                          <Text style={styles.listProductDescription}>
                            {item.description}
                          </Text>
                          <View style={styles.productPriceRow}>
                            <Text style={styles.listProductPrice}>
                              DH{item.price.toFixed(2)}
                            </Text>
                            <Text style={styles.categoryBadge}>
                              {item.category}
                            </Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          style={styles.listAddButton}
                          onPress={() => handleAddToCart(item)}
                        >
                          <Text style={styles.addButtonText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                  />
                )}
              </View>
            </>
          )}
        </ScrollView>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIconActive}>🏠</Text>
          <Text style={styles.navLabelActive}>Accueil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Orders")}
        >
          <Text style={styles.navIcon}>📦</Text>
          <Text style={styles.navLabel}>Commandes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Profile")}
        >
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navLabel}>Profil</Text>
        </TouchableOpacity>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  headerGreeting: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 6,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  adminButton: {
    padding: 8,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  adminIcon: {
    fontSize: 20,
  },
  cartButton: {
    position: "relative",
    backgroundColor: PRIMARY_LIGHT,
    borderRadius: 12,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  cartIcon: {
    fontSize: 20,
  },
  cartBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  cartBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  contentWrapper: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
    color: COLORS.primary,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 0,
    color: COLORS.textPrimary,
    fontSize: 15,
  },
  clearButton: {
    fontSize: 18,
    color: COLORS.primary,
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  section: {
    marginTop: 24,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginLeft: 16,
    marginBottom: 16,
    letterSpacing: 0.2,
  },
  productList: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  productCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 12,
    marginRight: 14,
    width: CARD_WIDTH,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: "#E8E8E8",
  },
  productImage: {
    fontSize: 48,
    textAlign: "center",
    marginBottom: 10,
  },
  productName: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 10,
    height: 28,
  },
  productFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButtonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 11,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    width: "31%",
    borderWidth: 2,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  categoryCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: PRIMARY_LIGHT,
    shadowOpacity: 0.12,
    elevation: 3,
  },
  categoryIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  categoryNameActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  listProductCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: "#F5F5F5",
  },
  listProductImage: {
    fontSize: 44,
    marginRight: 12,
  },
  listProductInfo: {
    flex: 1,
  },
  listProductName: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  listProductDescription: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  productPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  listProductPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
  },
  categoryBadge: {
    fontSize: 10,
    color: COLORS.white,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
    fontWeight: "600",
  },
  listAddButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 20,
    fontWeight: "500",
  },
  resetButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  resetButtonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.3,
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#E8E8E8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
    opacity: 0.5,
  },
  navIconActive: {
    fontSize: 24,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  navLabelActive: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: "700",
  },
});
