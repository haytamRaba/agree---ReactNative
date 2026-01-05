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
import { PRODUCTS, CATEGORIES } from '../data/productsData';

export default function HomeScreen({ navigation }) {
  const [cart, setCart] = useState([]);

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
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('Checkout', { cart })}
        >
          <Text style={styles.cartIcon}>🛒</Text>
          {cart.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cart.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Popular Products Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Dishes</Text>
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
          <Text style={styles.sectionTitle}>Categories</Text>
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
          <Text style={styles.sectionTitle}>All Products</Text>
          {PRODUCTS.map((product) => (
            <View key={product.id} style={styles.listProductCard}>
              <Text style={styles.listProductImage}>{product.image}</Text>
              <View style={styles.listProductInfo}>
                <Text style={styles.listProductName}>{product.name}</Text>
                <Text style={styles.listProductDescription}>
                  {product.description}
                </Text>
                <Text style={styles.listProductPrice}>${product.price}</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerGreeting: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 5,
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
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: COLORS.white,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    fontSize: 14,
  },
  categoryRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  categoryCard: {
    backgroundColor: COLORS.white,
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
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  listProductCard: {
    backgroundColor: COLORS.white,
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
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  listAddButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
