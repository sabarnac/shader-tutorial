const fs = require("fs")

const modelFile = fs.readFileSync(process.argv[2], "utf-8")

const options = [...process.argv].filter((_, i) => i > 2)

const positions = []
const uvs = []
const normals = []
const faces = []

modelFile.split("\n").forEach((line) =>
  line.startsWith("v ")
    ? positions.push(
        line
          .replaceAll(/^v /g, "")
          .split(" ")
          .map((val) => parseFloat(val))
      )
    : line.startsWith("vt ")
    ? uvs.push(
        line
          .replaceAll(/^vt /g, "")
          .split(" ")
          .map((val) => parseFloat(val))
      )
    : line.startsWith("vn ")
    ? normals.push(
        line
          .replaceAll(/^vn /g, "")
          .split(" ")
          .map((val) => parseFloat(val))
      )
    : line.startsWith("f ")
    ? faces.push(
        line
          .replaceAll(/^f /g, "")
          .split(" ")
          .map((vertex) =>
            vertex
              .split("/")
              .map((id) => (id !== "" ? parseInt(id) - 1 : undefined))
          )
      )
    : undefined
)

const vertices = faces.flat(1).map(([positionId, uvId, normalId]) => ({
  position: positionId !== undefined ? positions[positionId] : undefined,
  uv: uvId !== undefined ? uvs[uvId] : undefined,
  normal: normalId !== undefined ? normals[normalId] : undefined,
}))

if (options.contains("--optimize")) {
  const uniqueVertices = new Map()
  const indices = vertices.map(
    (vertex) =>
      uniqueVertices.get(JSON.stringify(vertex)) ||
      (uniqueVertices.set(JSON.stringify(vertex), uniqueVertices.size) &&
        uniqueVertices.get(JSON.stringify(vertex)))
  )

  const finalVertices = Array.from(uniqueVertices.keys()).map((key) =>
    JSON.parse(key)
  )

  fs.writeFileSync(
    "output.json",
    JSON.stringify({
      vertices: finalVertices.map(({ position }) => position),
      uvs: finalVertices.map(({ uv }) => uv),
      normals: finalVertices.map(({ normal }) => normal),
      indices,
    })
  )
} else {
  fs.writeFileSync(
    "output.json",
    JSON.stringify({
      vertices: vertices.map(({ position }) => position),
      uvs: vertices.map(({ uv }) => uv),
      normals: vertices.map(({ normal }) => normal),
      indices: vertices.map((_, i) => i),
    })
  )
}
