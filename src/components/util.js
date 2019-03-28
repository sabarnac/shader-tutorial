export const runOnPredicate = (predicate, action) => () =>
  predicate ? action() : undefined

export const chunkArray = (array, chunk_size) =>
  array
    .map((_, i, all) => all.slice(i * chunk_size, (i + 1) * chunk_size))
    .filter(x => x.length)

export const glsl = x => x.join("")

export const coordArrToString = (
  coord,
  coordMap = { x: "x", y: "y", z: "z" }
) =>
  `{ ${coordMap.x}: ${coord[0].toFixed(3)}, ${coordMap.y}: ${coord[1].toFixed(
    3
  )}, ${coordMap.z}: ${coord[2].toFixed(3)} }`

export const uvArrToString = (coord, coordMap = { u: "u", v: "v" }) =>
  `{ ${coordMap.u}: ${coord[0].toFixed(3)}, ${coordMap.v}: ${coord[1].toFixed(
    3
  )} }`
