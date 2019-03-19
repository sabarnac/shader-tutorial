import React, { useCallback, useState, useEffect } from "react"
import WebGlWrapper from "../../webgl-wrapper"
import {
  areAllNumbers,
  haveValidVertexGroups,
  runOnPredicate,
} from "../../util"

const vertexShaderSource = `
attribute vec4 vertexPosition;

uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

void main() {
  gl_Position = projectionMatrix * viewMatrix * vertexPosition;
}
`

const fragmentShaderSource = `
void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`

const shaderProgramInfo = {
  vertex: {
    attributeLocations: {
      vertexPosition: "vec4",
    },
    uniformLocations: {
      viewMatrix: "mat4",
      projectionMatrix: "mat4",
    },
  },
  fragment: {
    attributeLocations: {},
    uniformLocations: {},
  },
}

const VertexShaderFirstExample = () => {
  const [trianglePositions, updateTrianglePositions] = useState({
    positions: [0.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0],
    perVertex: 3,
  })
  const [tempTrianglePositions, updateTemp] = useState(
    JSON.stringify(trianglePositions.positions)
  )
  const [webGlRef, updateWebGlRef] = useState(null)
  const [shaderProgram, updateShaderProgram] = useState(null)
  const [shaderInfo, updateShaderInfo] = useState(null)
  const [triangleBuffer, updateTriangleBuffer] = useState(null)

  const canvasRef = useCallback(canvas => {
    if (canvas !== null && webGlRef === null) {
      updateWebGlRef(new WebGlWrapper(canvas))
    }
  })

  useEffect(
    runOnPredicate(webGlRef !== null, () => {
      updateShaderProgram(
        webGlRef.createShaderProgram(vertexShaderSource, fragmentShaderSource)
      )
    }),
    [webGlRef]
  )

  useEffect(
    runOnPredicate(shaderProgram !== null, () => {
      updateShaderInfo(
        webGlRef.getDataLocations(shaderProgram, shaderProgramInfo)
      )
    }),
    [shaderProgram]
  )

  useEffect(
    runOnPredicate(shaderInfo !== null, () => {
      updateTriangleBuffer(
        webGlRef.createStaticDrawArrayBuffer(
          trianglePositions.positions,
          triangleBuffer
        )
      )
    }),
    [shaderInfo, trianglePositions]
  )

  useEffect(
    runOnPredicate(triangleBuffer !== null, () => {
      webGlRef.renderScene(({ gl, projectionMatrix, viewMatrix }) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer)
        gl.vertexAttribPointer(
          shaderInfo.vertex.attributeLocations.vertexPosition,
          trianglePositions.perVertex,
          gl.FLOAT,
          false,
          0,
          0
        )
        gl.enableVertexAttribArray(
          shaderInfo.vertex.attributeLocations.vertexPosition
        )

        gl.useProgram(shaderProgram)

        gl.uniformMatrix4fv(
          shaderInfo.vertex.uniformLocations.projectionMatrix,
          false,
          projectionMatrix
        )
        gl.uniformMatrix4fv(
          shaderInfo.vertex.uniformLocations.viewMatrix,
          false,
          viewMatrix
        )

        console.log(trianglePositions.positions, trianglePositions.perVertex)
        console.log(
          trianglePositions.positions.length / trianglePositions.perVertex
        )
        gl.drawArrays(
          gl.LINE_LOOP,
          0,
          trianglePositions.positions.length / trianglePositions.perVertex
        )
      })
    }),
    [triangleBuffer, trianglePositions]
  )

  return (
    <div className="util text-center" style={{ padding: "1rem" }}>
      <canvas
        id="basics-vertex-shader-1"
        width="640"
        height="480"
        ref={canvasRef}
      />
      <input
        type="text"
        value={tempTrianglePositions}
        onChange={ev => {
          updateTemp(ev.target.value)
          try {
            const newTrianglePositions = JSON.parse(ev.target.value)
            if (
              Array.isArray(newTrianglePositions) &&
              areAllNumbers(newTrianglePositions) &&
              haveValidVertexGroups(newTrianglePositions)
            ) {
              updateTrianglePositions({
                positions: newTrianglePositions,
                perVertex: newTrianglePositions.length % 3 === 0 ? 3 : 2,
              })
            }
          } catch (e) {
            console.error("Cannot accept new input due to error", e)
          }
        }}
      />
    </div>
  )
}

export default VertexShaderFirstExample
