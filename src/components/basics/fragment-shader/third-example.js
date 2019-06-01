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
      mvpMatrix: "mat4",
    },
  },
  fragment: {
    attributeLocations: {},
    uniformLocations: {
      time: "float",
    },
  },
}

const triangleModelPosition = mat4.create()

const FragmentShaderThirdExample = () => {
  const triangle = {
    vertices: [[0.0, 1.0, 0.0], [-0.866, -0.5, 0.0], [0.866, -0.5, 0.0]],
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
  const [time, updateTime] = useState(performance.now())

  const canvasRef = useCallback(
    canvas => {
      if (canvas !== null) {
        updateWebGlRef(new WebGlWrapper(canvas, triangleModelPosition))
      }
    },
    [thirdVertexShaderSource, thirdFragmentShaderSource]
  )

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

            const currentTime = parseInt(performance.now().toString())

            if (currentTime - then > 100) {
              then = currentTime
              updateTime(currentTime)
            }

            const mvpMatrix = mat4.create()
            mat4.multiply(mvpMatrix, viewMatrix, modelMatrix)
            mat4.multiply(mvpMatrix, projectionMatrix, mvpMatrix)

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
              shaderInfo.vertex.uniformLocations.mvpMatrix,
              false,
              mvpMatrix
            )
            gl.uniform1f(shaderInfo.fragment.uniformLocations.time, currentTime)

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
      <pre className="util text-left">
        {`
Vertex Colors:
    Vertex 1: ${coordArrToString(triangle.colors[0], colorCoordMap)}
    Vertex 2: ${coordArrToString(triangle.colors[1], colorCoordMap)}
    Vertex 3: ${coordArrToString(triangle.colors[2], colorCoordMap)}
`.trim()}
      </pre>
      <pre className="util text-left">Time: {time}</pre>
    </div>
  )
}

export default FragmentShaderThirdExample
