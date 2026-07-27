// Generates small versions of the catalogue photos for the grid and the
// homepage carousel, which display them at ~300-400px but were loading the
// full-size originals (400-500 KB each).
//
// Output goes to catalogue/thumbs/ — a subfolder, so it stays out of the
// `catalogue/*.webp` glob in src/data/catalogue.js (a single * never crosses
// a slash), otherwise the thumbs would be picked up as extra catalogue photos.
//
// Run with: npm run thumbs
import sharp from "sharp"
import fs from "fs/promises"
import path from "path"

const SRC = "src/assets/img/catalogue"
const OUT = path.join(SRC, "thumbs")
const WIDTH = 700 // covers a 350px slot at 2x DPR

const files = (await fs.readdir(SRC)).filter(f => f.endsWith(".webp"))
await fs.mkdir(OUT, { recursive: true })

let made = 0, skipped = 0, bytesIn = 0, bytesOut = 0

for (const file of files) {
  const from = path.join(SRC, file)
  const to = path.join(OUT, file)

  const srcStat = await fs.stat(from)
  // Skip if an up-to-date thumb already exists
  try {
    const outStat = await fs.stat(to)
    if (outStat.mtimeMs >= srcStat.mtimeMs) {
      skipped++
      bytesIn += srcStat.size
      bytesOut += outStat.size
      continue
    }
  } catch { /* not generated yet */ }

  await sharp(from)
    .resize({ width: WIDTH, withoutEnlargement: true })
    .webp({ quality: 72 })
    .toFile(to)

  const outStat = await fs.stat(to)
  bytesIn += srcStat.size
  bytesOut += outStat.size
  made++
}

// Remove thumbs whose source photo no longer exists (e.g. after a rename)
const sources = new Set(files)
let removed = 0
for (const thumb of await fs.readdir(OUT)) {
  if (thumb.endsWith(".webp") && !sources.has(thumb)) {
    await fs.unlink(path.join(OUT, thumb))
    removed++
  }
}

const mb = n => (n / 1048576).toFixed(1)
console.log(`thumbs: ${made} geradas, ${skipped} já actualizadas, ${removed} órfãs removidas`)
console.log(`originais ${mb(bytesIn)} MB -> thumbs ${mb(bytesOut)} MB`)
