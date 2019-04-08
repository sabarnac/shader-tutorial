import React, { useCallback, useState, useEffect } from "react"
import WebGlWrapper from "../../webgl-wrapper"
import { runOnPredicate, coordArrToString } from "../../util"
import {
  secondVertexShaderSource,
  secondFragmentShaderSource,
} from "./second-example-shaders"
import { mat4 } from "gl-matrix"

const shaderProgramInfo = {
  vertex: {
    attributeLocations: {
      vertexPosition: "vec4",
    },
    uniformLocations: {
      modelMatrix: "mat4",
      viewMatrix: "mat4",
      projectionMatrix: "mat4",
      time: "float",
    },
  },
  fragment: {
    attributeLocations: {},
    uniformLocations: {},
  },
}

const triangleModelPosition = mat4.create()

const VertexShaderSecondExample = () => {
  const triangle = {
    vertices: [[0.0, 1.0, 0.0], [-0.866, -0.5, 0.0], [0.866, -0.5, 0.0]],
  }
  const [webGlRef, updateWebGlRef] = useState(null)
  const [shaderProgram, updateShaderProgram] = useState(null)
  const [shaderInfo, updateShaderInfo] = useState(null)
  const [triangleBuffer, updateTriangleBuffer] = useState({ vertices: null })
  const [shouldRender, updateShouldRender] = useState(true)
  const [time, updateTime] = useState(performance.now())

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
          triangle.vertices.flat(),
          triangleBuffer.vertices
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

            const currentTime = parseInt(performance.now().toString())

            if (currentTime - then > 100) {
              then = currentTime
              updateTime(currentTime)
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
            gl.uniform1f(shaderInfo.vertex.uniformLocations.time, currentTime)

            gl.drawArrays(gl.LINE_LOOP, 0, triangle.vertices.length)

            requestAnimationFrame(renderScene)
          }
        )
      }
      requestAnimationFrame(renderScene)

      return () => updateShouldRender(false)
    }),
    [triangleBuffer]
  )

  return (
    <div className="util text-center" style={{ padding: "1rem" }}>
      <canvas width="640" height="480" ref={canvasRef}>
        Cannot run WebGL examples (not supported)
      </canvas>
      <pre className="util text-left">
        {`
Triangle Vertices:
    Vertex 1: ${coordArrToString(triangle.vertices[0])}
    Vertex 2: ${coordArrToString(triangle.vertices[1])}
    Vertex 3: ${coordArrToString(triangle.vertices[2])}
`.trim()}
      </pre>
      <pre className="util text-left">Time: {time}</pre>
    </div>
  )
}

export default VertexShaderSecondExample
