import { mat4, vec2, vec3, vec4 } from "gl-matrix"
import React, { useCallback, useEffect, useState } from "react"

import { coordArrToString, runOnPredicate } from "../../../util"
import wrapExample from "../../../webgl-example-view"
import WebGlWrapper from "../../../webgl-wrapper"
import { areaLightMapFragmentShaderSource, areaLightMapVertexShaderSource } from "./map-example-shaders"
import { modelIndices, modelNormals, modelVertices } from "./model-fixed"
import { areaLightShadowPcfFragmentShaderSource, areaLightShadowPcfVertexShaderSource } from "./shadow-pcf-example-shaders"

const shadowMapShaderProgramInfo = {
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
      vertexNormal: "vec4",
    },
    uniformLocations: {
      modelMatrix: "mat4",
      viewMatrix: "mat4",
      projectionMatrix: "mat4",

      lightModelMatrix: "mat4",
      lightViewMatrix: "mat4",
      lightProjectionMatrix: "mat4",

      lightPlanePosition_worldSpace: "vec4",
      lightDirection_worldSpace: "vec4",
      lightColor: "vec3",
      lightIntensity: "float",
    },
  },
  fragment: {
    attributeLocations: {},
    uniformLocations: {
      texelSize: "vec2",
      ambientFactor: "float",
      shadowMapTextureSampler: "sampler2D",
    },
  },
}

const lightModelPosition = vec4.fromValues(-9.0, 27.0, -18.0, 1.0)
const lightColor = vec3.fromValues(0.3, 0.3, 0.3)
const lightIntensity = 2500.0

const lightLookAtPosition = vec4.fromValues(0.0, 0.0, 0.0, 1.0)
const lightDirection_worldSpace = vec4.create()
vec4.sub(lightDirection_worldSpace, lightModelPosition, lightLookAtPosition)
vec4.normalize(lightDirection_worldSpace, lightDirection_worldSpace)

const sceneModelPosition = mat4.create()

