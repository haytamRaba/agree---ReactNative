import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { COLORS } from '../constants/colors';

export default function CheckoutScreen({ route, navigation }) {
  const { cart = [] } = route.params || {};
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handlePlaceOrder = () => {
    if (!firstName || !lastName || !phone || !address) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    Alert.alert(
      'Order Placed!',
      `Thank you ${firstName} ${lastName}! Your order of $${calculateTotal().toFixed(
        2
      )} will be delivered soon.`,
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Home'),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {cart.length === 0 ? (
            <Text style={styles.emptyText}>Your cart is empty</Text>
          ) : (
            cart.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <Text style={styles.cartItemImage}>{item.image}</Text>
                <View style={styles.cartItemInfo}>
                  <Text style={styles.cartItemName}>{item.name}</Text>
                  <Text style={styles.cartItemPrice}>
                    ${item.price} x {item.quantity}
                  </Text>
                </View>
                <Text style={styles.cartItemTotal}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Customer Information Form */}
        {cart.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Information</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your first name"
                value={firstName}
                onChangeText={setFirstName}
                placeholderTextColor={COLORS.gray}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your last name"
                value={lastName}
                onChangeText={setLastName}
                placeholderTextColor={COLORS.gray}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholderTextColor={COLORS.gray}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Delivery Address</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter your delivery address"
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={3}
                placeholderTextColor={COLORS.gray}
              />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer with Total and Place Order Button */}
      {cart.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalAmount}>DH{calculateTotal().toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            style={styles.placeOrderButton}
            onPress={handlePlaceOrder}
          >
            <Text style={styles.placeOrderButtonText}>Place Order</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: COLORS.white,
    marginTop: 15,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 15,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: 16,
    paddingVertical: 20,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  cartItemImage: {
    fontSize: 40,
    marginRight: 15,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  cartItemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  footer: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  placeOrderButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  placeOrderButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
