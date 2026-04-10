import { prisma } from "../../lib/prisma";

const categories = [
  { name: "Vegetables", icon: "leaf-outline" },
  { name: "Fruits", icon: "nutrition-outline" },
  { name: "Grains", icon: "apps-outline" },
  { name: "Pulses", icon: "albums-outline" },
  { name: "Spices", icon: "flame-outline" },
  { name: "Oilseeds", icon: "water-outline" },
  { name: "Others", icon: "ellipsis-horizontal-outline" },
];

async function run() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: { icon: category.icon },
      create: category,
    });
  }

  console.log("Category seed complete");
}

run()
  .catch((err) => {
    console.error("Category seed failed", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
