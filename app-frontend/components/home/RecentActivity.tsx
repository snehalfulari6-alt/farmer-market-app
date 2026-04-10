import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/colors";

type Props = {
  pending: number;
  active: number;
  completed: number;
};

export default function RecentActivity({ pending, active, completed }: Props) {
  return (
    <View style={styles.row}>
      <Stat label="Pending" value={pending} color={Colors.statusPending} />
      <Stat label="Active" value={active} color={Colors.statusConfirmed} />
      <Stat label="Completed" value={completed} color={Colors.statusDelivered} />
    </View>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  value: {
    fontSize: 18,
    fontWeight: "800",
  },
  label: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
});
