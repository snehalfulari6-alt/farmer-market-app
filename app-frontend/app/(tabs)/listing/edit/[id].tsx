import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Toast } from "react-native-toast-message-ts";
import { Colors } from "@/constants/colors";
import ChipSelect from "@/components/common/ChipSelect";
import AuthButton from "@/components/auth/AuthButton";
import PhotoUploader from "@/components/listing/PhotoUploader";
import {
  getCategories,
  getListingById,
  updateListing,
  type Category,
} from "@/services/listing";

const UNIT_OPTIONS = ["kg", "quintal", "ton"];
const GRADE_OPTIONS = ["A", "B", "C"];

export default function EditListingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [cropName, setCropName] = useState("");
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

  useEffect(() => {
    (async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [cats, listing] = await Promise.all([getCategories(), getListingById(id)]);

        setCategories(cats);
        setCropName(listing.cropName || "");
        setCategoryId(listing.categoryId ?? undefined);
        setQuantity(String(listing.quantity ?? ""));
        setUnit(listing.unit || "kg");
        setPricePerUnit(String(listing.pricePerUnit ?? ""));
        setGrade(listing.grade ?? "");
        setHarvestDate(listing.harvestDate ? listing.harvestDate.slice(0, 10) : "");
        setAvailableFrom(listing.availableFrom ? listing.availableFrom.slice(0, 10) : "");
        setPhotos(listing.photos ?? []);
        setLocationName(listing.locationName ?? "");
        setDescription(listing.description ?? "");
      } catch (err) {
        Toast.show({
          type: "error",
          text1: "Load Failed",
          text2: (err as Error).message,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const canSave = useMemo(() => {
    return (
      !!cropName.trim() &&
      !!quantity.trim() &&
      !!pricePerUnit.trim() &&
      Number(quantity) > 0 &&
      Number(pricePerUnit) > 0 &&
      !saving
    );
  }, [cropName, quantity, pricePerUnit, saving]);

  const onSave = async () => {
    if (!id) return;
    Keyboard.dismiss();

    if (!canSave) {
      Toast.show({
        type: "warning",
        text1: "Missing Fields",
        text2: "Crop, quantity and price are required",
      });
      return;
    }

    setSaving(true);
    try {
      await updateListing(id, {
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

      Toast.show({ type: "success", text1: "Updated", text2: "Listing updated successfully" });
      router.replace({ pathname: "/(tabs)/listing/[id]", params: { id } } as any);
    } catch (err) {
      Toast.show({ type: "error", text1: "Update Failed", text2: (err as Error).message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderWrap}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      bottomOffset={24}
    >
      <Text style={styles.title}>Edit Listing</Text>
      <Text style={styles.subtitle}>Update details based on current stock and pricing</Text>

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

      <Field label="Photos">
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

      <AuthButton label="Save Changes" loading={saving} onPress={onSave} />
      <View style={{ height: 18 }} />
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
    paddingHorizontal: 18,
    paddingBottom: 20,
  },
  loaderWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 14,
    color: Colors.textSecondary,
    fontSize: 14,
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
});
