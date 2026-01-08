import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';

export default function CheckoutScreen({ route, navigation }) {
  const { cart = [] } = route.params || {};
  const { theme } = useTheme();
  const { user, isRegistered, registerUser, loginUser } = useUser();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Registration/Login states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authPasswordConfirm, setAuthPasswordConfirm] = useState('');
  const [authNickname, setAuthNickname] = useState('');

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleRegister = () => {
    if (!authEmail || !authPassword || !authPasswordConfirm || !authNickname) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (authPassword !== authPasswordConfirm) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (authPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (registerUser(authEmail, authPassword, authNickname)) {
      Alert.alert('Success', `Welcome ${authNickname}! Your account has been created.`);
      setShowAuthModal(false);
      resetAuthForm();
    }
  };

  const handleLogin = () => {
    if (!authEmail || !authPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (loginUser(authEmail, authPassword)) {
      Alert.alert('Success', `Welcome back ${user?.nickname}!`);
      setShowAuthModal(false);
      resetAuthForm();
    } else {
      Alert.alert('Error', 'Invalid email or password');
    }
  };

  const resetAuthForm = () => {
    setAuthEmail('');
    setAuthPassword('');
    setAuthPasswordConfirm('');
    setAuthNickname('');
  };

  const handleAuthAction = () => {
    if (isLoginMode) {
      handleLogin();
    } else {
      handleRegister();
    }
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
      {/* Auth Modal */}
      <Modal
        visible={showAuthModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAuthModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                {isLoginMode ? 'Login' : 'Create Account'}
              </Text>
              <TouchableOpacity onPress={() => setShowAuthModal(false)}>
                <Text style={[styles.closeButton, { color: theme.textPrimary }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.textPrimary }]}>Email</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.lightGray, color: theme.textPrimary, borderColor: theme.lightGray }]}
                  placeholder="Enter your email"
                  value={authEmail}
                  onChangeText={setAuthEmail}
                  keyboardType="email-address"
                  editable={!isLoginMode || isRegistered === false}
                  placeholderTextColor={theme.textSecondary}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.textPrimary }]}>Password</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.lightGray, color: theme.textPrimary, borderColor: theme.lightGray }]}
                  placeholder="Enter your password"
                  value={authPassword}
                  onChangeText={setAuthPassword}
                  secureTextEntry={true}
                  placeholderTextColor={theme.textSecondary}
                />
              </View>

              {!isLoginMode && (
                <>
                  <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: theme.textPrimary }]}>Confirm Password</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: theme.lightGray, color: theme.textPrimary, borderColor: theme.lightGray }]}
                      placeholder="Confirm your password"
                      value={authPasswordConfirm}
                      onChangeText={setAuthPasswordConfirm}
                      secureTextEntry={true}
                      placeholderTextColor={theme.textSecondary}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: theme.textPrimary }]}>Nickname</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: theme.lightGray, color: theme.textPrimary, borderColor: theme.lightGray }]}
                      placeholder="Choose your nickname"
                      value={authNickname}
                      onChangeText={setAuthNickname}
                      placeholderTextColor={theme.textSecondary}
                    />
                  </View>
                </>
              )}

              <TouchableOpacity
                style={[styles.authButton, { backgroundColor: theme.primary }]}
                onPress={handleAuthAction}
              >
                <Text style={styles.authButtonText}>
                  {isLoginMode ? 'Login' : 'Register'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.toggleAuthMode}
                onPress={() => {
                  setIsLoginMode(!isLoginMode);
                  resetAuthForm();
                }}
              >
                <Text style={[styles.toggleAuthModeText, { color: theme.primary }]}>
                  {isLoginMode ? 'No account? Register here' : 'Already have an account? Login'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Authentication Section */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          {isRegistered && user ? (
            <View style={styles.userInfoContainer}>
              <Text style={[styles.userGreeting, { color: theme.primary }]}>✓ Logged in as</Text>
              <Text style={[styles.userName, { color: theme.textPrimary }]}>{user.nickname}</Text>
              <Text style={[styles.userEmail, { color: theme.textSecondary }]}>{user.email}</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.registerButton, { backgroundColor: theme.primary }]}
              onPress={() => {
                setIsLoginMode(false);
                setShowAuthModal(true);
              }}
            >
              <Text style={styles.registerButtonText}>📝 Register / Login Account</Text>
            </TouchableOpacity>
          )}
        </View>

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
  registerButton: {
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 10,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userInfoContainer: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  userGreeting: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  authButton: {
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleAuthMode: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  toggleAuthModeText: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
