import { mat4, vec3, vec4 } from "gl-matrix"
import React, { useCallback, useEffect, useState } from "react"

import { coordArrToString, runOnPredicate } from "../../../util"
import wrapExample from "../../../webgl-example-view"
import WebGlWrapper from "../../../webgl-wrapper"
import { modelIndices, modelNormals, modelVertices } from "./model"
import { noShadowFragmentShaderSource, noShadowVertexShaderSource } from "./shadow-example-shaders"

const shaderProgramInfo = {
  vertex: {
    attributeLocations: {
      vertexPosition: "vec4",
      vertexNormal: "vec4",
    },
    uniformLocations: {
      modelMatrix: "mat4",
      viewMatrix: "mat4",
      projectionMatrix: "mat4",

      lightModelMatrix: "mat4",
      lightViewMatrix: "mat4",
      lightProjectionMatrix: "mat4",

      lightPosition_worldSpace: "vec4",
      lightColor: "vec3",
      lightIntensity: "float",
    },
  },
  fragment: {
    attributeLocations: {},
    uniformLocations: {
      ambientFactor: "float",
    },
  },
}

const lightModelPosition = vec4.fromValues(-9.0, 27.0, -18.0, 1.0)
const lightColor = vec3.fromValues(0.3, 0.3, 0.3)
const lightIntensity = 2500.0

const sceneModelPosition = mat4.create()

const ShadowMappingNoShadowExample = () => {
  const scene = {
    vertices: modelVertices,
    normals: modelNormals,
    indices: modelIndices,
    ambientFactor: 0.1,
  }
  const [webGlRef, updateWebGlRef] = useState(null)
  const [shaderProgram, updateShaderProgram] = useState(null)
  const [shaderInfo, updateShaderInfo] = useState(null)
  const [sceneBuffer, updateSceneBuffer] = useState({
    vertices: null,
    normals: null,
    indices: null,
  })
  const [shouldRender, updateShouldRender] = useState(true)

  const canvasRef = useCallback(canvas => {
    if (canvas !== null) {
      updateWebGlRef(new WebGlWrapper(canvas, sceneModelPosition))
      return () =>
        updateWebGlRef(webGlRef => {
          webGlRef.destroy()
          return null
        })
    }
  }, [])

  useEffect(
    runOnPredicate(webGlRef !== null, () => {
      updateShaderProgram(
        webGlRef.createShaderProgram(
          noShadowVertexShaderSource,
          noShadowFragmentShaderSource
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
      updateSceneBuffer({
        vertices: webGlRef.createStaticDrawArrayBuffer(
          scene.vertices.flat(),
          sceneBuffer.vertices
        ),
        normals: webGlRef.createStaticDrawArrayBuffer(
          scene.normals.flat(),
          sceneBuffer.normals
        ),
        indices: webGlRef.createElementArrayBuffer(
          scene.indices.flat(),
          sceneBuffer.indices
        ),
      })
    }),
    [shaderInfo]
  )

  useEffect(
    runOnPredicate(sceneBuffer.vertices !== null, () => {
      updateShouldRender(true)

      const renderScene = () => {
        const lightModelMatrix = mat4.create()
        const lightViewMatrix = mat4.create()
        const lightProjectionMatrix = mat4.create()

        webGlRef.renderScene(({ gl, projectionMatrix, _, modelMatrix }) => {
          if (!shouldRender) {
            return
          }

          const viewMatrix = mat4.create()
          mat4.lookAt(
            viewMatrix,
            [-9.0, 6.0, -0.5],
            [0.0, 1.0, 0.0],
            [0.0, 1.0, 0.0]
          )

          gl.bindBuffer(gl.ARRAY_BUFFER, sceneBuffer.vertices)
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

          gl.bindBuffer(gl.ARRAY_BUFFER, sceneBuffer.normals)
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

          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sceneBuffer.indices)

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

          gl.uniformMatrix4fv(
            shaderInfo.vertex.uniformLocations.lightModelMatrix,
            false,
            lightModelMatrix
          )
          gl.uniformMatrix4fv(
            shaderInfo.vertex.uniformLocations.lightViewMatrix,
            false,
            lightViewMatrix
          )
          gl.uniformMatrix4fv(
            shaderInfo.vertex.uniformLocations.lightProjectionMatrix,
            false,
            lightProjectionMatrix
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

          gl.uniform1f(
            shaderInfo.fragment.uniformLocations.ambientFactor,
            scene.ambientFactor
          )

          gl.drawElements(
            gl.TRIANGLES,
            scene.indices.length,
            gl.UNSIGNED_SHORT,
            0
          )
        })

        requestAnimationFrame(renderScene)
      }
      requestAnimationFrame(renderScene)

      return () => updateShouldRender(false)
    }),
    [sceneBuffer]
  )

  const colorCoords = { x: "r", y: "g", z: "b" }

  return (
    <div className="util text-center" style={{ padding: "1rem" }}>
      <canvas width="640" height="480" ref={canvasRef}>
        Cannot run WebGL examples (not supported)
      </canvas>
      <pre className="util text-left">
        {`
Scene:
    World Position: ${coordArrToString([0.0, 0.0, 0.0])}
    Lighting:
        Ambient Factor: ${scene.ambientFactor}
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

export default wrapExample(ShadowMappingNoShadowExample)
