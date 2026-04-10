import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { Colors } from "@/constants/colors";

type Props = {
  photos: string[];
};

export default function PhotoCarousel({ photos }: Props) {
  const items = photos.length > 0 ? photos : ["https://via.placeholder.com/600x400"];

  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {items.map((uri, idx) => (
        <View key={`${uri}-${idx}`} style={styles.slide}>
          <Image source={{ uri }} style={styles.image} contentFit="cover" />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 10,
  },
  slide: {
    width: 320,
    height: 210,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
