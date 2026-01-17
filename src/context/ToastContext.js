import React, { createContext, useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  useWindowDimensions,
} from "react-native";
import { COLORS } from "../constants/colors";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const { width } = useWindowDimensions();

  const showToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now();
    const toast = {
      id,
      message,
      type, // 'success', 'error', 'warning', 'info'
    };

    setToasts((prev) => [...prev, toast]);

    // Auto-remove après duration
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getToastColor = (type) => {
    const colors = {
      success: COLORS.success || "#4CAF50",
      error: COLORS.error || "#F44336",
      warning: COLORS.warning || "#FF9800",
      info: COLORS.primary,
    };
    return colors[type] || colors.info;
  };

  const getToastIcon = (type) => {
    const icons = {
      success: "✓",
      error: "✕",
      warning: "⚠",
      info: "ℹ",
    };
    return icons[type] || "●";
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <View style={[styles.container, { width }]}>
        {toasts.map((toast) => (
          <View
            key={toast.id}
            style={[
              styles.toast,
              { backgroundColor: getToastColor(toast.type) },
            ]}
          >
            <Text style={styles.toastIcon}>{getToastIcon(toast.type)}</Text>
            <Text style={styles.toastMessage}>{toast.message}</Text>
          </View>
        ))}
      </View>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast doit être utilisé dans ToastProvider");
  }
  return context;
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    zIndex: 9999,
  },
  toast: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toastIcon: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  toastMessage: {
    color: COLORS.white,
    fontSize: 14,
    flex: 1,
  },
});
