import { mat4, vec4 } from "gl-matrix"
import React, { useEffect, useRef, useState } from "react"

import cubeFaceNegativeX from "../../../images/advanced/cube-face-negative-x.png"
import cubeFaceNegativeY from "../../../images/advanced/cube-face-negative-y.png"
import cubeFaceNegativeZ from "../../../images/advanced/cube-face-negative-z.png"
import cubeFacePositiveX from "../../../images/advanced/cube-face-positive-x.png"
import cubeFacePositiveY from "../../../images/advanced/cube-face-positive-y.png"
import cubeFacePositiveZ from "../../../images/advanced/cube-face-positive-z.png"
import { coordArrToString, runOnPredicate } from "../../util"
import wrapExample from "../../webgl-example-view"
import WebGlWrapper from "../../webgl-wrapper"
import { cubeMapTextureFragmentShaderSource, cubeMapTextureVertexShaderSource } from "./cube-map-texture-example-shaders"

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
      modelPosition_worldSpace: "vec4",
      cubeMapTextureSampler: "samplerCube",
    },
  },
}

const cubeModelPosition = vec4.fromValues(0.0, 0.0, 0.0, 1.0)

const CubeMapTextureExample = () => {
  const cube = {
    vertices: [
      // Front vertices
      [-1.0, -1.0, 1.0],
      [-1.0, 1.0, 1.0],
      [1.0, -1.0, 1.0],
      [-1.0, 1.0, 1.0],
      [1.0, -1.0, 1.0],
      [1.0, 1.0, 1.0],
      // Left vertices
      [-1.0, -1.0, 1.0],
      [-1.0, 1.0, 1.0],
      [-1.0, -1.0, -1.0],
      [-1.0, 1.0, 1.0],
      [-1.0, -1.0, -1.0],
      [-1.0, 1.0, -1.0],
      // Right vertices
      [1.0, -1.0, 1.0],
      [1.0, 1.0, 1.0],
      [1.0, -1.0, -1.0],
      [1.0, 1.0, 1.0],
      [1.0, -1.0, -1.0],
      [1.0, 1.0, -1.0],
      // Top vertices
      [-1.0, 1.0, 1.0],
      [1.0, 1.0, 1.0],
      [-1.0, 1.0, -1.0],
      [1.0, 1.0, 1.0],
      [-1.0, 1.0, -1.0],
      [1.0, 1.0, -1.0],
      // Bottom vertices
      [-1.0, -1.0, 1.0],
      [1.0, -1.0, 1.0],
      [-1.0, -1.0, -1.0],
      [1.0, -1.0, 1.0],
      [-1.0, -1.0, -1.0],
      [1.0, -1.0, -1.0],
      // Back vertices
      [1.0, 1.0, -1.0],
      [1.0, -1.0, -1.0],
      [-1.0, 1.0, -1.0],
      [1.0, -1.0, -1.0],
      [-1.0, 1.0, -1.0],
      [-1.0, -1.0, -1.0],
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
        src: cubeFacePositiveX,
      },
      {
        name: "-X-Axis Face",
        id: "NEGATIVE_X",
        src: cubeFaceNegativeX,
      },
      {
        name: "+Y-Axis Face",
        id: "POSITIVE_Y",
        src: cubeFacePositiveY,
      },
      {
        name: "-Y-Axis Face",
        id: "NEGATIVE_Y",
        src: cubeFaceNegativeY,
      },
      {
        name: "+Z-Axis Face",
        id: "POSITIVE_Z",
        src: cubeFacePositiveZ,
      },
      {
        name: "-Z-Axis Face",
        id: "NEGATIVE_Z",
        src: cubeFaceNegativeZ,
      },
    ],
  }

  const [webGlRef, updateWebGlRef] = useState(null)
  const [shaderProgram, updateShaderProgram] = useState(null)
  const [shaderInfo, updateShaderInfo] = useState(null)
  const [cubeBuffer, updateCubeBuffer] = useState({
    vertices: null,
    indices: null,
  })
  const [cubeMapTexture, updateCubeMapTexture] = useState(null)

  const canvasRef = useRef()
  useEffect(() => {
    if (canvasRef.current !== null) {
      const newWebGlRef = new WebGlWrapper(canvasRef.current, mat4.create())
      updateWebGlRef(newWebGlRef)

      return () => {
        updateWebGlRef(null)
        newWebGlRef.destroy()
      }
    }
  }, [canvasRef])

  useEffect(
    runOnPredicate(webGlRef !== null, () => {
      updateCubeMapTexture(
        webGlRef.createCubeMapTexture(cube.textures, cubeMapTexture)
      )
    }),
    [webGlRef]
  )

  useEffect(
    runOnPredicate(cubeMapTexture !== null, () => {
      updateShaderProgram(
        webGlRef.createShaderProgram(
          cubeMapTextureVertexShaderSource,
          cubeMapTextureFragmentShaderSource
        )
      )
    }),
    [cubeMapTexture]
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
      updateCubeBuffer({
        vertices: webGlRef.createStaticDrawArrayBuffer(
          cube.vertices.flat(),
          cubeBuffer.vertices
        ),
        indices: webGlRef.createElementArrayBuffer(
          cube.indices.flat(),
          cubeBuffer.indices
        ),
      })
    }),
    [shaderInfo]
  )

  useEffect(
    runOnPredicate(cubeBuffer.vertices !== null, () => {
      let shouldRender = true

      const renderScene = () => {
        webGlRef.renderScene(({ gl, projectionMatrix }) => {
          if (!shouldRender) {
            return
          }

          const viewMatrix = mat4.create()
          mat4.lookAt(
            viewMatrix,
            [4.0, 4.0, 4.0],
            [0.0, 0.0, 0.0],
            [0.0, 1.0, 0.0]
          )

          const time = parseInt(
            typeof performance !== "undefined"
              ? performance.now()
              : (0.0).toString()
          )

          const rotatedModelMatrix = mat4.create()
          mat4.fromTranslation(rotatedModelMatrix, cubeModelPosition)
          const rotationAngle = (((time / 30) % (360 * 6)) * Math.PI) / 180
          if (Math.floor(rotationAngle / (2 * Math.PI)) % 2 === 0) {
            mat4.rotateY(rotatedModelMatrix, rotatedModelMatrix, rotationAngle)
          } else {
            mat4.rotateZ(rotatedModelMatrix, rotatedModelMatrix, rotationAngle)
          }

          gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer.vertices)
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

          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeBuffer.indices)

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
            shaderInfo.fragment.uniformLocations.modelPosition_worldSpace,
            cubeModelPosition
          )

          gl.activeTexture(gl.TEXTURE0)
          gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeMapTexture)
          gl.uniform1i(
            shaderInfo.fragment.uniformLocations.cubeMapTextureSampler,
            0
          )

          gl.drawElements(
            gl.TRIANGLES,
            cube.indices.length * cube.indices[0].length,
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
    [cubeBuffer]
  )

  return (
    <div className="util text-center" style={{ padding: "1rem" }}>
      <canvas width="640" height="480" ref={canvasRef}>
        Cannot run WebGL examples (not supported)
      </canvas>
      <pre className="util text-left">
        {`
Scene:
    Model Position: ${coordArrToString(cubeModelPosition)}
`.trim()}
      </pre>
    </div>
  )
}

export default wrapExample(CubeMapTextureExample)
