import React, { useCallback, useState, useEffect } from "react"
import WebGlWrapper from "../../webgl-wrapper"
import { runOnPredicate, coordArrToString, uvArrToString } from "../../util"
import {
  thirdVertexShaderSource,
  thirdFragmentShaderSource,
} from "./third-example-shaders"
import { mat4, vec3, vec4 } from "gl-matrix"
import texture from "../../../images/basics/texture.png"

const shaderProgramInfo = {
  vertex: {
    attributeLocations: {
      vertexPosition: "vec4",
      vertexUv: "vec2",
      vertexNormal: "vec4",
    },
    uniformLocations: {
      modelMatrix: "mat4",
      viewMatrix: "mat4",
      projectionMatrix: "mat4",

      lightPosition_worldSpace: "vec4",
      lightColor: "vec3",
      lightIntensity: "float",
      specularColor: "vec3",
    },
  },
  fragment: {
    attributeLocations: {},
    uniformLocations: {
      ambientFactor: "float",
      textureSampler: "sampler2D",
    },
  },
}

const lightModelPosition = vec4.fromValues(4.0, 4.0, 4.0, 1.0)
const lightColor = vec3.fromValues(0.3, 0.3, 0.3)
const lightIntensity = 50.0

const cubeModelPosition = mat4.create()
const cubeFaceUvs = [
  [0.0, 0.0],
  [1.0, 0.0],
  [0.0, 1.0],
  [1.0, 0.0],
  [0.0, 1.0],
  [1.0, 1.0],
]

const LightingThirdExample = () => {
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
    normals: [
      // Front normals
      [0.0, 0.0, 1.0],
      [0.0, 0.0, 1.0],
      [0.0, 0.0, 1.0],
      [0.0, 0.0, 1.0],
      [0.0, 0.0, 1.0],
      [0.0, 0.0, 1.0],
      // Left normals
      [-1.0, 0.0, 0.0],
      [-1.0, 0.0, 0.0],
      [-1.0, 0.0, 0.0],
      [-1.0, 0.0, 0.0],
      [-1.0, 0.0, 0.0],
      [-1.0, 0.0, 0.0],
      // Right normals
      [1.0, 0.0, 0.0],
      [1.0, 0.0, 0.0],
      [1.0, 0.0, 0.0],
      [1.0, 0.0, 0.0],
      [1.0, 0.0, 0.0],
      [1.0, 0.0, 0.0],
      // Top normals
      [0.0, 1.0, 0.0],
      [0.0, 1.0, 0.0],
      [0.0, 1.0, 0.0],
      [0.0, 1.0, 0.0],
      [0.0, 1.0, 0.0],
      [0.0, 1.0, 0.0],
      // Bottom normals
      [0.0, -1.0, 0.0],
      [0.0, -1.0, 0.0],
      [0.0, -1.0, 0.0],
      [0.0, -1.0, 0.0],
      [0.0, -1.0, 0.0],
      [0.0, -1.0, 0.0],
      // Back normals
      [0.0, 0.0, -1.0],
      [0.0, 0.0, -1.0],
      [0.0, 0.0, -1.0],
      [0.0, 0.0, -1.0],
      [0.0, 0.0, -1.0],
      [0.0, 0.0, -1.0],
    ],
    indices: [
      [0, 1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10, 11],
      [12, 13, 14, 15, 16, 17],
      [18, 19, 20, 21, 22, 23],
      [24, 25, 26, 27, 28, 29],
      [30, 31, 32, 33, 34, 35],
    ],
    texture: texture,
    ambientFactor: 0.1,
    specularColor: vec3.fromValues(0.0, 0.0, 1.0),
  }
  const [webGlRef, updateWebGlRef] = useState(null)
  const [shaderProgram, updateShaderProgram] = useState(null)
  const [shaderInfo, updateShaderInfo] = useState(null)
  const [cubeBuffer, updateCubeBuffer] = useState({
    vertices: null,
    uvs: null,
    normals: null,
    indices: null,
    texture: null,
  })
  const [shouldRender, updateShouldRender] = useState(true)

  const canvasRef = useCallback(canvas => {
    if (canvas !== null && webGlRef === null) {
      updateWebGlRef(new WebGlWrapper(canvas, cubeModelPosition))
    }
  }, [])

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
      updateCubeBuffer({
        vertices: webGlRef.createStaticDrawArrayBuffer(
          cube.vertices.flat(),
          cubeBuffer.vertices
        ),
        uvs: webGlRef.createStaticDrawArrayBuffer(
          cube.uvs.flat(),
          cubeBuffer.uvs
        ),
        normals: webGlRef.createStaticDrawArrayBuffer(
          cube.normals.flat(),
          cubeBuffer.normals
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
      const renderScene = () => {
        webGlRef.renderScene(
          ({ gl, projectionMatrix, viewMatrix, modelMatrix }) => {
            if (!shouldRender) {
              return
            }

            const time = parseInt(performance.now().toString())

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

            gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer.normals)
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
            gl.uniform3fv(
              shaderInfo.vertex.uniformLocations.specularColor,
              cube.specularColor
            )

            gl.uniform1f(
              shaderInfo.fragment.uniformLocations.ambientFactor,
              cube.ambientFactor
            )

            gl.activeTexture(gl.TEXTURE0)
            gl.bindTexture(gl.TEXTURE_2D, cubeBuffer.texture)
            gl.uniform1i(
              shaderInfo.fragment.uniformLocations.textureSampler,
              false,
              gl.TEXTURE0
            )

            gl.drawElements(
              gl.TRIANGLES,
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
    </div>
  )
}

export default LightingThirdExample
