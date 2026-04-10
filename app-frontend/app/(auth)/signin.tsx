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
import { Colors } from "@/constants/colors";

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const SignInScreen = () => {
  const { signIn, signInWithGoogle } = useAuth();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordRef = useRef<TextInput>(null);

  const onSignIn = async () => {
    if (loading) return;
    Keyboard.dismiss();

    if (!email || !password) {
      Toast.show({
        type: "warning",
        text1: "Missing Fields",
        text2: "Please fill in all fields",
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

    setLoading(true);

    try {
      const error = await signIn(email, password);
      if (!error) {
        router.replace("/(tabs)");
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
      <View style={[styles.header, { paddingTop: insets.top + 40 }]}>
        <Text style={styles.headerTitle}>FarmBridge</Text>
        <Text style={styles.headerSubtitle}>Welcome Back</Text>
      </View>

      {/* White Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sign In</Text>

        <AuthInput
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          textContentType="emailAddress"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />

        <AuthPasswordInput
          ref={passwordRef}
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          textContentType="password"
          returnKeyType="done"
          onSubmitEditing={onSignIn}
        />

        <AuthButton label="Sign In" loading={loading} onPress={onSignIn} />

        <Pressable style={styles.forgotContainer}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </Pressable>

        {/* Sign Up Link */}
        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>Don&apost have an account? </Text>
          <Link href="/(auth)/signup" asChild>
            <Pressable>
              <Text style={styles.linkAction}>Sign Up</Text>
            </Pressable>
          </Link>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <Pressable style={styles.googleButton} onPress={onGooglePress}>
          <Text style={styles.googleIcon}>G</Text>
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </Pressable>
      </View>
    </AuthScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    paddingBottom: 40,
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
    marginBottom: 24,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.primary,
  },
  forgotContainer: {
    alignSelf: "flex-end",
    marginTop: 4,
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 22,
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
    marginTop: 20,
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

export default SignInScreen;
