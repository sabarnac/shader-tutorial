import { mat4, vec4 } from "gl-matrix"
import React, { useEffect, useRef, useState } from "react"

import { coordArrToString, runOnPredicate } from "../../../util"
import wrapExample from "../../../webgl-example-view"
import WebGlWrapper from "../../../webgl-wrapper"
import { pointLightMapFragmentShaderSource, pointLightMapVertexShaderSource } from "./map-example-shaders"
import { modelIndices, modelVertices } from "./model"

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
    uniformLocations: {
      lightPosition_worldSpace: "vec4",
      farPlane: "float",
    },
  },
}

const lightModelPosition = vec4.fromValues(0.0, 3.0, -1.5, 1.0)
const lightModelFaces = [
  {
    name: "+X-Axis Face",
    id: "POSITIVE_X",
    center: [
      lightModelPosition[0] + 1.0,
      lightModelPosition[1],
      lightModelPosition[2],
    ],
    up: [0.0, 1.0, 0.0],
  },
  {
    name: "-X-Axis Face",
    id: "NEGATIVE_X",
    center: [
      lightModelPosition[0] - 1.0,
      lightModelPosition[1],
      lightModelPosition[2],
    ],
    up: [0.0, 1.0, 0.0],
  },
  {
    name: "+Y-Axis Face",
    id: "POSITIVE_Y",
    center: [
      lightModelPosition[0],
      lightModelPosition[1] + 1.0,
      lightModelPosition[2],
    ],
    up: [0.0, 0.0, -1.0],
  },
  {
    name: "-Y-Axis Face",
    id: "NEGATIVE_Y",
    center: [
      lightModelPosition[0],
      lightModelPosition[1] - 1.0,
      lightModelPosition[2],
    ],
    up: [0.0, 0.0, 1.0],
  },
  {
    name: "+Z-Axis Face",
    id: "POSITIVE_Z",
    center: [
      lightModelPosition[0],
      lightModelPosition[1],
      lightModelPosition[2] + 1.0,
    ],
    up: [0.0, 1.0, 0.0],
  },
  {
    name: "-Z-Axis Face",
    id: "NEGATIVE_Z",
    center: [
      lightModelPosition[0],
      lightModelPosition[1],
      lightModelPosition[2] - 1.0,
    ],
    up: [0.0, 1.0, 0.0],
  },
]

const sceneModelPosition = mat4.create()

const ShadowMappingPointLightMapExample = () => {
  const scene = {
    vertices: modelVertices,
    indices: modelIndices,
    nearPlane: 0.5,
    farPlane: 10.0,
  }
  const [webGlRef, updateWebGlRef] = useState(null)
  const [currentFace, updateCurrentFace] = useState(3)
  const [shaderProgram, updateShaderProgram] = useState(null)
  const [shaderInfo, updateShaderInfo] = useState(null)
  const [sceneBuffer, updateSceneBuffer] = useState({
    vertices: null,
    indices: null,
  })

  const canvasRef = useRef()
  useEffect(() => {
    if (canvasRef.current !== null) {
      const newWebGlRef = new WebGlWrapper(
        canvasRef.current,
        sceneModelPosition
      )
      updateWebGlRef(newWebGlRef)

      return () => {
        updateWebGlRef(null)
        newWebGlRef.destroy()
      }
    }
  }, [canvasRef])

  useEffect(
    runOnPredicate(webGlRef !== null, () => {
      updateShaderProgram(
        webGlRef.createShaderProgram(
          pointLightMapVertexShaderSource,
          pointLightMapFragmentShaderSource
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
      let shouldRender = true

      const renderFace = currentFace
      const renderScene = () => {
        webGlRef.renderScene(({ gl, modelMatrix }) => {
          if (!shouldRender) {
            return
          }

          const depthProjectionMatrix = mat4.create()
          mat4.perspective(
            depthProjectionMatrix,
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
            lightModelFaces[renderFace].center,
            lightModelFaces[renderFace].up
          )

          const lightModelMatrix = mat4.create()

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
            lightModelMatrix
          )

          gl.uniform4fv(
            shaderInfo.fragment.uniformLocations.lightPosition_worldSpace,
            lightModelPosition
          )

          gl.uniform1f(
            shaderInfo.fragment.uniformLocations.farPlane,
            scene.farPlane
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

      return () => {
        shouldRender = false
      }
    }),
    [sceneBuffer, currentFace]
  )

  return (
    <div className="util text-center" style={{ padding: "1rem" }}>
      <canvas width="640" height="480" ref={canvasRef}>
        Cannot run WebGL examples (not supported)
      </canvas>
      <select
        value={currentFace}
        onChange={({ target: { value } }) => updateCurrentFace(value)}
        onBlur={({ target: { value } }) => updateCurrentFace(value)}
      >
        {lightModelFaces.map((face, i) => (
          <option key={i} value={i}>
            {face.name}
          </option>
        ))}
      </select>
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
      <pre className="util text-left">
        {`
Face:
    Center: ${coordArrToString(lightModelFaces[currentFace].center)}
    Up: ${coordArrToString(lightModelFaces[currentFace].up)}
`.trim()}
      </pre>
    </div>
  )
}

export default wrapExample(ShadowMappingPointLightMapExample)
