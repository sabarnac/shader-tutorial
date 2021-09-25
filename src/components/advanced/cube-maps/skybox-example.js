import { mat4, vec4 } from "gl-matrix"
import React, { useCallback, useEffect, useState } from "react"

import skyboxFaceNegativeX from "../../../images/advanced/skybox-face-negative-x.png"
import skyboxFaceNegativeY from "../../../images/advanced/skybox-face-negative-y.png"
import skyboxFaceNegativeZ from "../../../images/advanced/skybox-face-negative-z.png"
import skyboxFacePositiveX from "../../../images/advanced/skybox-face-positive-x.png"
import skyboxFacePositiveY from "../../../images/advanced/skybox-face-positive-y.png"
import skyboxFacePositiveZ from "../../../images/advanced/skybox-face-positive-z.png"
import { runOnPredicate } from "../../util"
import wrapExample from "../../webgl-example-view"
import WebGlWrapper from "../../webgl-wrapper"
import { skyboxFragmentShaderSource, skyboxVertexShaderSource } from "./skybox-example-shaders"

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
      skyboxSampler: "samplerCube",
    },
  },
}

const SkyboxExample = () => {
  const skybox = {
    vertices: [
      // Front vertices
      [-5.0, -5.0, 5.0],
      [-5.0, 5.0, 5.0],
      [5.0, -5.0, 5.0],
      [-5.0, 5.0, 5.0],
      [5.0, -5.0, 5.0],
      [5.0, 5.0, 5.0],
      // Left vertices
      [-5.0, -5.0, -5.0],
      [-5.0, 5.0, -5.0],
      [-5.0, -5.0, 5.0],
      [-5.0, 5.0, -5.0],
      [-5.0, -5.0, 5.0],
      [-5.0, 5.0, 5.0],
      // Right vertices
      [5.0, -5.0, 5.0],
      [5.0, 5.0, 5.0],
      [5.0, -5.0, -5.0],
      [5.0, 5.0, 5.0],
      [5.0, -5.0, -5.0],
      [5.0, 5.0, -5.0],
      // Top vertices
      [-5.0, 5.0, 5.0],
      [-5.0, 5.0, -5.0],
      [5.0, 5.0, 5.0],
      [-5.0, 5.0, -5.0],
      [5.0, 5.0, 5.0],
      [5.0, 5.0, -5.0],
      // Bottom vertices
      [-5.0, -5.0, -5.0],
      [-5.0, -5.0, 5.0],
      [5.0, -5.0, -5.0],
      [-5.0, -5.0, 5.0],
      [5.0, -5.0, -5.0],
      [5.0, -5.0, 5.0],
      // Back vertices
      [5.0, -5.0, -5.0],
      [5.0, 5.0, -5.0],
      [-5.0, -5.0, -5.0],
      [5.0, 5.0, -5.0],
      [-5.0, -5.0, -5.0],
      [-5.0, 5.0, -5.0],
    ],
    indices: [
      [0, 1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10, 11],
      [12, 13, 14, 15, 16, 17],
      [18, 19, 20, 21, 22, 23],
      [24, 25, 26, 27, 28, 29],
      [30, 31, 32, 33, 34, 35],
    ],
    textures: [
      {
        name: "+X-Axis Face",
        id: "POSITIVE_X",
        src: skyboxFacePositiveX,
      },
      {
        name: "-X-Axis Face",
        id: "NEGATIVE_X",
        src: skyboxFaceNegativeX,
      },
      {
        name: "+Y-Axis Face",
        id: "POSITIVE_Y",
        src: skyboxFacePositiveY,
      },
      {
        name: "-Y-Axis Face",
        id: "NEGATIVE_Y",
        src: skyboxFaceNegativeY,
      },
      {
        name: "+Z-Axis Face",
        id: "POSITIVE_Z",
        src: skyboxFacePositiveZ,
      },
      {
        name: "-Z-Axis Face",
        id: "NEGATIVE_Z",
        src: skyboxFaceNegativeZ,
      },
    ],
  }

  const [webGlRef, updateWebGlRef] = useState(null)
  const [shaderProgram, updateShaderProgram] = useState(null)
  const [shaderInfo, updateShaderInfo] = useState(null)
  const [skyboxBuffer, updateSkyboxBuffer] = useState({
    vertices: null,
    indices: null,
    texture: null,
  })

  const canvasRef = useCallback((canvas) => {
    if (canvas !== null) {
      updateWebGlRef(new WebGlWrapper(canvas, mat4.create()))
      return () =>
        updateWebGlRef((webGlRef) => {
          webGlRef.destroy()
          return null
        })
    }
  }, [])

  useEffect(
    runOnPredicate(webGlRef !== null, () => {
      updateShaderProgram(
        webGlRef.createShaderProgram(
          skyboxVertexShaderSource,
          skyboxFragmentShaderSource
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
      updateSkyboxBuffer({
        vertices: webGlRef.createStaticDrawArrayBuffer(
          skybox.vertices.flat(),
          skyboxBuffer.vertices
        ),
        indices: webGlRef.createElementArrayBuffer(
          skybox.indices.flat(),
          skyboxBuffer.indices
        ),
        texture: webGlRef.createCubeMapTexture(
          skybox.textures,
          skyboxBuffer.texture
        ),
      })
    }),
    [shaderInfo]
  )

  useEffect(
    runOnPredicate(skyboxBuffer.vertices !== null, () => {
      let shouldRender = true

      const renderScene = () => {
        webGlRef.renderScene(({ gl, modelMatrix }) => {
          if (!shouldRender) {
            return
          }

          const projectionMatrix = mat4.create()
          mat4.perspective(
            projectionMatrix,
            (100 * Math.PI) / 180,
            1.0,
            0.1,
            50
          )

          const time = parseInt(
            typeof performance !== "undefined"
              ? performance.now()
              : (0.0).toString()
          )

          const rotatedCameraMatrix = mat4.create()
          const rotationAngle =
            (-1 * (((time / 30) % (360 * 6)) * Math.PI)) / 180
          if (Math.floor(rotationAngle / (2 * Math.PI)) % 2 === 0) {
            mat4.rotateY(
              rotatedCameraMatrix,
              rotatedCameraMatrix,
              rotationAngle
            )
          } else {
            mat4.rotateX(
              rotatedCameraMatrix,
              rotatedCameraMatrix,
              rotationAngle
            )
          }

          const lookAtPosition = vec4.fromValues(0.0, 0.0, 1.0, 1.0)
          vec4.transformMat4(
            lookAtPosition,
            lookAtPosition,
            rotatedCameraMatrix
          )
          const upVector = vec4.fromValues(0.0, 1.0, 0.0, 1.0)
          vec4.transformMat4(upVector, upVector, rotatedCameraMatrix)

          const viewMatrix = mat4.create()
          mat4.lookAt(
            viewMatrix,
            [0.0, 0.0, 0.0],
            [lookAtPosition[0], lookAtPosition[1], lookAtPosition[2]],
            [upVector[0], upVector[1], upVector[2]]
          )

          gl.bindBuffer(gl.ARRAY_BUFFER, skyboxBuffer.vertices)
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

          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, skyboxBuffer.indices)

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

          gl.activeTexture(gl.TEXTURE0)
          gl.bindTexture(gl.TEXTURE_CUBE_MAP, skyboxBuffer.texture)
          gl.uniform1i(shaderInfo.fragment.uniformLocations.skyboxSampler, 0)

          gl.drawElements(
            gl.TRIANGLES,
            skybox.indices.length * skybox.indices[0].length,
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
    [skyboxBuffer]
  )

  return (
    <div className="util text-center" style={{ padding: "1rem" }}>
      <canvas width="640" height="480" ref={canvasRef}>
        Cannot run WebGL examples (not supported)
      </canvas>
    </div>
  )
}

export default wrapExample(SkyboxExample)
