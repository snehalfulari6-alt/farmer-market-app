import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Toast } from "react-native-toast-message-ts";
import { Colors } from "@/constants/colors";
import AuthButton from "@/components/auth/AuthButton";
import AuthInput from "@/components/auth/AuthInput";
import { createFarmerProfile, uploadImage } from "@/services/profile";
import { useAuth } from "@/contexts/auth-context";

const CROP_OPTIONS = [
  "Wheat",
  "Rice",
  "Corn",
  "Barley",
  "Millet",
  "Jowar",
  "Bajra",
  "Ragi",
  "Tomato",
  "Onion",
  "Potato",
  "Cabbage",
  "Cauliflower",
  "Brinjal",
  "Chilli",
  "Okra",
  "Carrot",
  "Peas",
  "Sugarcane",
  "Cotton",
  "Soybean",
  "Mustard",
  "Groundnut",
  "Sunflower",
  "Turmeric",
  "Ginger",
  "Garlic",
  "Banana",
  "Mango",
  "Grapes",
  "Pomegranate",
  "Apple",
  "Orange",
  "Papaya",
  "Guava",
  "Lentil",
  "Chickpea",
  "Pigeon Pea",
  "Black Gram",
  "Green Gram",
];

export default function FarmerRegistrationScreen() {
  const { refreshProfile } = useAuth();
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [pincode, setPincode] = useState("");
  const [village, setVillage] = useState("");
  const [cropTypes, setCropTypes] = useState<string[]>([]);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(
    () =>
      !!state.trim() &&
      !!district.trim() &&
      /^\d{6}$/.test(pincode.trim()) &&
      cropTypes.length > 0 &&
      !isUploading &&
      !isSubmitting,
    [state, district, pincode, cropTypes.length, isUploading, isSubmitting],
  );

  const toggleCrop = (crop: string) => {
    setCropTypes((current) =>
      current.includes(crop)
        ? current.filter((item) => item !== crop)
        : [...current, crop],
    );
  };

  const pickProfilePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Toast.show({
        type: "warning",
        text1: "Permission Required",
        text2: "Please allow gallery access to upload profile photo",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.[0]?.uri) {
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadImage(result.assets[0].uri);
      setProfilePhoto(url);
      Toast.show({
        type: "success",
        text1: "Uploaded",
        text2: "Profile photo uploaded successfully",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Upload Failed",
        text2: (error as Error).message,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async () => {
    if (!canSubmit) {
      Toast.show({
        type: "warning",
        text1: "Incomplete Form",
        text2: "State, district, pincode and crop type are required",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createFarmerProfile({
        state: state.trim(),
        district: district.trim(),
        pincode: pincode.trim(),
        village: village.trim() || undefined,
        cropTypes,
        profilePhoto: profilePhoto ?? undefined,
      });

      Toast.show({
        type: "success",
        text1: "Registration Complete",
        text2: "Your farmer profile has been created",
      });

      await refreshProfile();
      router.replace("/(auth)/account-created");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Registration Failed",
        text2: (error as Error).message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Farmer Registration</Text>
        <Text style={styles.subtitle}>Complete your profile to continue</Text>

        <View style={styles.inputWrap}>
          <Text style={styles.inputLabel}>State</Text>
          <TextInput
            value={state}
            onChangeText={setState}
            placeholder="Enter your state"
            placeholderTextColor={Colors.textMuted}
            style={styles.input}
          />
        </View>

        <View style={styles.inputWrap}>
          <Text style={styles.inputLabel}>District</Text>
          <TextInput
            value={district}
            onChangeText={setDistrict}
            placeholder="Enter your district"
            placeholderTextColor={Colors.textMuted}
            style={styles.input}
          />
        </View>

        <View style={styles.inputWrap}>
          <Text style={styles.inputLabel}>Pincode</Text>
          <TextInput
            value={pincode}
            onChangeText={(value) => setPincode(value.replace(/[^0-9]/g, ""))}
            placeholder="6-digit pincode"
            placeholderTextColor={Colors.textMuted}
            keyboardType="number-pad"
            maxLength={6}
            style={styles.input}
          />
        </View>

        <AuthInput
          label="Village (Optional)"
          value={village}
          onChangeText={setVillage}
          placeholder="Enter village name"
        />

        <Text style={styles.sectionLabel}>Crop Types</Text>
        <View style={styles.optionWrap}>
          {CROP_OPTIONS.map((crop) => {
            const selected = cropTypes.includes(crop);
            return (
              <Pressable
                key={crop}
                style={[styles.optionChip, selected && styles.optionChipActive]}
                onPress={() => toggleCrop(crop)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selected && styles.optionTextActive,
                  ]}
                >
                  {crop}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          onPress={pickProfilePhoto}
          style={styles.photoButton}
          disabled={isUploading}
        >
          <Text style={styles.photoButtonText}>
            {isUploading
              ? "Uploading photo..."
              : profilePhoto
                ? "Change Profile Photo"
                : "Upload Profile Photo"}
          </Text>
        </Pressable>

        <AuthButton
          label="Complete Registration"
          loading={isSubmitting}
          onPress={onSubmit}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 20,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textSecondary,
    marginBottom: 8,
    marginTop: 4,
  },
  optionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
  },
  optionChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  optionChipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySurface,
  },
  optionText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  optionTextActive: {
    color: Colors.primary,
  },
  inputWrap: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 6,
    marginLeft: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    minHeight: 48,
    color: Colors.textPrimary,
    backgroundColor: Colors.surface,
    fontSize: 15,
  },
  photoButton: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 12,
    minHeight: 46,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primarySurface,
    marginBottom: 8,
  },
  photoButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.primary,
  },
});
