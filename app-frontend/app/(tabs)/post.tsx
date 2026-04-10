import React, { useEffect, useMemo, useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { Toast } from "react-native-toast-message-ts";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import ChipSelect from "@/components/common/ChipSelect";
import PhotoUploader from "@/components/listing/PhotoUploader";
import { createListing, getCategories, type Category } from "@/services/listing";
import AuthButton from "@/components/auth/AuthButton";

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
  const [locationName, setLocationName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

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
    setLocationName("");
    setDescription("");
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        Toast.show({ type: "error", text1: "Category Error", text2: (err as Error).message });
      }
    })();
  }, []);

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
        harvestDate: harvestDate ? new Date(harvestDate).toISOString() : undefined,
        availableFrom: availableFrom ? new Date(availableFrom).toISOString() : undefined,
        photos,
        locationName: locationName.trim() || undefined,
        description: description.trim() || undefined,
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
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      bottomOffset={24}
    >
      <Text style={styles.title}>Post Produce</Text>
      <Text style={styles.subtitle}>Create a new listing for buyers</Text>

      <Field label="Crop Name *">
        <TextInput
          value={cropName}
          onChangeText={setCropName}
          placeholder="e.g. Wheat"
          style={styles.input}
          placeholderTextColor={Colors.textMuted}
        />
      </Field>

      <Field label="Category">
        <ChipSelect
          options={categories.map((c) => ({ label: c.name, value: c.id }))}
          selected={categoryId ? [categoryId] : []}
          multiple={false}
          onChange={(vals) => setCategoryId(vals[0])}
        />
      </Field>

      <Field label="Quantity *">
        <TextInput
          value={quantity}
          onChangeText={(t) => setQuantity(t.replace(/[^0-9.]/g, ""))}
          placeholder="e.g. 20"
          keyboardType="decimal-pad"
          style={styles.input}
          placeholderTextColor={Colors.textMuted}
        />
      </Field>

      <Field label="Unit">
        <ChipSelect
          options={UNIT_OPTIONS.map((u) => ({ label: u, value: u }))}
          selected={[unit]}
          multiple={false}
          onChange={(vals) => setUnit(vals[0] ?? "kg")}
        />
      </Field>

      <Field label="Price Per Unit (Rs) *">
        <TextInput
          value={pricePerUnit}
          onChangeText={(t) => setPricePerUnit(t.replace(/[^0-9.]/g, ""))}
          placeholder="e.g. 2500"
          keyboardType="decimal-pad"
          style={styles.input}
          placeholderTextColor={Colors.textMuted}
        />
      </Field>

      <Field label="Quality Grade">
        <ChipSelect
          options={GRADE_OPTIONS.map((g) => ({ label: g, value: g }))}
          selected={grade ? [grade] : []}
          multiple={false}
          onChange={(vals) => setGrade(vals[0] ?? "")}
        />
      </Field>

      <Field label="Harvest Date (YYYY-MM-DD)">
        <TextInput
          value={harvestDate}
          onChangeText={setHarvestDate}
          placeholder="2026-04-10"
          style={styles.input}
          placeholderTextColor={Colors.textMuted}
        />
      </Field>

      <Field label="Available From (YYYY-MM-DD)">
        <TextInput
          value={availableFrom}
          onChangeText={setAvailableFrom}
          placeholder="2026-04-12"
          style={styles.input}
          placeholderTextColor={Colors.textMuted}
        />
      </Field>

      <Field label="Photos (up to 5)">
        <PhotoUploader value={photos} onChange={setPhotos} maxCount={5} />
      </Field>

      <Field label="Location">
        <TextInput
          value={locationName}
          onChangeText={setLocationName}
          placeholder="Village, district"
          style={styles.input}
          placeholderTextColor={Colors.textMuted}
        />
      </Field>

      <Field label="Description">
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Add listing details"
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          placeholderTextColor={Colors.textMuted}
        />
      </Field>

      <AuthButton label="Post Listing" loading={loading} onPress={onSubmit} />
      <Pressable style={styles.bottomSpace} />
    </KeyboardAwareScrollView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
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
  content: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 14,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
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
  textArea: {
    minHeight: 94,
    paddingTop: 10,
  },
  bottomSpace: {
    height: 16,
  },
});
