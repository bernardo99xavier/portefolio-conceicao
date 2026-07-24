import { ITEM_INFO } from "./itemInfo"

// Human-facing details for a catalogue item page: title, price, size, spec
// bullets and prose. Data (price/size/sold) comes from the spreadsheet via
// ITEM_INFO; the descriptive copy is built from the piece's attributes and
// translated through the `t` helper passed in by the caller.

// A piece code like "M001" — M = Mala/Bag. Fall back to a neutral noun otherwise.
const typeKeyOf = code => (code.startsWith("M") ? "item.type.mala" : "item.type.peca")

function bodyOf(color, code, info, t) {
  const colorLabel = t(`color.${color}`)
  const type = t(typeKeyOf(code))

  const bullets = [
    t("item.spec.unica"),
    t("item.spec.couro"),
    `${t("item.spec.cor")}: ${colorLabel}`,
  ]
  if (info.size) bullets.push(`${t("item.spec.tamanho")}: ${info.size}`)
  bullets.push(t("item.spec.acabamento"))

  return {
    price: info.price ?? null,
    size: info.size ?? null,
    bullets,
    description: t("item.description", { type }),
  }
}

// Non-sold items with full data, used to fill in blurred detail for sold pieces.
const fillerIds = Object.keys(ITEM_INFO).filter(
  id => !ITEM_INFO[id].sold && ITEM_INFO[id].price != null && ITEM_INFO[id].size,
)

// Stable per-id pick so a sold page always borrows the same filler across builds.
const hash = str => {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h
}

export function getItemDetails(item, t) {
  const info = ITEM_INFO[item.id] || {}
  const title = `${t(typeKeyOf(item.code))} ${t(`color.${item.color}`)}`

  if (info.sold) {
    // No real details for sold pieces — borrow another item's copy, to be blurred.
    const fillerId = fillerIds[hash(item.id) % fillerIds.length]
    const [fColor, fCode] = fillerId.split("_")
    return { title, reference: item.id, sold: true, ...bodyOf(fColor, fCode, ITEM_INFO[fillerId], t) }
  }

  return { title, reference: item.id, sold: false, ...bodyOf(item.color, item.code, info, t) }
}
