// Full-size photos, shown on the item page.
const modules = import.meta.glob('../assets/img/catalogue/*.webp', { eager: true })
// Small versions for the grid and the homepage carousel (see scripts/gen-thumbs.mjs).
// The `*` above never crosses a slash, so these subfolder files aren't picked up twice.
const thumbModules = import.meta.glob('../assets/img/catalogue/thumbs/*.webp', { eager: true })

const items = {}

const parse = (path) => {
  const filename = path.split('/').pop().replace('.webp', '')
  const [color, code, num] = filename.split('_')
  return { id: `${color}_${code}`, color, code, index: parseInt(num) - 1 }
}

const ensure = ({ id, color, code }) => {
  if (!items[id]) items[id] = { id, color, code, photos: [], thumbs: [] }
  return items[id]
}

for (const [path, mod] of Object.entries(modules)) {
  const info = parse(path)
  ensure(info).photos[info.index] = mod.default
}

for (const [path, mod] of Object.entries(thumbModules)) {
  const info = parse(path)
  ensure(info).thumbs[info.index] = mod.default
}

// Fall back to the full photo if a thumb hasn't been generated yet
for (const item of Object.values(items)) {
  item.photos.forEach((src, i) => {
    if (!item.thumbs[i]) item.thumbs[i] = src
  })
}

export const catalogue = Object.values(items)
