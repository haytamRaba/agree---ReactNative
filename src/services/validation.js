// Validation utilities pour les formulaires

export const validatePhone = (phone) => {
  const phoneRegex = /^(\+212|0)[1-9][0-9]{8}$/; // Format Marocain
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateName = (name) => {
  return name && name.trim().length >= 2;
};

export const validateAddress = (address) => {
  return address && address.trim().length >= 5;
};

export const validatePostalCode = (code) => {
  const codeRegex = /^\d{4,5}$/;
  return codeRegex.test(code.trim());
};

export const formatPhoneDisplay = (phone) => {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{2})(\d{3})/, "$1 $2 $3 $4");
  }
  return phone;
};

export const sanitizeInput = (input) => {
  return input.trim().replace(/\s+/g, " ");
};

export const getValidationErrors = (formData) => {
  const errors = {};

  if (!validateName(formData.firstName)) {
    errors.firstName = "Le prénom doit avoir au moins 2 caractères";
  }

  if (!validateName(formData.lastName)) {
    errors.lastName = "Le nom doit avoir au moins 2 caractères";
  }

  if (!validatePhone(formData.phone)) {
    errors.phone =
      "Téléphone invalide (format: 06XX XXXX XX ou +212 6XX XXXX XX)";
  }

  if (!validateAddress(formData.address)) {
    errors.address = "L'adresse doit avoir au moins 5 caractères";
  }

  if (formData.email && !validateEmail(formData.email)) {
    errors.email = "Email invalide";
  }

  if (formData.postalCode && !validatePostalCode(formData.postalCode)) {
    errors.postalCode = "Code postal invalide (4-5 chiffres)";
  }

  return errors;
};
