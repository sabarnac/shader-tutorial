import React, { useCallback, useState, useEffect } from "react"
import WebGlWrapper from "../../webgl-wrapper"
import { runOnPredicate, coordArrToString, uvArrToString } from "../../util"
import {
  secondVertexShaderSource,
  secondFragmentShaderSource,
} from "./second-example-shaders"
import { mat4 } from "gl-matrix"
import texture from "../../../images/basics/texture.png"

const shaderProgramInfo = {
  vertex: {
    attributeLocations: {
      vertexPosition: "vec4",
      vertexUv: "vec2",
    },
    uniformLocations: {
      mvpMatrix: "mat4",
    },
  },
  fragment: {
    attributeLocations: {},
    uniformLocations: {
      colorShift: "float",
      textureSampler: "sampler2D",
    },
  },
}

const cubeModelPosition = mat4.create()
const cubeFaceUvs = [[0.0, 0.0], [1.0, 0.0], [0.0, 1.0], [1.0, 1.0]]

const FragmentShaderTwoSecondExample = () => {
  const cube = {
    vertices: [
      // Front vertices
      [-1.0, -1.0, 1.0],
      [-1.0, 1.0, 1.0],
      [1.0, -1.0, 1.0],
      [1.0, 1.0, 1.0],
      // Left vertices
      [-1.0, -1.0, 1.0],
      [-1.0, 1.0, 1.0],
      [-1.0, -1.0, -1.0],
      [-1.0, 1.0, -1.0],
      // Right vertices
      [1.0, -1.0, 1.0],
      [1.0, 1.0, 1.0],
      [1.0, -1.0, -1.0],
      [1.0, 1.0, -1.0],
      // Top vertices
      [-1.0, 1.0, 1.0],
      [1.0, 1.0, 1.0],
      [-1.0, 1.0, -1.0],
      [1.0, 1.0, -1.0],
      // Bottom vertices
      [-1.0, -1.0, 1.0],
      [1.0, -1.0, 1.0],
      [-1.0, -1.0, -1.0],
      [1.0, -1.0, -1.0],
      // Back vertices
      [-1.0, -1.0, -1.0],
      [-1.0, 1.0, -1.0],
      [1.0, -1.0, -1.0],
      [1.0, 1.0, -1.0],
    ],
    uvs: [
      // Front UVs
      ...cubeFaceUvs,
      // Left UVs
      ...cubeFaceUvs,
      // Right UVs
      ...cubeFaceUvs,
      // Top UVs
      ...cubeFaceUvs,
      // Bottom UVs
      ...cubeFaceUvs,
      // Back UVs
      ...cubeFaceUvs,
    ],
    indices: [
      [0, 1, 2, 3],
      [4, 5, 6, 7],
      [8, 9, 10, 11],
      [12, 13, 14, 15],
      [16, 17, 18, 19],
      [20, 21, 22, 23],
    ],
    texture: texture,
  }
  const [webGlRef, updateWebGlRef] = useState(null)
  const [shaderProgram, updateShaderProgram] = useState(null)
  const [shaderInfo, updateShaderInfo] = useState(null)
  const [cubeBuffer, updateCubeBuffer] = useState({
    vertices: null,
    uvs: null,
    indices: null,
    texture: null,
  })
  const [shouldRender, updateShouldRender] = useState(true)
  const [colorShift, updateColorShift] = useState(0)

  const canvasRef = useCallback(canvas => {
    if (canvas !== null && webGlRef === null) {
      updateWebGlRef(new WebGlWrapper(canvas, cubeModelPosition))
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
      updateCubeBuffer({
        vertices: webGlRef.createStaticDrawArrayBuffer(
          cube.vertices.flat(),
          cubeBuffer.vertices
        ),
        uvs: webGlRef.createStaticDrawArrayBuffer(
          cube.uvs.flat(),
          cubeBuffer.uvs
        ),
        indices: webGlRef.createElementArrayBuffer(
          cube.indices.flat(),
          cubeBuffer.indices
        ),
        texture: webGlRef.createImageTexture(cube.texture, cubeBuffer.texture),
      })
    }),
    [shaderInfo]
  )

  useEffect(
    runOnPredicate(cubeBuffer.vertices !== null, () => {
      updateShouldRender(true)
      let then = parseInt(performance.now().toString())

      const renderScene = () => {
        webGlRef.renderScene(
          ({ gl, projectionMatrix, viewMatrix, modelMatrix }) => {
            if (!shouldRender) {
              return
            }

            const time = parseInt(performance.now().toString())

            const timeSlice = time % 4000
            const colorShift =
              1 - (timeSlice >= 2000 ? 4000 - timeSlice : timeSlice) / 1000

            if (time - then > 100) {
              then = time
              updateColorShift(colorShift)
            }

            const rotatedModelMatrix = mat4.create()
            const rotationAngle = (((time / 30) % (360 * 6)) * Math.PI) / 180
            mat4.rotateZ(rotatedModelMatrix, modelMatrix, rotationAngle)
            mat4.rotateX(
              rotatedModelMatrix,
              rotatedModelMatrix,
              rotationAngle / 2
            )
            mat4.rotateY(
              rotatedModelMatrix,
              rotatedModelMatrix,
              rotationAngle / 3
            )

            const mvpMatrix = mat4.create()
            mat4.multiply(mvpMatrix, viewMatrix, rotatedModelMatrix)
            mat4.multiply(mvpMatrix, projectionMatrix, mvpMatrix)

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

            gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer.uvs)
            gl.vertexAttribPointer(
              shaderInfo.vertex.attributeLocations.vertexUv,
              2,
              gl.FLOAT,
              false,
              0,
              0
            )
            gl.enableVertexAttribArray(
              shaderInfo.vertex.attributeLocations.vertexUv
            )

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeBuffer.indices)

            gl.useProgram(shaderProgram)

            gl.uniformMatrix4fv(
              shaderInfo.vertex.uniformLocations.mvpMatrix,
              false,
              mvpMatrix
            )
            gl.uniform1f(
              shaderInfo.fragment.uniformLocations.colorShift,
              colorShift
            )

            gl.activeTexture(gl.TEXTURE0)
            gl.bindTexture(gl.TEXTURE_2D, cubeBuffer.texture)
            gl.uniform1i(
              shaderInfo.fragment.uniformLocations.textureSampler,
              false,
              gl.TEXTURE0
            )

            gl.drawElements(
              gl.TRIANGLE_STRIP,
              cube.indices.length * cube.indices[0].length,
              gl.UNSIGNED_SHORT,
              0
            )

            requestAnimationFrame(renderScene)
          }
        )
      }
      requestAnimationFrame(renderScene)

      return () => updateShouldRender(false)
    }),
    [cubeBuffer]
  )

  return (
    <div className="util text-center" style={{ padding: "1rem" }}>
      <canvas width="640" height="480" ref={canvasRef}>
        Cannot run WebGL examples (not supported)
      </canvas>
      <pre>
        {`
Vertex 1: ${coordArrToString(cube.vertices[0])}
Vertex 2: ${coordArrToString(cube.vertices[1])}
Vertex 3: ${coordArrToString(cube.vertices[2])}
Vertex 4: ${coordArrToString(cube.vertices[3])}
Vertex 5: ${coordArrToString(cube.vertices[20])}
Vertex 6: ${coordArrToString(cube.vertices[21])}
Vertex 7: ${coordArrToString(cube.vertices[22])}
Vertex 8: ${coordArrToString(cube.vertices[23])}
`.trim()}
      </pre>
      <pre>
        {`
Face UV:
Vertex 1 UV: ${uvArrToString(cubeFaceUvs[0])}
Vertex 2 UV: ${uvArrToString(cubeFaceUvs[1])}
Vertex 3 UV: ${uvArrToString(cubeFaceUvs[2])}
Vertex 4 UV: ${uvArrToString(cubeFaceUvs[3])}
`.trim()}
      </pre>
      <pre>Color Shift: {colorShift.toFixed(6)}</pre>
    </div>
  )
}

export default FragmentShaderTwoSecondExample
