import assert from "node:assert/strict"
import { getHeroGeometry, HERO_IMAGE } from "../lib/hero-geometry.ts"

for (const [width, height, textHeight] of [[1440, 900, 238], [1440, 810, 238], [360, 780, 104], [390, 844, 112], [844, 390, 100]]) {
  const { edge, top, travel } = getHeroGeometry(width, height, textHeight)
  const scale = Math.max(width / HERO_IMAGE.width, height / HERO_IMAGE.height)
  const svgEdge = (height - HERO_IMAGE.height * scale) / 2 + 508 * scale
  assert.equal(edge, svgEdge, "Text geometry and foreground must use the same cover projection")
  assert.ok(top + textHeight < edge, "The initial title must be fully above the partition")
  const contact = (edge - top - textHeight) / travel
  assert.ok(contact > 0 && contact < 1, "Contact must happen during the scroll")
  assert.ok(top + contact * travel + textHeight <= edge + 0.001, "Nothing is clipped before contact")
  assert.ok(top + travel > edge, "All text must finish below the partition edge")
}
console.log("Hero cover projection and contact checks passed")
