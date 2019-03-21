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
    },
    uniformLocations: {
      mvpMatrix: "mat4",
    },
  },
  fragment: {
    attributeLocations: {},
    uniformLocations: {},
  },
}

const triangleModelPosition = mat4.create()

const VertexShaderSecondExample = () => {
  const trianglePositions = [0.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0]
  const [webGlRef, updateWebGlRef] = useState(null)
  const [shaderProgram, updateShaderProgram] = useState(null)
  const [shaderInfo, updateShaderInfo] = useState(null)
  const [triangleBuffer, updateTriangleBuffer] = useState(null)
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
      updateTriangleBuffer(
        webGlRef.createStaticDrawArrayBuffer(trianglePositions, triangleBuffer)
      )
    }),
    [shaderInfo, trianglePositions]
  )

  useEffect(
    runOnPredicate(triangleBuffer !== null, () => {
      updateShouldRender(true)
      const renderScene = () => {
        webGlRef.renderScene(
          ({ gl, projectionMatrix, viewMatrix, modelMatrix }) => {
            if (!shouldRender) {
              return
            }

            const rotatedModelMatrix = mat4.create()
            const time = performance.now()
            const rotationAngle = (((time / 30) % 360) * Math.PI) / 180
            mat4.rotateZ(rotatedModelMatrix, modelMatrix, rotationAngle)

            const mvpMatrix = mat4.create()
            mat4.multiply(mvpMatrix, viewMatrix, rotatedModelMatrix)
            mat4.multiply(mvpMatrix, projectionMatrix, mvpMatrix)

            gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer)
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
              shaderInfo.vertex.uniformLocations.mvpMatrix,
              false,
              mvpMatrix
            )

            gl.drawArrays(gl.LINE_LOOP, 0, trianglePositions.length / 3)

            requestAnimationFrame(renderScene)
          }
        )
      }
      requestAnimationFrame(renderScene)

      return () => updateShouldRender(false)
    }),
    [triangleBuffer, trianglePositions]
  )

  const vertices = chunkArray(trianglePositions, 3)

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
    </div>
  )
}

export default VertexShaderSecondExample
