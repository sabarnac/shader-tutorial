export const runOnPredicate = (predicate, action) => () =>
  predicate ? action() : undefined

export const areAllNumbers = array =>
  array.filter(num => isNaN(num)).length === 0

export const haveValidVertexGroups = array => array.length === 3

export const chunkArray = (array, chunk_size) =>
  array
    .map((_, i, all) => all.slice(i * chunk_size, (i + 1) * chunk_size))
    .filter(x => x.length)

export const doesArrayChildrenSatisfyPredicate = (array, predicate) =>
  array.filter(predicate).length === array.length

export const glsl = x => x.join("")
