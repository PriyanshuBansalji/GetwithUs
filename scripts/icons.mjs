// Rasterizes src/app/icon.svg into the PNG favicons that Next.js file conventions pick up.
import { readFile } from "node:fs/promises";
import sharp from "sharp";

const SIGNAL = "#2CD5E6";
const source = await readFile("src/app/icon.svg");

await sharp(source, { density: 576 }).resize(32, 32).png().toFile("src/app/icon.png");

// iOS applies its own corner mask, so the apple icon is a full square with no transparent corners.
await sharp(source, { density: 576 })
  .resize(180, 180)
  .flatten({ background: SIGNAL })
  .png()
  .toFile("src/app/apple-icon.png");

process.stdout.write("Wrote src/app/icon.png (32 px) and src/app/apple-icon.png (180 px).\n");
