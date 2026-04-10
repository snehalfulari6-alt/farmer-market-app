const fs = require("fs");
const path = require("path");

const colorsFile = fs.readFileSync(
  path.join(__dirname, "constants", "colors.ts"),
  "utf8",
);

const colors = Object.fromEntries(
  [...colorsFile.matchAll(/^\s*(\w+):\s*"([^"]+)"/gm)].map(
    ([, name, value]) => [name, value],
  ),
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors,
    },
  },
  plugins: [],
};
