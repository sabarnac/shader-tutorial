import { mat4, vec3, vec4 } from "gl-matrix"
import React, { useCallback, useEffect, useState } from "react"

import { coordArrToString, runOnPredicate } from "../../../util"
import wrapExample from "../../../webgl-example-view"
import WebGlWrapper from "../../../webgl-wrapper"
import {
  pointLightMapFragmentShaderSource,
  pointLightMapVertexShaderSource,
} from "./map-example-shaders"
import { modelIndices, modelNormals, modelVertices } from "./model"
import {
  pointLightShadowFragmentShaderSource,
  pointLightShadowVertexShaderSource,
} from "./shadow-example-shaders"

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
    uniformLocations: {
      lightPosition_worldSpace: "float",
      farPlane: "float",
    },
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

      lightPosition_worldSpace: "vec4",
      lightColor: "vec3",
      lightIntensity: "float",
    },
  },
  fragment: {
    attributeLocations: {},
    uniformLocations: {
      ambientFactor: "float",
      farPlane: "float",
      shadowMapTextureSampler: "samplerCube",
    },
  },
}

const lightModelPosition = vec4.fromValues(0.0, 3.0, -1.0, 1.0)
const lightModelFaces = [
  {
    name: "+X-Axis Face",
    id: "POSITIVE_X",
    center: [
      lightModelPosition[0] + 1.0,
      lightModelPosition[1],
      lightModelPosition[2],
    ],
    up: [0.0, -1.0, 0.0],
  },
  {
    name: "-X-Axis Face",
    id: "NEGATIVE_X",
    center: [
      lightModelPosition[0] - 1.0,
      lightModelPosition[1],
      lightModelPosition[2],
    ],
    up: [0.0, -1.0, 0.0],
  },
  {
    name: "+Y-Axis Face",
    id: "POSITIVE_Y",
    center: [
      lightModelPosition[0],
      lightModelPosition[1] + 1.0,
      lightModelPosition[2],
    ],
    up: [0.0, 0.0, 1.0],
  },
  {
    name: "-Y-Axis Face",
    id: "NEGATIVE_Y",
    center: [
      lightModelPosition[0],
      lightModelPosition[1] - 1.0,
      lightModelPosition[2],
    ],
    up: [0.0, 0.0, -1.0],
  },
  {
    name: "+Z-Axis Face",
    id: "POSITIVE_Z",
    center: [
      lightModelPosition[0],
      lightModelPosition[1],
      lightModelPosition[2] + 1.0,
    ],
    up: [0.0, -1.0, 0.0],
  },
  {
    name: "-Z-Axis Face",
    id: "NEGATIVE_Z",
    center: [
      lightModelPosition[0],
      lightModelPosition[1],
      lightModelPosition[2] - 1.0,
    ],
    up: [0.0, -1.0, 0.0],
  },
]
const lightColor = vec3.fromValues(0.3, 0.3, 0.3)
const lightIntensity = 20.0

const sceneModelPosition = mat4.create()

const ShadowMappingPointLightShadowExample = () => {
  const scene = {
    vertices: modelVertices,
    normals: modelNormals,
    indices: modelIndices,
    ambientFactor: 0.1,
    nearPlane: 0.01,
    farPlane: 15.0,
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
  const [shadowMapFramebuffer, updateShadowMapFramebuffer] = useState(
    lightModelFaces.map(() => null)
  )

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
          pointLightMapVertexShaderSource,
          pointLightMapFragmentShaderSource
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
        shadowTexture: webGlRef.createCubeMapRenderTargetTexture(
          shadowMapSceneBuffer.shadowTexture
        ),
      })
    }),
    [shadowMapShaderInfo]
  )

  useEffect(
    runOnPredicate(shadowMapSceneBuffer.shadowTexture !== null, () => {
      updateShadowMapFramebuffer(
        lightModelFaces.map((face, i) =>
          webGlRef.createCubeMapTargetFramebuffer(
            shadowMapSceneBuffer.shadowTexture,
            face.id,
            shadowMapFramebuffer[i],
            true
          )
        )
      )
    }),
    [shadowMapSceneBuffer]
  )

  useEffect(
    runOnPredicate(
      shadowMapFramebuffer.filter(framebuffer => framebuffer !== null)
        .length === lightModelFaces.length,
      () => {
        updateShaderProgram(
          webGlRef.createShaderProgram(
            pointLightShadowVertexShaderSource,
            pointLightShadowFragmentShaderSource
          )
        )
      }
    ),
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
      let shouldRender = true

      const renderScene = () => {
        shadowMapFramebuffer.forEach((framebuffer, i) => {
          webGlRef.renderToCubeMapFramebuffer(framebuffer, () => {
            webGlRef.renderScene(({ gl }) => {
              if (!shouldRender) {
                return
              }

              const lightProjectionMatrix = mat4.create()
              mat4.perspective(
                lightProjectionMatrix,
                (90 * Math.PI) / 180,
                1.0,
                scene.nearPlane,
                scene.farPlane
              )

              gl.clearColor(1.0, 1.0, 1.0, 1.0)
              gl.clearDepth(1.0)
              gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

              const lightViewMatrix = mat4.create()
              mat4.lookAt(
                lightViewMatrix,
                lightModelPosition,
                lightModelFaces[i].center,
                lightModelFaces[i].up
              )

              const lightModelMatrix = mat4.create()

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

              gl.bindBuffer(
                gl.ELEMENT_ARRAY_BUFFER,
                shadowMapSceneBuffer.indices
              )

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

              gl.uniform4fv(
                shadowMapShaderInfo.fragment.uniformLocations
                  .lightPosition_worldSpace,
                lightModelPosition
              )
              gl.uniform1f(
                shadowMapShaderInfo.fragment.uniformLocations.farPlane,
                scene.farPlane
              )

              gl.drawElements(
                gl.TRIANGLES,
                scene.indices.length,
                gl.UNSIGNED_SHORT,
                0
              )
            })
          })
        })

        webGlRef.renderScene(({ gl, projectionMatrix, _, modelMatrix }) => {
          if (!shouldRender) {
            return
          }

          // projectionMatrix = mat4.create()
          // mat4.perspective(
          //   projectionMatrix,
          //   (90 * Math.PI) / 180,
          //   1.0,
          //   scene.nearPlane,
          //   scene.farPlane
          // )

          // gl.clearColor(1.0, 1.0, 1.0, 1.0)
          // gl.clearDepth(1.0)
          // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

          // const viewMatrix = mat4.create()
          // mat4.lookAt(
          //   viewMatrix,
          //   lightModelPosition,
          //   lightModelFaces[3].center,
          //   lightModelFaces[3].up
          // )

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
          gl.uniform1f(
            shaderInfo.fragment.uniformLocations.farPlane,
            scene.farPlane
          )

          gl.activeTexture(gl.TEXTURE0)
          gl.bindTexture(
            gl.TEXTURE_CUBE_MAP,
            shadowMapSceneBuffer.shadowTexture
          )
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

      return () => {
        shouldRender = false
      }
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

export default wrapExample(ShadowMappingPointLightShadowExample)
