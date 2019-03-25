import React, { useCallback, useState, useEffect } from "react"
import WebGlWrapper from "../../webgl-wrapper"
import { runOnPredicate, coordArrToString } from "../../util"
import {
  thirdVertexShaderSource,
  thirdFragmentShaderSource,
} from "./third-example-shaders"
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
    uniformLocations: {
      colorShift: "float",
    },
  },
}

const triangleModelPosition = mat4.create()

const FragmentShaderThirdExample = () => {
  const triangle = {
    vertices: [[0.0, 1.0, 0.0], [-1.0, -1.0, 0.0], [1.0, -1.0, 0.0]],
    colors: [[1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0]],
  }
  const [webGlRef, updateWebGlRef] = useState(null)
  const [shaderProgram, updateShaderProgram] = useState(null)
  const [shaderInfo, updateShaderInfo] = useState(null)
  const [triangleBuffer, updateTriangleBuffer] = useState({
    vertices: null,
    colors: null,
  })
  const [shouldRender, updateShouldRender] = useState(true)
  const [colorShift, updateColorShift] = useState(0)

  const canvasRef = useCallback(canvas => {
    if (canvas !== null && webGlRef === null) {
      updateWebGlRef(new WebGlWrapper(canvas, triangleModelPosition))
    }
  }, [])

  useEffect(
    runOnPredicate(webGlRef !== null, () => {
      updateShaderProgram(
        webGlRef.createShaderProgram(
          thirdVertexShaderSource,
          thirdFragmentShaderSource
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
          triangle.vertices.flat(),
          triangleBuffer.vertices
        ),
        colors: webGlRef.createStaticDrawArrayBuffer(
          triangle.colors.flat(),
          triangleBuffer.colors
        ),
      })
    }),
    [shaderInfo]
  )

  useEffect(
    runOnPredicate(triangleBuffer.vertices !== null, () => {
      updateShouldRender(true)
      let then = parseInt(performance.now().toString())

      const renderScene = () => {
        webGlRef.renderScene(
          ({ gl, projectionMatrix, viewMatrix, modelMatrix }) => {
            if (!shouldRender) {
              return
            }

            const time = parseInt(performance.now().toString())

            const timeSlice = time % 4000
            const colorShift =
              1 - (timeSlice >= 2000 ? 4000 - timeSlice : timeSlice) / 1000

            if (time - then > 100) {
              then = time
              updateColorShift(colorShift)
            }

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
            gl.uniform1f(
              shaderInfo.fragment.uniformLocations.colorShift,
              colorShift
            )

            gl.drawArrays(gl.TRIANGLES, 0, triangle.vertices.length)

            requestAnimationFrame(renderScene)
          }
        )
      }
      requestAnimationFrame(renderScene)

      return () => updateShouldRender(false)
    }),
    [triangleBuffer]
  )

  const colorCoordMap = { x: "r", y: "g", z: "b" }

  return (
    <div className="util text-center" style={{ padding: "1rem" }}>
      <canvas width="640" height="480" ref={canvasRef} />
      <pre>
        {`
Vertex 1: ${coordArrToString(triangle.vertices[0])}
Vertex 2: ${coordArrToString(triangle.vertices[1])}
Vertex 3: ${coordArrToString(triangle.vertices[2])}
`.trim()}
      </pre>
      <pre>
        {`
Vertex 1 Color: ${coordArrToString(triangle.colors[0], colorCoordMap)}
Vertex 2 Color: ${coordArrToString(triangle.colors[1], colorCoordMap)}
Vertex 3 Color: ${coordArrToString(triangle.colors[2], colorCoordMap)}
`.trim()}
      </pre>
      <pre>Color Shift: {colorShift.toFixed(6)}</pre>
    </div>
  )
}

export default FragmentShaderThirdExample
