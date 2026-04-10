import React, { useEffect, useMemo, useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Dropdown } from "react-native-element-dropdown";
import { router } from "expo-router";
import { Toast } from "react-native-toast-message-ts";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import PhotoUploader from "@/components/listing/PhotoUploader";
import AuthButton from "@/components/auth/AuthButton";
import {
  createListing,
  getCategories,
  type Category,
} from "@/services/listing";

const UNIT_OPTIONS = ["kg", "quintal", "ton"];
const GRADE_OPTIONS = ["A", "B", "C"];

export default function PostScreen() {
  const insets = useSafeAreaInsets();
  const [cropName, setCropName] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [grade, setGrade] = useState("");
  const [harvestDate, setHarvestDate] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        Toast.show({
          type: "error",
          text1: "Category Error",
          text2: (err as Error).message,
        });
      }
    })();
  }, []);

  const resetForm = () => {
    setCropName("");
    setCategoryId(undefined);
    setQuantity("");
    setUnit("kg");
    setPricePerUnit("");
    setGrade("");
    setHarvestDate("");
    setAvailableFrom("");
    setPhotos([]);
  };

  const canSubmit = useMemo(() => {
    return (
      !!cropName.trim() &&
      !!quantity.trim() &&
      !!pricePerUnit.trim() &&
      Number(quantity) > 0 &&
      Number(pricePerUnit) > 0 &&
      !loading
    );
  }, [cropName, quantity, pricePerUnit, loading]);

  const categoryOptions = categories.map((c) => ({
    label: c.name,
    value: c.id,
  }));
  const unitOptions = UNIT_OPTIONS.map((u) => ({ label: u, value: u }));

  const onSubmit = async () => {
    Keyboard.dismiss();

    if (!canSubmit) {
      Toast.show({
        type: "warning",
        text1: "Missing Fields",
        text2: "Crop, quantity and price are required",
      });
      return;
    }

    setLoading(true);
    try {
      await createListing({
        cropName: cropName.trim(),
        categoryId,
        quantity: Number(quantity),
        unit,
        pricePerUnit: Number(pricePerUnit),
        grade: grade || undefined,
        harvestDate: harvestDate
          ? new Date(harvestDate).toISOString()
          : undefined,
        availableFrom: availableFrom
          ? new Date(availableFrom).toISOString()
          : undefined,
        photos,
      });

      Toast.show({
        type: "success",
        text1: "Listing Posted",
        text2: "Your produce listing is now live",
      });

      resetForm();
      router.replace("/(tabs)/listings");
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Post Failed",
        text2: (err as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View>
          <Text style={styles.headerTitle}>Post Your Produce</Text>
          <Text style={styles.headerSubtitle}>
            Share your fresh stock with FarmBridge buyers
          </Text>
        </View>
      </View>

      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bottomOffset={24}
      >
        <View style={styles.formCard}>
          <Field label="UPLOAD PHOTOS (up to 5)">
            <PhotoUploader value={photos} onChange={setPhotos} maxCount={5} />
          </Field>

          <Field label="Crop Name">
            <TextInput
              value={cropName}
              onChangeText={setCropName}
              placeholder="Search or Select Crop"
              style={styles.input}
              placeholderTextColor={Colors.textMuted}
            />
          </Field>

          <Field label="Category">
            <Dropdown
              style={styles.dropdown}
              containerStyle={styles.dropdownContainer}
              placeholderStyle={styles.placeholderText}
              selectedTextStyle={styles.selectedText}
              itemTextStyle={styles.dropdownItemText}
              data={categoryOptions}
              labelField="label"
              valueField="value"
              placeholder="Select Category"
              value={categoryId}
              onChange={(item) => setCategoryId(item.value)}
            />
          </Field>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Quantity</Text>
              <TextInput
                value={quantity}
                onChangeText={(t) => setQuantity(t.replace(/[^0-9.]/g, ""))}
                placeholder="e.g. 500"
                keyboardType="decimal-pad"
                style={styles.input}
                placeholderTextColor={Colors.textMuted}
              />
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Unit</Text>
              <Dropdown
                style={styles.dropdown}
                containerStyle={styles.dropdownContainer}
                placeholderStyle={styles.placeholderText}
                selectedTextStyle={styles.selectedText}
                itemTextStyle={styles.dropdownItemText}
                data={unitOptions}
                labelField="label"
                valueField="value"
                placeholder="kg"
                value={unit}
                onChange={(item) => setUnit(item.value)}
              />
            </View>
          </View>

          <Field label="Price per Unit (Rs)">
            <TextInput
              value={pricePerUnit}
              onChangeText={(t) => setPricePerUnit(t.replace(/[^0-9.]/g, ""))}
              placeholder="Enter price"
              keyboardType="decimal-pad"
              style={styles.input}
              placeholderTextColor={Colors.textMuted}
            />
          </Field>

          <Field label="Quality Grade">
            <View style={styles.gradeRow}>
              {GRADE_OPTIONS.map((g) => {
                const active = grade === g;
                return (
                  <Pressable
                    key={g}
                    style={[styles.gradeBtn, active && styles.gradeBtnActive]}
                    onPress={() => setGrade(g)}
                  >
                    <Text
                      style={[
                        styles.gradeText,
                        active && styles.gradeTextActive,
                      ]}
                    >
                      Grade {g}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Field>

          <Field label="Harvest Date">
            <TextInput
              value={harvestDate}
              onChangeText={setHarvestDate}
              placeholder="DD / MM / YYYY"
              style={styles.input}
              placeholderTextColor={Colors.textMuted}
            />
          </Field>

          <Field label="Available From Date">
            <TextInput
              value={availableFrom}
              onChangeText={setAvailableFrom}
              placeholder="DD / MM / YYYY"
              style={styles.input}
              placeholderTextColor={Colors.textMuted}
            />
          </Field>

          <AuthButton
            label="Post Listing"
            loading={loading}
            onPress={onSubmit}
          />
          <View style={{ height: 16 }} />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 18,
    paddingBottom: 22,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  headerBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 23,
    fontWeight: "800",
    color: Colors.textOnPrimary,
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingTop: 10,
    paddingBottom: 24,
  },
  formCard: {
    marginHorizontal: 14,
    backgroundColor: Colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  field: {
    marginBottom: 11,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 11,
  },
  col: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    minHeight: 46,
    color: Colors.textPrimary,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    minHeight: 46,
    paddingHorizontal: 12,
  },
  dropdownContainer: {
    borderRadius: 12,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  dropdownItemText: {
    color: Colors.textPrimary,
    fontSize: 14,
  },
  placeholderText: {
    color: Colors.textMuted,
    fontSize: 15,
  },
  selectedText: {
    color: Colors.textPrimary,
    fontSize: 15,
  },
  gradeRow: {
    flexDirection: "row",
    gap: 8,
  },
  gradeBtn: {
    flex: 1,
    minHeight: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  gradeBtnActive: {
    backgroundColor: "#BDBDBD",
    borderColor: "#BDBDBD",
  },
  gradeText: {
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: "700",
  },
  gradeTextActive: {
    color: Colors.surface,
  },
});
