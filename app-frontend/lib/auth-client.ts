import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

export const API_URL =
  Constants.expoConfig?.extra?.apiUrl ?? "http://10.11.235.236:3000";

export const authClient = createAuthClient({
  baseURL: API_URL,
  plugins: [
    expoClient({
      scheme: "farmbridge",
      storagePrefix: "farmbridge",
      storage: SecureStore,
    }),
  ],
});
