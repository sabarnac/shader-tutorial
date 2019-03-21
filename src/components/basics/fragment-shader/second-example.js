import React, { useCallback, useState, useEffect } from "react"
import WebGlWrapper from "../../webgl-wrapper"
import { runOnPredicate, chunkArray, coordArrToString } from "../../util"
import {
  secondVertexShaderSource,
  secondFragmentShaderSource,
} from "./second-example-shaders"
import { mat4 } from "gl-matrix"

const shaderProgramInfo = {
  vertex: {
    attributeLocations: {
      vertexPosition: "vec4",
      vertexColor: "vec3",
    },
    uniformLocations: {
      modelMatrix: "mat4",
      viewMatrix: "mat4",
      projectionMatrix: "mat4",
    },
  },
  fragment: {
    attributeLocations: {},
    uniformLocations: {},
  },
}

const triangleModelPosition = mat4.create()

const FragmentShaderSecondExample = () => {
  const triangle = {
    vertices: [0.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0],
    colors: [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0],
  }
  const [webGlRef, updateWebGlRef] = useState(null)
  const [shaderProgram, updateShaderProgram] = useState(null)
  const [shaderInfo, updateShaderInfo] = useState(null)
  const [triangleBuffer, updateTriangleBuffer] = useState({
    vertices: null,
    colors: null,
  })

  const canvasRef = useCallback(canvas => {
    if (canvas !== null && webGlRef === null) {
      updateWebGlRef(new WebGlWrapper(canvas, triangleModelPosition))
    }
  }, [])

  useEffect(
    runOnPredicate(webGlRef !== null, () => {
      updateShaderProgram(
        webGlRef.createShaderProgram(
          secondVertexShaderSource,
          secondFragmentShaderSource
        )
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
      updateTriangleBuffer({
        vertices: webGlRef.createStaticDrawArrayBuffer(
          triangle.vertices,
          triangleBuffer.vertices
        ),
        colors: webGlRef.createStaticDrawArrayBuffer(
          triangle.colors,
          triangleBuffer.colors
        ),
      })
    }),
    [shaderInfo]
  )

  useEffect(
    runOnPredicate(
      triangleBuffer.vertices !== null && triangleBuffer.colors !== null,
      () => {
        webGlRef.renderScene(
          ({ gl, projectionMatrix, viewMatrix, modelMatrix }) => {
            gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer.vertices)
            gl.vertexAttribPointer(
              shaderInfo.vertex.attributeLocations.vertexPosition,
              3,
              gl.FLOAT,
              false,
              0,
              0
            )
            gl.enableVertexAttribArray(
              shaderInfo.vertex.attributeLocations.vertexPosition
            )

            gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer.colors)
            gl.vertexAttribPointer(
              shaderInfo.vertex.attributeLocations.vertexColor,
              3,
              gl.FLOAT,
              false,
              0,
              0
            )
            gl.enableVertexAttribArray(
              shaderInfo.vertex.attributeLocations.vertexColor
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
            gl.uniformMatrix4fv(
              shaderInfo.vertex.uniformLocations.modelMatrix,
              false,
              modelMatrix
            )

            gl.drawArrays(gl.TRIANGLES, 0, triangle.vertices.length / 3)
          }
        )
      }
    ),
    [triangleBuffer]
  )

  const vertices = chunkArray(triangle.vertices, 3)
  const colors = chunkArray(triangle.colors, 3)
  const colorCoordMap = { x: "r", y: "g", z: "b" }

  return (
    <div className="util text-center" style={{ padding: "1rem" }}>
      <canvas width="640" height="480" ref={canvasRef} />
      <pre>
        {`
Vertex 1: ${coordArrToString(vertices[0])}
Vertex 2: ${coordArrToString(vertices[1])}
Vertex 3: ${coordArrToString(vertices[2])}
`.trim()}
      </pre>
      <pre>
        {`
Vertex 1 Color: ${coordArrToString(colors[0], colorCoordMap)}
Vertex 2 Color: ${coordArrToString(colors[1], colorCoordMap)}
Vertex 3 Color: ${coordArrToString(colors[2], colorCoordMap)}
`.trim()}
      </pre>
    </div>
  )
}

export default FragmentShaderSecondExample
