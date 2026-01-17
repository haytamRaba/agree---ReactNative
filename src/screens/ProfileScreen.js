import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useUser } from "../context/UserContext";
import CustomAlert from "../components/CustomAlert";
import colors from "../constants/colors";

export default function ProfileScreen({ navigation }) {
  const { user, updateUser, logout, login } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [alertConfig, setAlertConfig] = useState({ visible: false });

  // Login form states
  const [showLogin, setShowLogin] = useState(false);
  const [loginName, setLoginName] = useState("");
  const [loginPhone, setLoginPhone] = useState("");
  const [loginAddress, setLoginAddress] = useState("");

  const showAlert = (title, message, type = "info", buttons = []) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      type,
      buttons:
        buttons.length > 0
          ? buttons
          : [{ text: "OK", onPress: () => setAlertConfig({ visible: false }) }],
    });
  };

  const handleSave = async () => {
    if (!name || !phone || !address) {
      showAlert("Erreur", "Veuillez remplir tous les champs", "error");
      return;
    }

    try {
      await updateUser({ name, phone, address });
      setIsEditing(false);
      showAlert("Succès", "Profil mis à jour avec succès", "success");
    } catch (error) {
      showAlert("Erreur", "Erreur lors de la mise à jour du profil", "error");
    }
  };

  const handleLogout = () => {
    showAlert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter?",
      "confirm",
      [
        {
          text: "Annuler",
          style: "cancel",
          onPress: () => setAlertConfig({ visible: false }),
        },
        {
          text: "Déconnecter",
          onPress: async () => {
            await logout();
            setAlertConfig({ visible: false });
            navigation.reset({ index: 0, routes: [{ name: "Home" }] });
          },
        },
      ],
    );
  };

  const handleLogin = async () => {
    if (!loginName || !loginPhone || !loginAddress) {
      showAlert("Erreur", "Veuillez remplir tous les champs", "error");
      return;
    }

    try {
      await login({
        name: loginName,
        phone: loginPhone,
        address: loginAddress,
      });
      setShowLogin(false);
      setLoginName("");
      setLoginPhone("");
      setLoginAddress("");
      showAlert(
        "Succès",
        "Connexion réussie! Bienvenue sur Agree 🥗",
        "success",
      );
    } catch (error) {
      showAlert("Erreur", "Erreur lors de la connexion", "error");
    }
  };

  if (!user) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🥗</Text>
          <Text style={styles.title}>Bienvenue sur Agree!</Text>
          <Text style={styles.subtitle}>
            Connectez-vous pour accéder à votre profil et voir l'historique de
            vos commandes
          </Text>

          {!showLogin ? (
            <>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => setShowLogin(true)}
              >
                <Text style={styles.primaryButtonText}>🔐 Se Connecter</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => navigation.navigate("Home")}
              >
                <Text style={styles.secondaryButtonText}>
                  🥗 Explorer les Produits
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.loginForm}>
              <Text style={styles.formTitle}>Connexion</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nom complet</Text>
                <TextInput
                  style={styles.input}
                  value={loginName}
                  onChangeText={setLoginName}
                  placeholder="Votre nom complet"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Téléphone</Text>
                <TextInput
                  style={styles.input}
                  value={loginPhone}
                  onChangeText={setLoginPhone}
                  placeholder="06XXXXXXXX"
                  keyboardType="phone-pad"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Adresse</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={loginAddress}
                  onChangeText={setLoginAddress}
                  placeholder="Votre adresse complète"
                  multiline
                  numberOfLines={3}
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleLogin}
              >
                <Text style={styles.primaryButtonText}>✅ Confirmer</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowLogin(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          )}

          {!showLogin && (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                ℹ️ Avec votre compte, vous aurez accès à:
              </Text>
              <Text style={styles.infoItem}>• Votre profil personnel</Text>
              <Text style={styles.infoItem}>
                • L'historique de vos commandes
              </Text>
              <Text style={styles.infoItem}>• Le suivi de vos livraisons</Text>
              <Text style={styles.infoItem}>
                • La modification rapide de vos informations
              </Text>
            </View>
          )}
        </ScrollView>
        <CustomAlert {...alertConfig} />
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={90}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.userName}>{name}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom complet</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={name}
              onChangeText={setName}
              editable={isEditing}
              placeholder="Votre nom"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Téléphone</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={phone}
              onChangeText={setPhone}
              editable={isEditing}
              placeholder="Votre téléphone"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Adresse</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                !isEditing && styles.inputDisabled,
              ]}
              value={address}
              onChangeText={setAddress}
              editable={isEditing}
              placeholder="Votre adresse"
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {isEditing ? (
            <>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>💾 Enregistrer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setIsEditing(false);
                  setName(user.name);
                  setPhone(user.phone);
                  setAddress(user.address);
                }}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.editButtonText}>✏️ Modifier le profil</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Text style={styles.logoutButtonText}>🚪 Se déconnecter</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        buttons={alertConfig.buttons}
        onClose={() => setAlertConfig({ visible: false })}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarText: {
    fontSize: 42,
    fontWeight: "bold",
    color: "white",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  inputDisabled: {
    backgroundColor: "#F9FAFB",
    color: colors.textSecondary,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  buttonContainer: {
    gap: 12,
  },
  editButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  cancelButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FCA5A5",
  },
  logoutButtonText: {
    color: "#DC2626",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  loginForm: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    width: "100%",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  infoBox: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 20,
    marginTop: 30,
    width: "100%",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 15,
    lineHeight: 20,
  },
  infoItem: {
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 10,
    marginBottom: 8,
    lineHeight: 20,
  },
});
