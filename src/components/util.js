export const runOnPredicate = (predicate, action) => () =>
  predicate ? action() : undefined

export const areAllNumbers = numbers =>
  numbers.filter(num => isNaN(num)).length === 0

export const haveValidVertexGroups = list =>
  list.length % 3 === 0 || list.length % 2 === 0
