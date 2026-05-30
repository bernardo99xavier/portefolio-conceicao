const modules = import.meta.glob('../assets/img/catalogue/*.webp', { eager: true })

const items = {}

for (const [path, mod] of Object.entries(modules)) {
  const filename = path.split('/').pop().replace('.webp', '')
  const [color, code, num] = filename.split('_')
  const id = `${color}_${code}`

  if (!items[id]) {
    items[id] = { id, color, code, photos: [] }
  }
  items[id].photos[parseInt(num) - 1] = mod.default
}

export const catalogue = Object.values(items)