const ShadowMappingAreaLightPcfShadowExample = () => {
  const scene = {
    vertices: modelVertices,
    normals: modelNormals,
    indices: modelIndices,
    ambientFactor: 0.1,
  }
  const [webGlRef, updateWebGlRef] = useState(null)
  const [shadowMapShaderProgram, updateShadowMapShaderProgram] = useState(null)
  const [shadowMapShaderInfo, updateShadowMapShaderInfo] = useState(null)
  const [shadowMapSceneBuffer, updateShadowMapSceneBuffer] = useState({
    vertices: null,
    indices: null,
    shadowTexture: null,
  })
  const [shaderProgram, updateShaderProgram] = useState(null)
  const [shaderInfo, updateShaderInfo] = useState(null)
  const [sceneBuffer, updateSceneBuffer] = useState({
    vertices: null,
    normals: null,
    indices: null,
  })
  const [shadowMapFramebuffer, updateShadowMapFramebuffer] = useState(null)
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
      updateShadowMapShaderProgram(
        webGlRef.createShaderProgram(
          areaLightMapVertexShaderSource,
          areaLightMapFragmentShaderSource
        )
      )
    }),
    [webGlRef]
  )

  useEffect(
    runOnPredicate(shadowMapShaderProgram !== null, () => {
      updateShadowMapShaderInfo(
        webGlRef.getDataLocations(
          shadowMapShaderProgram,
          shadowMapShaderProgramInfo
        )
      )
    }),
    [shadowMapShaderProgram]
  )

  useEffect(
    runOnPredicate(shadowMapShaderInfo !== null, () => {
      updateShadowMapSceneBuffer({
        vertices: webGlRef.createStaticDrawArrayBuffer(
          scene.vertices.flat(),
          shadowMapSceneBuffer.vertices
        ),
        indices: webGlRef.createElementArrayBuffer(
          scene.indices.flat(),
          shadowMapSceneBuffer.indices
        ),
        shadowTexture: webGlRef.createRenderTargetTexture(
          shadowMapSceneBuffer.shadowTexture
        ),
      })
    }),
    [shadowMapShaderInfo]
  )

  useEffect(
    runOnPredicate(shadowMapSceneBuffer.shadowTexture !== null, () => {
      updateShadowMapFramebuffer(
        webGlRef.createTextureTargetFramebuffer(
          shadowMapSceneBuffer.shadowTexture,
          shadowMapFramebuffer,
          true
        )
      )
    }),
    [shadowMapSceneBuffer]
  )

  useEffect(
    runOnPredicate(shadowMapFramebuffer !== null, () => {
      updateShaderProgram(
        webGlRef.createShaderProgram(
          areaLightShadowPcfVertexShaderSource,
          areaLightShadowPcfFragmentShaderSource
        )
      )
    }),
    [shadowMapFramebuffer]
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
        const texelSize = vec2.fromValues(
          1.0 / webGlRef.canvasDimensions.width,
          1.0 / webGlRef.canvasDimensions.height
        )
        const lightModelMatrix = mat4.create()
        const lightViewMatrix = mat4.create()
        const lightProjectionMatrix = mat4.create()

        webGlRef.renderToFramebuffer(shadowMapFramebuffer, () => {
          webGlRef.renderSceneOrtho(({ gl, modelMatrix }) => {
            if (!shouldRender) {
              return
            }

            const { aspect, zNear, zFar } = webGlRef.canvasDimensions
            mat4.ortho(
              lightProjectionMatrix,
              -4 * aspect,
              4 * aspect,
              -4,
              4,
              zNear,
              zFar
            )

            gl.clearColor(1.0, 1.0, 1.0, 1.0)
            gl.clearDepth(1.0)
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

            mat4.lookAt(
              lightViewMatrix,
              [
                lightModelPosition[0],
                lightModelPosition[1],
                lightModelPosition[2],
              ],
              [0.0, -0.75, 0.0],
              [0.0, 1.0, 0.0]
            )

            mat4.scale(lightModelMatrix, modelMatrix, [1.6, 1.6, 1.6])

            gl.bindBuffer(gl.ARRAY_BUFFER, shadowMapSceneBuffer.vertices)
            gl.vertexAttribPointer(
              shadowMapShaderInfo.vertex.attributeLocations.vertexPosition,
              3,
              gl.FLOAT,
              false,
              0,
              0
            )
            gl.enableVertexAttribArray(
              shadowMapShaderInfo.vertex.attributeLocations.vertexPosition
            )

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, shadowMapSceneBuffer.indices)

            gl.useProgram(shadowMapShaderProgram)

            gl.uniformMatrix4fv(
              shadowMapShaderInfo.vertex.uniformLocations.projectionMatrix,
              false,
              lightProjectionMatrix
            )
            gl.uniformMatrix4fv(
              shadowMapShaderInfo.vertex.uniformLocations.viewMatrix,
              false,
              lightViewMatrix
            )
            gl.uniformMatrix4fv(
              shadowMapShaderInfo.vertex.uniformLocations.modelMatrix,
              false,
              lightModelMatrix
            )

            gl.drawElements(
              gl.TRIANGLES,
              scene.indices.length,
              gl.UNSIGNED_SHORT,
              0
            )
          })
        })

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
            shaderInfo.vertex.uniformLocations.lightPlanePosition_worldSpace,
            lightModelPosition
          )
          gl.uniform4fv(
            shaderInfo.vertex.uniformLocations.lightDirection_worldSpace,
            lightDirection_worldSpace
          )
          gl.uniform3fv(
            shaderInfo.vertex.uniformLocations.lightColor,
            lightColor
          )
          gl.uniform1f(
            shaderInfo.vertex.uniformLocations.lightIntensity,
            lightIntensity
          )

          gl.uniform2fv(
            shaderInfo.fragment.uniformLocations.texelSize,
            texelSize
          )
          gl.uniform1f(
            shaderInfo.fragment.uniformLocations.ambientFactor,
            scene.ambientFactor
          )

          gl.activeTexture(gl.TEXTURE0)
          gl.bindTexture(gl.TEXTURE_2D, shadowMapSceneBuffer.shadowTexture)
          gl.uniform1i(
            shaderInfo.fragment.uniformLocations.shadowMapTextureSampler,
            0
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
    Direction: ${coordArrToString(lightDirection_worldSpace)}
    Color: ${coordArrToString(lightColor, colorCoords)}
    Intensity: ${lightIntensity}
`.trim()}
      </pre>
    </div>
  )
}

export default wrapExample(ShadowMappingAreaLightPcfShadowExample)
