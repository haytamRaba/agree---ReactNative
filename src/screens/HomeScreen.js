import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';
import { PRODUCTS, CATEGORIES } from '../data/productsData';

export default function HomeScreen({ navigation }) {
  const [cart, setCart] = useState([]);
  const { theme, isDarkMode, toggleTheme } = useTheme();

  const popularProducts = PRODUCTS.filter((product) => product.popular);

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const renderProductCard = ({ item }) => (
    <View style={[styles.productCard, { backgroundColor: theme.card }]}>
      <Text style={styles.productImage}>{item.image}</Text>
      <Text style={[styles.productName, { color: theme.textPrimary }]}>{item.name}</Text>
      <Text style={[styles.productDescription, { color: theme.textSecondary }]}>{item.description}</Text>
      <View style={styles.productFooter}>
        <Text style={[styles.productPrice, { color: theme.primary }]}>DH{item.price}</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.primary }]}
          onPress={() => addToCart(item)}
        >
          <Text style={styles.addButtonText}>Add +</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCategoryCard = ({ item }) => (
    <TouchableOpacity style={[styles.categoryCard, { backgroundColor: theme.card }]}>
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={[styles.categoryName, { color: theme.textPrimary }]}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <View>
          <Text style={[styles.headerGreeting, { color: theme.textSecondary }]}>Hello! 👋</Text>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>What would you like to eat?</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.themeButton, { backgroundColor: theme.primary }]}
            onPress={toggleTheme}
          >
            <Text style={styles.themeIcon}>{isDarkMode ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigation.navigate('Checkout', { cart })}
          >
            <Text style={styles.cartIcon}>🛒</Text>
            {cart.length > 0 && (
              <View style={[styles.cartBadge, { backgroundColor: theme.accent }]}>
                <Text style={styles.cartBadgeText}>{cart.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Popular Products Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Popular Dishes</Text>
          <FlatList
            data={popularProducts}
            renderItem={renderProductCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productList}
          />
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Categories</Text>
          <FlatList
            data={CATEGORIES}
            renderItem={renderCategoryCard}
            keyExtractor={(item) => item.id}
            numColumns={3}
            columnWrapperStyle={styles.categoryRow}
          />
        </View>

        {/* All Products Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>All Products</Text>
          {PRODUCTS.map((product) => (
            <View key={product.id} style={[styles.listProductCard, { backgroundColor: theme.card }]}>
              <Text style={styles.listProductImage}>{product.image}</Text>
              <View style={styles.listProductInfo}>
                <Text style={[styles.listProductName, { color: theme.textPrimary }]}>{product.name}</Text>
                <Text style={[styles.listProductDescription, { color: theme.textSecondary }]}>
                  {product.description}
                </Text>
                <Text style={[styles.listProductPrice, { color: theme.primary }]}>DH{product.price}</Text>
              </View>
              <TouchableOpacity
                style={[styles.listAddButton, { backgroundColor: theme.primary }]}
                onPress={() => addToCart(product)}
              >
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerGreeting: {
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  themeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeIcon: {
    fontSize: 20,
  },
  cartButton: {
    position: 'relative',
  },
  cartIcon: {
    fontSize: 32,
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 15,
  },
  productList: {
    paddingLeft: 20,
  },
  productCard: {
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    fontSize: 60,
    textAlign: 'center',
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 12,
    marginBottom: 10,
    height: 35,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  categoryRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  categoryCard: {
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    width: '30%',
    shadowColor: '#000',
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
    fontWeight: '600',
    textAlign: 'center',
  },
  listProductCard: {
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
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
    fontWeight: 'bold',
    marginBottom: 5,
  },
  listProductDescription: {
    fontSize: 12,
    marginBottom: 5,
  },
  listProductPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  listAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
