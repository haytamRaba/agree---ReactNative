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
import { useTheme } from '../context/ThemeContext';

export default function CheckoutScreen({ route, navigation }) {
  const { cart = [] } = route.params || {};
  const { theme } = useTheme();
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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Order Summary</Text>
          {cart.length === 0 ? (
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>Your cart is empty</Text>
          ) : (
            cart.map((item) => (
              <View key={item.id} style={[styles.cartItem, { borderBottomColor: theme.lightGray }]}>
                <Text style={styles.cartItemImage}>{item.image}</Text>
                <View style={styles.cartItemInfo}>
                  <Text style={[styles.cartItemName, { color: theme.textPrimary }]}>{item.name}</Text>
                  <Text style={[styles.cartItemPrice, { color: theme.textSecondary }]}>
                    DH{item.price} x {item.quantity}
                  </Text>
                </View>
                <Text style={[styles.cartItemTotal, { color: theme.primary }]}>
                  DH{(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Customer Information Form */}
        {cart.length > 0 && (
          <View style={[styles.section, { backgroundColor: theme.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Delivery Information</Text>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.textPrimary }]}>First Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.lightGray, color: theme.textPrimary, borderColor: theme.lightGray }]}
                placeholder="Enter your first name"
                value={firstName}
                onChangeText={setFirstName}
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.textPrimary }]}>Last Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.lightGray, color: theme.textPrimary, borderColor: theme.lightGray }]}
                placeholder="Enter your last name"
                value={lastName}
                onChangeText={setLastName}
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.textPrimary }]}>Phone Number</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.lightGray, color: theme.textPrimary, borderColor: theme.lightGray }]}
                placeholder="Enter your phone number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.textPrimary }]}>Delivery Address</Text>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: theme.lightGray, color: theme.textPrimary, borderColor: theme.lightGray }]}
                placeholder="Enter your delivery address"
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={3}
                placeholderTextColor={theme.textSecondary}
              />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer with Total and Place Order Button */}
      {cart.length > 0 && (
        <View style={[styles.footer, { backgroundColor: theme.card, borderTopColor: theme.lightGray }]}>
          <View style={styles.totalContainer}>
            <Text style={[styles.totalLabel, { color: theme.textPrimary }]}>Total:</Text>
            <Text style={[styles.totalAmount, { color: theme.primary }]}>DH{calculateTotal().toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            style={[styles.placeOrderButton, { backgroundColor: theme.primary }]}
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
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 15,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    paddingVertical: 20,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
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
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 14,
  },
  cartItemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
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
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  placeOrderButton: {
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  placeOrderButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
