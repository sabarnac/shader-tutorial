import React, { useCallback, useState, useEffect } from "react"
import WebGlWrapper from "../../webgl-wrapper"
import { runOnPredicate, coordArrToString, uvArrToString } from "../../util"
import {
  firstVertexShaderSource,
  firstFragmentShaderSource,
} from "./first-example-shaders"
import { mat4 } from "gl-matrix"

const shaderProgramInfo = {
  vertex: {
    attributeLocations: {
      vertexPosition: "vec4",
      vertexUv: "vec3",
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

const FragmentShaderFirstExample = () => {
  const cube = {
    vertices: [
      // Front vertices
      [-1.0, -1.0, 1.0],
      [-1.0, 1.0, 1.0],
      [1.0, -1.0, 1.0],
      [1.0, 1.0, 1.0],
      // Back vertices
      [-1.0, -1.0, -1.0],
      [-1.0, 1.0, -1.0],
      [1.0, -1.0, -1.0],
      [1.0, 1.0, -1.0],
    ],
    uv: [
      // Front vertices
      [0.0, 0.0],
      [0.0, 1.0],
      [1.0, 0.0],
      [1.0, 1.0],
    ],
  }
  const [webGlRef, updateWebGlRef] = useState(null)
  const [shaderProgram, updateShaderProgram] = useState(null)
  const [shaderInfo, updateShaderInfo] = useState(null)
  const [cubeBuffer, updateCubeBuffer] = useState({
    vertices: null,
    uv: null,
  })
  const [shouldRender, updateShouldRender] = useState(true)

  const canvasRef = useCallback(canvas => {
    if (canvas !== null && webGlRef === null) {
      updateWebGlRef(new WebGlWrapper(canvas, triangleModelPosition))
    }
  }, [])

  useEffect(
    runOnPredicate(webGlRef !== null, () => {
      updateShaderProgram(
        webGlRef.createShaderProgram(
          firstVertexShaderSource,
          firstFragmentShaderSource
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
      updateCubeBuffer({
        vertices: webGlRef.createStaticDrawArrayBuffer(
          cube.vertices.flat(),
          cubeBuffer.vertices
        ),
        uv: webGlRef.createStaticDrawArrayBuffer(cube.uv.flat(), cubeBuffer.uv),
      })
    }),
    [shaderInfo]
  )

  useEffect(
    runOnPredicate(cubeBuffer.vertices !== null, () => {
      updateShouldRender(true)
      const renderScene = () => {
        webGlRef.renderScene(
          ({ gl, projectionMatrix, viewMatrix, modelMatrix }) => {
            if (!shouldRender) {
              return
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer.vertices)
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

            gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer.uv)
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

            gl.drawArrays(gl.TRIANGLES, 0, cube.vertices.length)

            requestAnimationFrame(renderScene)
          }
        )
      }
      requestAnimationFrame(renderScene)

      return () => updateShouldRender(false)
    }),
    [cubeBuffer]
  )

  return (
    <div className="util text-center" style={{ padding: "1rem" }}>
      <canvas width="640" height="480" ref={canvasRef} />
      <pre>
        {`
Front Vertices:
  Vertex 1: ${coordArrToString(cube.vertices[0])}
  Vertex 2: ${coordArrToString(cube.vertices[1])}
  Vertex 3: ${coordArrToString(cube.vertices[2])}
  Vertex 3: ${coordArrToString(cube.vertices[3])}
Back Vertices:
  Vertex 1: ${coordArrToString(cube.vertices[4])}
  Vertex 2: ${coordArrToString(cube.vertices[5])}
  Vertex 3: ${coordArrToString(cube.vertices[6])}
  Vertex 3: ${coordArrToString(cube.vertices[7])}
`.trim()}
      </pre>
      <pre>
        {`
Vertex 1 UV: ${uvArrToString(cube.uv[0])}
Vertex 2 UV: ${uvArrToString(cube.uv[1])}
Vertex 3 UV: ${uvArrToString(cube.uv[2])}
Vertex 4 UV: ${uvArrToString(cube.uv[3])}
`.trim()}
      </pre>
    </div>
  )
}

export default FragmentShaderFirstExample
