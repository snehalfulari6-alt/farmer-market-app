import React, { useRef, useState } from "react";
import {
  Keyboard,
  Pressable,
  Text,
  TextInput,
  View,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Link, router } from "expo-router";
import { Toast } from "react-native-toast-message-ts";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/auth-context";
import AuthScreenWrapper from "@/components/auth/AuthScreenWrapper";
import AuthInput from "@/components/auth/AuthInput";
import AuthPasswordInput from "@/components/auth/AuthPasswordInput";
import AuthButton from "@/components/auth/AuthButton";
import RoleChip from "@/components/auth/RoleChip";
import { Colors } from "@/constants/colors";

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const SignUpScreen = () => {
  const { signUp, signInWithGoogle } = useAuth();
  const insets = useSafeAreaInsets();
  const [role, setRole] = useState<"FARMER" | "BUYER">("FARMER");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const onSignUp = async () => {
    if (loading) return;
    Keyboard.dismiss();

    if (!name || !email || !phone || !password || !confirmPassword) {
      Toast.show({
        type: "warning",
        text1: "Missing Fields",
        text2: "Please fill in all required fields, including phone",
      });
      return;
    }
    if (!isValidEmail(email)) {
      Toast.show({
        type: "warning",
        text1: "Invalid Email",
        text2: "Please enter a valid email address",
      });
      return;
    }
    if (password.length < 8) {
      Toast.show({
        type: "warning",
        text1: "Weak Password",
        text2: "Password must be at least 8 characters",
      });
      return;
    }
    if (password !== confirmPassword) {
      Toast.show({
        type: "warning",
        text1: "Password Mismatch",
        text2: "Passwords do not match",
      });
      return;
    }

    setLoading(true);

    try {
      const error = await signUp(name, email, phone, password, role);
      if (!error) {
        if (role === "FARMER") {
          router.replace("/(auth)/farmer-registration");
        } else {
          router.replace("/(tabs)");
        }
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: (err as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  const onGooglePress = async () => {
    if (loading) return;

    setLoading(true);
    try {
      await signInWithGoogle();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreenWrapper>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.primaryDark}
      />

      {/* Green Header */}
      <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
        <Text style={styles.headerTitle}>FarmBridge</Text>
        <Text style={styles.headerSubtitle}>Create Your Account</Text>
      </View>

      {/* White Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sign Up</Text>

        {/* Role Selection */}
        <Text style={styles.fieldLabel}>I am a</Text>
        <RoleChip selectedRole={role} onSelect={setRole} />

        {/* Form Fields */}
        <AuthInput
          label="Full Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter your full name"
          autoCapitalize="words"
          textContentType="name"
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
        />

        <AuthInput
          ref={emailRef}
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          textContentType="emailAddress"
          returnKeyType="next"
          onSubmitEditing={() => phoneRef.current?.focus()}
        />

        <AuthInput
          ref={phoneRef}
          label="Phone Number"
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter phone number"
          prefix="+91"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />

        <AuthPasswordInput
          ref={passwordRef}
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Create a password (min 8 chars)"
          textContentType="newPassword"
          returnKeyType="next"
          onSubmitEditing={() => confirmPasswordRef.current?.focus()}
        />

        <AuthPasswordInput
          ref={confirmPasswordRef}
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Re-enter your password"
          textContentType="newPassword"
          returnKeyType="done"
          onSubmitEditing={onSignUp}
        />

        <AuthButton label="Continue" loading={loading} onPress={onSignUp} />

        {/* Sign In Link */}
        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>Already have an account? </Text>
          <Link href="/(auth)/signin" asChild>
            <Pressable>
              <Text style={styles.linkAction}>Login</Text>
            </Pressable>
          </Link>
        </View>

        {/* <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <Pressable style={styles.googleButton} onPress={onGooglePress}>
          <Text style={styles.googleIcon}>G</Text>
          <Text style={styles.googleButtonText}>Sign up with Google</Text>
        </Pressable> */}
      </View>
    </AuthScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.textOnPrimary,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
    gap: 2,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 8,
    marginLeft: 2,
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  linkText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  linkAction: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: 10,
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: "500",
  },
  googleButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.surfaceAlt,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
  },
  googleButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
});

export default SignUpScreen;
