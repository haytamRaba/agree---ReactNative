import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { COLORS } from "../constants/colors";
import {
  addCustomer,
  createOrder,
  getCustomerByPhone,
} from "../services/database";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import {
  validatePhone,
  validateName,
  validateAddress,
  getValidationErrors,
  formatPhoneDisplay,
  sanitizeInput,
} from "../services/validation";

export default function CheckoutScreen({ navigation }) {
  const { cart, clearCart } = useCart();
  const { user } = useUser();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Pré-remplir les champs si l'utilisateur est connecté
  useEffect(() => {
    if (user) {
      // Diviser le nom complet en prénom et nom
      const nameParts = user.name?.split(" ") || [];
      setFirstName(nameParts[0] || "");
      setLastName(nameParts.slice(1).join(" ") || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
    }
  }, [user]);

  const increaseQuantity = (productId) => {
    // Utiliser le context
  };

  const decreaseQuantity = (productId) => {
    // Utiliser le context
  };

  const calculateTotal = useCallback(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const validateForm = useCallback(() => {
    const formData = {
      firstName: sanitizeInput(firstName),
      lastName: sanitizeInput(lastName),
      phone: phone.replace(/\s/g, ""),
      address: sanitizeInput(address),
      city: sanitizeInput(city),
      postalCode: postalCode.trim(),
    };

    const newErrors = getValidationErrors(formData);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  }, [firstName, lastName, phone, address, city, postalCode]);

  const handlePlaceOrder = useCallback(async () => {
    if (cart.length === 0) {
      Alert.alert("Erreur", "Votre panier est vide");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const phoneFormatted = phone.replace(/\s/g, "");
      let customer = getCustomerByPhone(phoneFormatted);
      let customerId;

      if (customer) {
        customerId = customer.id;
      } else {
        customerId = addCustomer(
          sanitizeInput(firstName),
          sanitizeInput(lastName),
          phoneFormatted,
          sanitizeInput(address),
        );
      }

      if (!customerId) {
        Alert.alert("Erreur", "Impossible de créer le client");
        setLoading(false);
        return;
      }

      const orderId = createOrder(customerId, cart, calculateTotal());

      if (orderId) {
        Alert.alert(
          "✅ Commande Confirmée!",
          `Merci ${firstName} ${lastName}!\n\nCommande #${orderId}\nMontant: DH${calculateTotal().toFixed(2)}\n\nVotre commande sera livrée à:\n${address}, ${city}\n\nLivraison sous 30-45 minutes.`,
          [
            {
              text: "Excellent!",
              onPress: async () => {
                await clearCart();
                navigation.navigate("Home");
              },
            },
          ],
        );
      } else {
        Alert.alert("Erreur", "Impossible de créer la commande");
      }
    } catch (error) {
      Alert.alert("Erreur", "Une erreur est survenue: " + error.message);
      console.error("Erreur lors de la création de la commande:", error);
    } finally {
      setLoading(false);
    }
  }, [
    cart,
    firstName,
    lastName,
    phone,
    address,
    city,
    validateForm,
    calculateTotal,
    clearCart,
    navigation,
  ]);

  const total = useMemo(() => calculateTotal(), [calculateTotal]);
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🛒 Commander</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {cart.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyHeading}>Votre panier est vide</Text>
            <Text style={styles.emptyText}>
              Explorez nos délicieux produits et ajoutez-les à votre panier
            </Text>
            <TouchableOpacity
              style={styles.continueShoppingButton}
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={styles.continueShoppingText}>
                Continuer le shopping
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Order Summary */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Résumé de la Commande</Text>
                <Text style={styles.itemCount}>
                  {cart.length} article{cart.length > 1 ? "s" : ""}
                </Text>
              </View>

              {cart.map((item) => (
                <View key={item.id} style={styles.cartItem}>
                  <Text style={styles.cartItemImage}>{item.image}</Text>
                  <View style={styles.cartItemInfo}>
                    <Text style={styles.cartItemName}>{item.name}</Text>
                    <Text style={styles.cartItemDescription}>
                      {item.description}
                    </Text>
                    <Text style={styles.cartItemPrice}>
                      DH{(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.quantityBadge}>
                    <Text style={styles.quantityBadgeText}>
                      x{item.quantity}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Delivery Information Form */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informations de Livraison</Text>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Prénom</Text>
                <TextInput
                  style={[styles.input, errors.firstName && styles.inputError]}
                  placeholder="Votre prénom"
                  value={firstName}
                  onChangeText={(text) => {
                    setFirstName(text);
                    if (errors.firstName) {
                      const newErrors = { ...errors };
                      delete newErrors.firstName;
                      setErrors(newErrors);
                    }
                  }}
                  placeholderTextColor={COLORS.textSecondary}
                />
                {errors.firstName && (
                  <Text style={styles.errorText}>{errors.firstName}</Text>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Nom</Text>
                <TextInput
                  style={[styles.input, errors.lastName && styles.inputError]}
                  placeholder="Votre nom"
                  value={lastName}
                  onChangeText={(text) => {
                    setLastName(text);
                    if (errors.lastName) {
                      const newErrors = { ...errors };
                      delete newErrors.lastName;
                      setErrors(newErrors);
                    }
                  }}
                  placeholderTextColor={COLORS.textSecondary}
                />
                {errors.lastName && (
                  <Text style={styles.errorText}>{errors.lastName}</Text>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Téléphone</Text>
                <TextInput
                  style={[styles.input, errors.phone && styles.inputError]}
                  placeholder="06XX XXXX XX"
                  value={phone}
                  onChangeText={(text) => {
                    setPhone(text);
                    if (errors.phone) {
                      const newErrors = { ...errors };
                      delete newErrors.phone;
                      setErrors(newErrors);
                    }
                  }}
                  keyboardType="phone-pad"
                  placeholderTextColor={COLORS.textSecondary}
                />
                {errors.phone && (
                  <Text style={styles.errorText}>{errors.phone}</Text>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Adresse de Livraison</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    errors.address && styles.inputError,
                  ]}
                  placeholder="Votre adresse complète"
                  value={address}
                  onChangeText={(text) => {
                    setAddress(text);
                    if (errors.address) {
                      const newErrors = { ...errors };
                      delete newErrors.address;
                      setErrors(newErrors);
                    }
                  }}
                  multiline
                  numberOfLines={3}
                  placeholderTextColor={COLORS.textSecondary}
                />
                {errors.address && (
                  <Text style={styles.errorText}>{errors.address}</Text>
                )}
              </View>

              <View style={styles.rowContainer}>
                <View style={[styles.formGroup, styles.halfWidth]}>
                  <Text style={styles.label}>Ville</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ville"
                    value={city}
                    onChangeText={setCity}
                    placeholderTextColor={COLORS.textSecondary}
                  />
                </View>

                <View style={[styles.formGroup, styles.halfWidth]}>
                  <Text style={styles.label}>Code Postal</Text>
                  <TextInput
                    style={[
                      styles.input,
                      errors.postalCode && styles.inputError,
                    ]}
                    placeholder="Code"
                    value={postalCode}
                    onChangeText={(text) => {
                      setPostalCode(text);
                      if (errors.postalCode) {
                        const newErrors = { ...errors };
                        delete newErrors.postalCode;
                        setErrors(newErrors);
                      }
                    }}
                    keyboardType="number-pad"
                    placeholderTextColor={COLORS.textSecondary}
                  />
                  {errors.postalCode && (
                    <Text style={styles.errorText}>{errors.postalCode}</Text>
                  )}
                </View>
              </View>
            </View>

            {/* Total and Order Button */}
            <View style={styles.totalSection}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Sous-total:</Text>
                <Text style={styles.totalValue}>DH{total.toFixed(2)}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Livraison:</Text>
                <Text style={styles.totalValue}>Gratuite</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.totalRow}>
                <Text style={styles.finalTotal}>TOTAL:</Text>
                <Text style={styles.finalTotalAmount}>
                  DH{total.toFixed(2)}
                </Text>
              </View>
            </View>

            <View style={styles.spacing} />
          </>
        )}
      </ScrollView>

      {cart.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.placeOrderButton,
              (loading || hasErrors) && styles.placeOrderButtonDisabled,
            ]}
            onPress={handlePlaceOrder}
            disabled={loading || hasErrors}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
              <>
                <Text style={styles.placeOrderButtonText}>
                  Confirmer la Commande
                </Text>
                <Text style={styles.placeOrderButtonSubtext}>
                  DH{total.toFixed(2)}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 28,
    color: COLORS.primary,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  headerPlaceholder: {
    width: 40,
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
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 15,
  },
  emptyText: {
    textAlign: "center",
    color: COLORS.textSecondary,
    fontSize: 16,
    paddingVertical: 20,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.lightGray,
    borderRadius: 15,
    padding: 3,
    marginRight: 10,
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
    marginRight: 10,
    padding: 5,
  },
  deleteButtonText: {
    fontSize: 20,
  },
  cartItemTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    minWidth: 70,
    textAlign: "right",
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
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
    textAlignVertical: "top",
  },
  footer: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  placeOrderButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
  },
  placeOrderButtonDisabled: {
    backgroundColor: COLORS.gray,
    opacity: 0.6,
  },
  placeOrderButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});
