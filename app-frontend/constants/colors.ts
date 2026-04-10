export const Colors = {
  // Primary palette
  primary: "#2E7D32",
  primaryDark: "#1B5E20",
  primaryLight: "#4CAF50",
  primarySurface: "#E8F5E9",

  // Accent / CTA
  accent: "#F9A825",
  accentDark: "#F57F17",
  accentLight: "#FFF8E1",

  // Neutral
  background: "#F5F5F5",
  surface: "#FFFFFF",
  surfaceAlt: "#FAFAFA",
  card: "#FFFFFF",
  border: "#E0E0E0",
  borderLight: "#EEEEEE",
  divider: "#F0F0F0",

  // Text
  text: "#1A1A1A",
  textPrimary: "#1A1A1A",
  textSecondary: "#555555",
  textMuted: "#999999",
  textOnPrimary: "#FFFFFF",
  textOnAccent: "#FFFFFF",

  // Status
  error: "#D32F2F",
  errorLight: "#FFEBEE",
  success: "#388E3C",
  successLight: "#E8F5E9",
  warning: "#F57C00",
  warningLight: "#FFF3E0",
  info: "#1976D2",
  infoLight: "#E3F2FD",

  // Order status colors
  statusPending: "#FBC02D",
  statusConfirmed: "#2196F3",
  statusDispatched: "#FF9800",
  statusDelivered: "#4CAF50",
  statusCancelled: "#D32F2F",

  // 
  active: "#2E7D32",
  sold: "#D32F2F",
  inactive: "#D32F2F",

  // Edit and Delete
  edit: "#2E7D32",
  delete: "#D32F2F",
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  title: 28,
} as const;

export const FontWeight = {
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
  heavy: "800" as const,
};
