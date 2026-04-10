import React, { forwardRef } from "react";
import { Text, TextInput, View, type TextInputProps } from "react-native";
import { Colors } from "@/constants/colors";

interface AuthInputProps extends TextInputProps {
  label: string;
  prefix?: string;
}

const AuthInput = forwardRef<TextInput, AuthInputProps>(
  ({ label, prefix, style, ...props }, ref) => {
    return (
      <View style={{ marginBottom: 16 }}>
        <Text
          style={{
            fontSize: 13,
            fontWeight: "600",
            color: Colors.textSecondary,
            marginBottom: 6,
            marginLeft: 2,
          }}
        >
          {label}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: Colors.border,
            borderRadius: 12,
            backgroundColor: Colors.surfaceAlt,
            paddingHorizontal: 14,
          }}
        >
          {prefix && (
            <Text
              style={{
                fontSize: 15,
                color: Colors.textSecondary,
                marginRight: 8,
              }}
            >
              {prefix}
            </Text>
          )}
          <TextInput
            ref={ref}
            placeholderTextColor={Colors.textMuted}
            autoCorrect={false}
            style={[
              {
                flex: 1,
                fontSize: 15,
                color: Colors.text,
                paddingVertical: 14,
              },
              style,
            ]}
            {...props}
          />
        </View>
      </View>
    );
  },
);

AuthInput.displayName = "AuthInput";

export default AuthInput;
