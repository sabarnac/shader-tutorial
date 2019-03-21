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
  `{ ${coordMap.x}: ${coord[0]}, ${coordMap.y}: ${coord[1]}, ${coordMap.z}: ${
    coord[2]
  } }`
