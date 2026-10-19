export const HERO_IMAGE = { width: 1649, height: 954, edgeY: 508 }
export const HERO_SCROLL_DISTANCE = 640

export function getHeroGeometry(width: number, height: number, textHeight: number) {
  const scale = Math.max(width / HERO_IMAGE.width, height / HERO_IMAGE.height)
  const edge = (height - HERO_IMAGE.height * scale) / 2 + HERO_IMAGE.edgeY * scale
  const top = Math.max(96, edge - textHeight - Math.min(80, height * 0.08))
  return { edge, top, travel: edge - top + 24 }
}
