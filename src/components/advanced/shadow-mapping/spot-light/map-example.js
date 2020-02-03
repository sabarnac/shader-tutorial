import { mat4 } from "gl-matrix";
import React, { useCallback, useEffect, useState } from "react";

import { coordArrToString, runOnPredicate } from "../../../util";
import WebGlWrapper from "../../../webgl-wrapper";
import { spotLightMapFragmentShaderSource, spotLightMapVertexShaderSource } from "./map-example-shaders";
import { modelIndices, modelVertices } from "./model";

const shaderProgramInfo = {
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

const lightModelPosition = [-3.0, 10.0, -6.0]

const sceneModelPosition = mat4.create()

const ShadowMappingSpotLightMapExample = () => {
  const scene = {
    vertices: modelVertices,
    indices: modelIndices,
  }
  const [webGlRef, updateWebGlRef] = useState(null)
  const [shaderProgram, updateShaderProgram] = useState(null)
  const [shaderInfo, updateShaderInfo] = useState(null)
  const [sceneBuffer, updateSceneBuffer] = useState({
    vertices: null,
    indices: null,
  })
  const [shouldRender, updateShouldRender] = useState(true)

  const canvasRef = useCallback(canvas => {
    if (canvas !== null) {
      updateWebGlRef(new WebGlWrapper(canvas, sceneModelPosition))
    }

    return () => {
      if (canvas !== null) {
        updateWebGlRef(webGlRef => {
          if (webGlRef !== null) {
            webGlRef.destroy()
          }
          return null
        })
      }
    }
  }, [])

  useEffect(
    runOnPredicate(webGlRef !== null, () => {
      updateShaderProgram(
        webGlRef.createShaderProgram(
          spotLightMapVertexShaderSource,
          spotLightMapFragmentShaderSource
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
        webGlRef.renderScene(({ gl, modelMatrix }) => {
          if (!shouldRender) {
            return
          }

          const { fov, aspect } = webGlRef.canvasDimensions
          const depthProjectionMatrix = mat4.create()
          mat4.perspective(depthProjectionMatrix, fov, aspect, 5.0, 1000.0)

          gl.clearColor(1.0, 1.0, 1.0, 1.0)
          gl.clearDepth(1.0)
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

          const lightViewMatrix = mat4.create()
          mat4.lookAt(
            lightViewMatrix,
            lightModelPosition,
            [1.0, -0.75, -0.5],
            [0.0, 1.0, 0.0]
          )

          const scaledModelMatrix = mat4.create()
          mat4.scale(scaledModelMatrix, modelMatrix, [1.3, 1.3, 1.3])

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

          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sceneBuffer.indices)

          gl.useProgram(shaderProgram)

          gl.uniformMatrix4fv(
            shaderInfo.vertex.uniformLocations.projectionMatrix,
            false,
            depthProjectionMatrix
          )
          gl.uniformMatrix4fv(
            shaderInfo.vertex.uniformLocations.viewMatrix,
            false,
            lightViewMatrix
          )
          gl.uniformMatrix4fv(
            shaderInfo.vertex.uniformLocations.modelMatrix,
            false,
            scaledModelMatrix
          )

          gl.drawElements(
            gl.TRIANGLES,
            scene.indices.length,
            gl.UNSIGNED_SHORT,
            0
          )

          requestAnimationFrame(renderScene)
        })
      }
      requestAnimationFrame(renderScene)

      return () => updateShouldRender(false)
    }),
    [sceneBuffer]
  )

  return (
    <div className="util text-center" style={{ padding: "1rem" }}>
      <canvas width="640" height="480" ref={canvasRef}>
        Cannot run WebGL examples (not supported)
      </canvas>
      <pre className="util text-left">
        {`
Scene:
    World Position: ${coordArrToString([0.0, 0.0, 0.0])}
`.trim()}
      </pre>
      <pre className="util text-left">
        {`
Light:
    World Position: ${coordArrToString(lightModelPosition)}
`.trim()}
      </pre>
    </div>
  )
}

export default ShadowMappingSpotLightMapExample
