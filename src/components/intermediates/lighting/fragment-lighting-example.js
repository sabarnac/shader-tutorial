import { mat4, vec3, vec4 } from "gl-matrix"
import React, { useCallback, useEffect, useState } from "react"

import { coordArrToString, runOnPredicate } from "../../util"
import wrapExample from "../../webgl-example-view"
import WebGlWrapper from "../../webgl-wrapper"
import {
  fragmentLightingFragmentShaderSource,
  fragmentLightingVertexShaderSource,
} from "./fragment-lighting-example-shaders"
import {
  lightPointFragmentShaderSource,
  lightPointVertexShaderSource,
} from "./light-point-shaders"

const lightShaderProgramInfo = {
  vertex: {
    attributeLocations: {
      vertexPosition: "vec4",
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

const shaderProgramInfo = {
  vertex: {
    attributeLocations: {
      vertexPosition: "vec4",
      vertexNormal: "vec3",
    },
    uniformLocations: {
      modelMatrix: "mat4",
      viewMatrix: "mat4",
      projectionMatrix: "mat4",

      lightPosition_worldSpace: "vec4",
      lightColor: "vec3",
      lightIntensity: "float",
    },
  },
  fragment: {
    attributeLocations: {},
    uniformLocations: {},
  },
}

const lightModelPosition = vec4.fromValues(0.5, 0.2, 3.0, 1.0)
const lightColor = vec3.fromValues(1.0, 1.0, 1.0)
const lightIntensity = 2.25

const squareModelPosition = mat4.create()

const VertexLightingExample = () => {
  const triangle = {
    vertices: [
      [0.0, 1.0, 0.0],
      [-0.866, -0.5, 0.0],
      [0.866, -0.5, 0.0],
    ],
  }
  const square = {
    vertices: [
      [-1.0, -1.0, 0.0],
      [-1.0, 1.0, 0.0],
      [1.0, -1.0, 0.0],
      [-1.0, 1.0, 0.0],
      [1.0, -1.0, 0.0],
      [1.0, 1.0, 0.0],
    ],
    normals: [
      [0.0, 0.0, 1.0],
      [0.0, 0.0, 1.0],
      [0.0, 0.0, 1.0],
      [0.0, 0.0, 1.0],
      [0.0, 0.0, 1.0],
      [0.0, 0.0, 1.0],
    ],
    indices: [[0, 1, 2, 3, 4, 5]],
  }
  const [webGlRef, updateWebGlRef] = useState(null)
  const [lightShaderProgram, updateLightShaderProgram] = useState(null)
  const [lightShaderInfo, updateLightShaderInfo] = useState(null)
  const [lightBuffer, updateLightBuffer] = useState({
    vertices: null,
  })
  const [shaderProgram, updateShaderProgram] = useState(null)
  const [shaderInfo, updateShaderInfo] = useState(null)
  const [squareBuffer, updatesquareBuffer] = useState({
    vertices: null,
    normals: null,
    indices: null,
  })

  const canvasRef = useCallback(canvas => {
    if (canvas !== null) {
      updateWebGlRef(new WebGlWrapper(canvas, squareModelPosition))
      return () =>
        updateWebGlRef(webGlRef => {
          webGlRef.destroy()
          return null
        })
    }
  }, [])

  useEffect(
    runOnPredicate(webGlRef !== null, () => {
      updateLightShaderProgram(
        webGlRef.createShaderProgram(
          lightPointVertexShaderSource,
          lightPointFragmentShaderSource
        )
      )
    }),
    [webGlRef]
  )

  useEffect(
    runOnPredicate(lightShaderProgram !== null, () => {
      updateLightShaderInfo(
        webGlRef.getDataLocations(lightShaderProgram, lightShaderProgramInfo)
      )
    }),
    [lightShaderProgram]
  )

  useEffect(
    runOnPredicate(lightShaderInfo !== null, () => {
      updateLightBuffer({
        vertices: webGlRef.createStaticDrawArrayBuffer(
          triangle.vertices.flat(),
          lightBuffer.vertices
        ),
      })
    }),
    [lightShaderInfo]
  )

  useEffect(
    runOnPredicate(lightBuffer.vertices !== null, () => {
      updateShaderProgram(
        webGlRef.createShaderProgram(
          fragmentLightingVertexShaderSource,
          fragmentLightingFragmentShaderSource
        )
      )
    }),
    [lightBuffer]
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
      updatesquareBuffer({
        vertices: webGlRef.createStaticDrawArrayBuffer(
          square.vertices.flat(),
          squareBuffer.vertices
        ),
        normals: webGlRef.createStaticDrawArrayBuffer(
          square.normals.flat(),
          squareBuffer.normals
        ),
        indices: webGlRef.createElementArrayBuffer(
          square.indices.flat(),
          squareBuffer.indices
        ),
      })
    }),
    [shaderInfo]
  )

  useEffect(
    runOnPredicate(squareBuffer.vertices !== null, () => {
      let shouldRender = true

      const renderScene = () => {
        webGlRef.renderScene(
          ({ gl, projectionMatrix, viewMatrix, modelMatrix }) => {
            if (!shouldRender) {
              return
            }

            {
              const rotatedModelMatrix = mat4.create()
              const rotationAngle = (30 * Math.PI) / 180
              mat4.translate(rotatedModelMatrix, modelMatrix, [0.0, 0.0, 2.0])
              mat4.rotateY(
                rotatedModelMatrix,
                rotatedModelMatrix,
                rotationAngle
              )

              gl.bindBuffer(gl.ARRAY_BUFFER, squareBuffer.vertices)
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

              gl.bindBuffer(gl.ARRAY_BUFFER, squareBuffer.normals)
              gl.vertexAttribPointer(
                shaderInfo.vertex.attributeLocations.vertexNormal,
                3,
                gl.FLOAT,
                false,
                0,
                0
              )
              gl.enableVertexAttribArray(
                shaderInfo.vertex.attributeLocations.vertexNormal
              )

              gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareBuffer.indices)

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
                rotatedModelMatrix
              )

              gl.uniform4fv(
                shaderInfo.vertex.uniformLocations.lightPosition_worldSpace,
                lightModelPosition
              )
              gl.uniform3fv(
                shaderInfo.vertex.uniformLocations.lightColor,
                lightColor
              )
              gl.uniform1f(
                shaderInfo.vertex.uniformLocations.lightIntensity,
                lightIntensity
              )

              gl.drawElements(
                gl.TRIANGLES,
                square.indices.length * square.indices[0].length,
                gl.UNSIGNED_SHORT,
                0
              )
            }

            {
              const lightModelMatrix = mat4.create()
              mat4.translate(
                lightModelMatrix,
                lightModelMatrix,
                lightModelPosition
              )
              mat4.scale(lightModelMatrix, lightModelMatrix, [0.03, 0.03, 0.03])

              gl.bindBuffer(gl.ARRAY_BUFFER, lightBuffer.vertices)
              gl.vertexAttribPointer(
                lightShaderInfo.vertex.attributeLocations.vertexPosition,
                3,
                gl.FLOAT,
                false,
                0,
                0
              )
              gl.enableVertexAttribArray(
                lightShaderInfo.vertex.attributeLocations.vertexPosition
              )

              gl.useProgram(lightShaderProgram)

              gl.uniformMatrix4fv(
                lightShaderInfo.vertex.uniformLocations.projectionMatrix,
                false,
                projectionMatrix
              )
              gl.uniformMatrix4fv(
                lightShaderInfo.vertex.uniformLocations.viewMatrix,
                false,
                viewMatrix
              )
              gl.uniformMatrix4fv(
                lightShaderInfo.vertex.uniformLocations.modelMatrix,
                false,
                lightModelMatrix
              )

              gl.drawArrays(gl.TRIANGLES, 0, triangle.vertices.length)
            }

            requestAnimationFrame(renderScene)
          }
        )
      }
      requestAnimationFrame(renderScene)

      return () => {
        shouldRender = false
      }
    }),
    [squareBuffer]
  )

  const colorCoords = { x: "r", y: "g", z: "b" }

  return (
    <div className="util text-center" style={{ padding: "1rem" }}>
      <canvas width="640" height="480" ref={canvasRef}>
        Cannot run WebGL examples (not supported)
      </canvas>
      <pre className="util text-left">
        {`
Square:
    World Position: ${coordArrToString([0.0, 0.0, 0.0])}
    Lighting:
        Specular Reflectivity: ${square.specularReflectivity}
        Lobe Density: ${square.specularLobeFactor}
`.trim()}
      </pre>
      <pre className="util text-left">
        {`
Light:
    World Position: ${coordArrToString(lightModelPosition)}
    Color: ${coordArrToString(lightColor, colorCoords)}
    Intensity: ${lightIntensity}
`.trim()}
      </pre>
    </div>
  )
}

export default wrapExample(VertexLightingExample)
