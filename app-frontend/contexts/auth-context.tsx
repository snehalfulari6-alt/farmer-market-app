import { API_URL, authClient } from "@/lib/auth-client";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Toast } from "react-native-toast-message-ts";
import { getMyProfile } from "@/services/profile";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: "FARMER" | "BUYER" | null;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  hasProfile: boolean;
  isProfileLoading: boolean;
  isProfileChecked: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (
    name: string,
    email: string,
    phone: string,
    password: string,
    role: "FARMER" | "BUYER",
  ) => Promise<string | null>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<string | null>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  hasProfile: false,
  isProfileLoading: false,
  isProfileChecked: false,
  signIn: async () => null,
  signUp: async () => null,
  signOut: async () => { },
  signInWithGoogle: async () => null,
  refreshProfile: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isPending } = authClient.useSession();
  const isLoading = isPending;
  const [hasProfile, setHasProfile] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isProfileChecked, setIsProfileChecked] = useState(false);
  const [resolvedRole, setResolvedRole] = useState<"FARMER" | "BUYER" | null>(null);

  const sessionUser = useMemo<AuthUser | null>(() => {
    if (!data?.user) return null;
    return {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      image: data.user.image,
      role: (data.user as any).role ?? null,
    };
  }, [data?.user]);

  const user = useMemo<AuthUser | null>(() => {
    if (!sessionUser) return null;
    return {
      ...sessionUser,
      role: resolvedRole ?? sessionUser.role ?? null,
    };
  }, [resolvedRole, sessionUser]);

  const token = data?.session?.token ?? null;

  const refreshProfile = useCallback(async () => {
    if (!sessionUser?.id) {
      setHasProfile(false);
      setResolvedRole(null);
      setIsProfileLoading(false);
      setIsProfileChecked(true);
      return;
    }

    setIsProfileChecked(false);
    setIsProfileLoading(true);
    try {
      const profileData = await getMyProfile();
      const roleFromProfile = profileData.user.role ?? null;
      setResolvedRole(roleFromProfile);
      setHasProfile(!!profileData.hasProfile);
    } catch {
      setHasProfile(false);
      setResolvedRole(sessionUser.role ?? null);
    } finally {
      setIsProfileLoading(false);
      setIsProfileChecked(true);
    }
  }, [sessionUser?.id, sessionUser?.role]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const signIn = useCallback(
    async (email: string, password: string): Promise<string | null> => {
      try {
        const { error } = await authClient.signIn.email({ email, password });
        if (error) {
          const msg = error.message ?? "Sign in failed";
          Toast.show({ type: "error", text1: "Sign In Failed", text2: msg });
          return msg;
        }
        Toast.show({
          type: "success",
          text1: "Welcome back!",
          text2: "You have signed in successfully",
          visibilityTime: 1400,
        });
        return null;
      } catch {
        Toast.show({
          type: "error",
          text1: "Sign In Failed",
          text2: "Something went wrong",
        });
        return "Sign in failed";
      }
    },
    [],
  );

  const signUp = useCallback(
    async (
      name: string,
      email: string,
      phone: string,
      password: string,
      role: "FARMER" | "BUYER",
    ): Promise<string | null> => {
      try {
        const result = await authClient.signUp.email({
          name,
          email,
          password,
        });
        const { error } = result;
        if (error) {
          const msg = error.message ?? "Sign up failed";
          Toast.show({ type: "error", text1: "Sign Up Failed", text2: msg });
          return msg;
        }

        const initialToken =
          (result as any)?.data?.session?.token ??
          (result as any)?.data?.token ??
          null;

        let sessionToken: string | null = initialToken;

        if (!sessionToken) {
          const sessionResult = await (authClient as any).getSession?.();
          sessionToken =
            sessionResult?.data?.session?.token ??
            sessionResult?.data?.token ??
            null;
        }

        if (!sessionToken) {
          Toast.show({
            type: "warning",
            text1: "Account Created",
            text2: "Please sign in again to finish role setup",
          });
          return "Unable to get session token after signup";
        }

        const roleRes = await fetch(`${API_URL}/api/v1/profile/set-role`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...((authClient as any).getCookie?.()
              ? { Cookie: (authClient as any).getCookie() as string }
              : {}),
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify({ role, phone }),
        });

        if (!roleRes.ok) {
          const errJson = await roleRes.json().catch(() => ({}));
          const msg = errJson?.error ?? "Failed to set role";
          Toast.show({ type: "error", text1: "Role Setup Failed", text2: msg });
          return msg;
        }

        Toast.show({
          type: "success",
          text1: "Account Created!",
          text2: "Welcome to FarmBridge",
        });
        return null;
      } catch {
        Toast.show({
          type: "error",
          text1: "Sign Up Failed",
          text2: "Something went wrong",
        });
        return "Sign up failed";
      }
    },
    [],
  );

  const signOut = useCallback(async (): Promise<void> => {
    try {
      Toast.show({
        type: "success",
        text1: "Signed Out",
        text2: "See you next time!",
        visibilityTime: 1200,
      });
      await authClient.signOut();
    } catch (err) {
      console.error("Sign out failed", err);
      Toast.show({
        type: "error",
        text1: "Sign Out Failed",
        text2: "Please try again",
      });
    }
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<string | null> => {
    try {
      const result = await (authClient as any).signIn.social({
        provider: "google",
        callbackURL: "farmbridge://",
      });

      if (result?.error) {
        const msg = result.error.message ?? "Google sign in failed";
        Toast.show({ type: "error", text1: "Google Sign-In Failed", text2: msg });
        return msg;
      }

      return null;
    } catch {
      Toast.show({
        type: "error",
        text1: "Google Sign-In Failed",
        text2: "Please try again",
      });
      return "Google sign in failed";
    }
  }, []);

  return (
      <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        hasProfile,
        isProfileLoading,
        isProfileChecked,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
