import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Toast } from "react-native-toast-message-ts";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/colors";
import { uploadListingPhoto } from "@/services/listing";

type Props = {
  value: string[];
  onChange: (urls: string[]) => void;
  maxCount?: number;
};

export default function PhotoUploader({ value, onChange, maxCount = 5 }: Props) {
  const [uploading, setUploading] = useState(false);

  const onPick = async () => {
    if (value.length >= maxCount) {
      Toast.show({
        type: "warning",
        text1: "Limit Reached",
        text2: `You can upload up to ${maxCount} photos`,
      });
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Toast.show({
        type: "warning",
        text1: "Permission Required",
        text2: "Allow gallery access to upload photos",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.85,
    });

    if (result.canceled || !result.assets?.[0]?.uri) return;

    setUploading(true);
    try {
      const url = await uploadListingPhoto(result.assets[0].uri);
      onChange([...value, url]);
      Toast.show({ type: "success", text1: "Uploaded", text2: "Photo uploaded" });
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Upload Failed",
        text2: (err as Error).message,
      });
    } finally {
      setUploading(false);
    }
  };

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <View>
      <View style={styles.grid}>
        {value.map((url, index) => (
          <View key={`${url}-${index}`} style={styles.thumbWrap}>
            <Image source={{ uri: url }} style={styles.thumb} contentFit="cover" />
            <Pressable style={styles.removeBtn} onPress={() => removeAt(index)}>
              <Ionicons name="close" size={14} color={Colors.textOnPrimary} />
            </Pressable>
          </View>
        ))}

        {Array.from({ length: Math.max(0, Math.min(3, maxCount - value.length)) }).map((_, i) => (
          <Pressable
            key={`empty-${i}`}
            style={[styles.emptySlot, uploading && { opacity: 0.6 }]}
            onPress={onPick}
            disabled={uploading}
          >
            <Ionicons name={uploading && i === 0 ? "time-outline" : "add"} size={20} color={Colors.textMuted} />
          </Pressable>
        ))}
      </View>

      <Text style={styles.hint}>{uploading ? "Uploading photo..." : `Photos ${value.length}/${maxCount}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  thumbWrap: {
    width: 92,
    height: 92,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptySlot: {
    width: 92,
    height: 92,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: "dashed",
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  thumb: {
    width: "100%",
    height: "100%",
  },
  removeBtn: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  hint: {
    marginTop: 6,
    fontSize: 12,
    color: Colors.textMuted,
  },
});
