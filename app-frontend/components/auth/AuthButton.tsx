import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/colors";

interface AuthButtonProps {
  label: string;
  loading?: boolean;
  onPress: () => void;
}

const AuthButton = ({ label, loading = false, onPress }: AuthButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.85}
      style={[
        styles.button,
        loading && styles.buttonDisabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#F9A825",
    borderRadius: 12,
    minHeight: 50,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#F57F17",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  label: {
    color: Colors.textOnAccent,
    fontSize: 16,
    fontWeight: "700",
  },
});

export default AuthButton;
