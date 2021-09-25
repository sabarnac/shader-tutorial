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
import { blobsIndices, blobsVertices } from "./model-blobs"
import { reflectionFragmentShaderSource, reflectionVertexShaderSource } from "./reflection-example-shaders"
import {
  reflectionRefractionMapFragmentShaderSource as reflectionMapFragmentShaderSource,
  reflectionRefractionMapVertexShaderSource as reflectionMapVertexShaderSource,
} from "./reflection-refraction-map-example-shaders"
import { skyboxFragmentShaderSource, skyboxVertexShaderSource } from "./skybox-example-shaders"

const cubeShaderProgramInfo = {
  vertex: {
    attributeLocations: {
      vertexPosition: "vec4",
      vertexNormal: "vec3",
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
      cameraPosition_worldSpace: "vec4",
      cubeMapTextureSampler: "samplerCube",
    },
  },
}

const skyboxShaderProgramInfo = {
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

const blobsShaderProgramInfo = {
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

const modelReflectionPosition = vec4.fromValues(0.0, 0.0, 0.0, 1.0)
const modelReflectionFaces = [
  {
    name: "+X-Axis Face",
    id: "POSITIVE_X",
    center: [
      modelReflectionPosition[0] + 1.0,
      modelReflectionPosition[1],
      modelReflectionPosition[2],
    ],
    up: [0.0, -1.0, 0.0],
  },
  {
    name: "-X-Axis Face",
    id: "NEGATIVE_X",
    center: [
      modelReflectionPosition[0] - 1.0,
      modelReflectionPosition[1],
      modelReflectionPosition[2],
    ],
    up: [0.0, -1.0, 0.0],
  },
  {
    name: "+Y-Axis Face",
    id: "POSITIVE_Y",
    center: [
      modelReflectionPosition[0],
      modelReflectionPosition[1] + 1.0,
      modelReflectionPosition[2],
    ],
    up: [0.0, 0.0, 1.0],
  },
  {
    name: "-Y-Axis Face",
    id: "NEGATIVE_Y",
    center: [
      modelReflectionPosition[0],
      modelReflectionPosition[1] - 1.0,
      modelReflectionPosition[2],
    ],
    up: [0.0, 0.0, -1.0],
  },
  {
    name: "+Z-Axis Face",
    id: "POSITIVE_Z",
    center: [
      modelReflectionPosition[0],
      modelReflectionPosition[1],
      modelReflectionPosition[2] + 1.0,
    ],
    up: [0.0, -1.0, 0.0],
  },
  {
    name: "-Z-Axis Face",
    id: "NEGATIVE_Z",
    center: [
      modelReflectionPosition[0],
      modelReflectionPosition[1],
      modelReflectionPosition[2] - 1.0,
    ],
    up: [0.0, -1.0, 0.0],
  },
]

const cubeModelPosition = vec4.fromValues(0.0, 0.0, 0.0, 1.0)

const ReflectionExample = () => {
  const cube = {
    vertices: [
      // Front vertices
      [-0.75, -0.75, 0.75],
      [-0.75, 0.75, 0.75],
      [0.75, -0.75, 0.75],
      [-0.75, 0.75, 0.75],
      [0.75, -0.75, 0.75],
      [0.75, 0.75, 0.75],
      // Left vertices
      [-0.75, -0.75, -0.75],
      [-0.75, 0.75, -0.75],
      [-0.75, -0.75, 0.75],
      [-0.75, 0.75, -0.75],
      [-0.75, -0.75, 0.75],
      [-0.75, 0.75, 0.75],
      // Right vertices
      [0.75, -0.75, 0.75],
      [0.75, 0.75, 0.75],
      [0.75, -0.75, -0.75],
      [0.75, 0.75, 0.75],
      [0.75, -0.75, -0.75],
      [0.75, 0.75, -0.75],
      // Top vertices
      [-0.75, 0.75, 0.75],
      [-0.75, 0.75, -0.75],
      [0.75, 0.75, 0.75],
      [-0.75, 0.75, -0.75],
      [0.75, 0.75, 0.75],
      [0.75, 0.75, -0.75],
      // Bottom vertices
      [-0.75, -0.75, -0.75],
      [-0.75, -0.75, 0.75],
      [0.75, -0.75, -0.75],
      [-0.75, -0.75, 0.75],
      [0.75, -0.75, -0.75],
      [0.75, -0.75, 0.75],
      // Back vertices
      [0.75, -0.75, -0.75],
      [0.75, 0.75, -0.75],
      [-0.75, -0.75, -0.75],
      [0.75, 0.75, -0.75],
      [-0.75, -0.75, -0.75],
      [-0.75, 0.75, -0.75],
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
  }

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

  const blobs = {
    vertices: blobsVertices,
    indices: blobsIndices,
    texture: null,
  }

  const [webGlRef, updateWebGlRef] = useState(null)

  const [cubeShaderProgram, updateCubeShaderProgram] = useState(null)
  const [cubeShaderInfo, updateCubeShaderInfo] = useState(null)

  const [skyboxShaderProgram, updateSkyboxShaderProgram] = useState(null)
  const [skyboxShaderInfo, updateSkyboxShaderInfo] = useState(null)

  const [blobsShaderProgram, updateBlobsShaderProgram] = useState(null)
  const [blobsShaderInfo, updateBlobsShaderInfo] = useState(null)

  const [cubeBuffer, updateCubeBuffer] = useState({
    vertices: null,
    normals: null,
    indices: null,
  })

  const [skyboxBuffer, updateSkyboxBuffer] = useState({
    vertices: null,
    indices: null,
    texture: null,
  })

  const [blobsBuffer, updateBlobsBuffer] = useState({
    vertices: null,
    indices: null,
  })

  const [reflectionMapTexture, updateReflectionMapTexture] = useState(null)
  const [reflectionMapFramebuffer, updateReflectionMapFramebuffer] = useState(
    modelReflectionFaces.map(() => null)
  )

  const canvasRef = useCallback((canvas) => {
    if (canvas !== null) {
      updateWebGlRef(new WebGlWrapper(canvas, vec4.create()))
      return () =>
        updateWebGlRef((webGlRef) => {
          webGlRef.destroy()
          return null
        })
    }
  }, [])

  useEffect(
    runOnPredicate(webGlRef !== null, () => {
      updateCubeShaderProgram(
        webGlRef.createShaderProgram(
          reflectionVertexShaderSource,
          reflectionFragmentShaderSource
        )
      )
    }),
    [webGlRef]
  )

  useEffect(
    runOnPredicate(cubeShaderProgram !== null, () => {
      updateCubeShaderInfo(
        webGlRef.getDataLocations(cubeShaderProgram, cubeShaderProgramInfo)
      )
    }),
    [cubeShaderProgram]
  )

  useEffect(
    runOnPredicate(cubeShaderInfo !== null, () => {
      updateSkyboxShaderProgram(
        webGlRef.createShaderProgram(
          skyboxVertexShaderSource,
          skyboxFragmentShaderSource
        )
      )
    }),
    [cubeShaderInfo]
  )

  useEffect(
    runOnPredicate(skyboxShaderProgram !== null, () => {
      updateSkyboxShaderInfo(
        webGlRef.getDataLocations(skyboxShaderProgram, skyboxShaderProgramInfo)
      )
    }),
    [skyboxShaderProgram]
  )

  useEffect(
    runOnPredicate(skyboxShaderInfo !== null, () => {
      updateBlobsShaderProgram(
        webGlRef.createShaderProgram(
          reflectionMapVertexShaderSource,
          reflectionMapFragmentShaderSource
        )
      )
    }),
    [skyboxShaderInfo]
  )

  useEffect(
    runOnPredicate(blobsShaderProgram !== null, () => {
      updateBlobsShaderInfo(
        webGlRef.getDataLocations(blobsShaderProgram, blobsShaderProgramInfo)
      )
    }),
    [blobsShaderProgram]
  )

  useEffect(
    runOnPredicate(blobsShaderInfo !== null, () => {
      updateCubeBuffer({
        vertices: webGlRef.createStaticDrawArrayBuffer(
          cube.vertices.flat(),
          cubeBuffer.vertices
        ),
        normals: webGlRef.createStaticDrawArrayBuffer(
          cube.normals.flat(),
          cubeBuffer.normals
        ),
        indices: webGlRef.createElementArrayBuffer(
          cube.indices.flat(),
          cubeBuffer.indices
        ),
      })
    }),
    [blobsShaderInfo]
  )

  useEffect(
    runOnPredicate(cubeBuffer.vertices !== null, () => {
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
    [cubeBuffer]
  )

  useEffect(
    runOnPredicate(skyboxBuffer.vertices !== null, () => {
      updateBlobsBuffer({
        vertices: webGlRef.createStaticDrawArrayBuffer(
          blobs.vertices.flat(),
          blobsBuffer.vertices
        ),
        indices: webGlRef.createElementArrayBuffer(
          blobs.indices.flat(),
          blobsBuffer.indices
        ),
      })
    }),
    [skyboxBuffer]
  )

  useEffect(
    runOnPredicate(blobsBuffer.vertices !== null, () => {
      updateReflectionMapTexture(
        webGlRef.createCubeMapRenderTargetTexture(reflectionMapTexture)
      )
    }),
    [blobsBuffer]
  )

  useEffect(
    runOnPredicate(reflectionMapTexture !== null, () => {
      updateReflectionMapFramebuffer(
        modelReflectionFaces.map((face, i) =>
          webGlRef.createCubeMapTargetFramebuffer(
            reflectionMapTexture,
            face.id,
            reflectionMapFramebuffer[i],
            true
          )
        )
      )
    }),
    [reflectionMapTexture]
  )

  useEffect(
    runOnPredicate(
      reflectionMapFramebuffer.filter((framebuffer) => framebuffer !== null)
        .length === modelReflectionFaces.length,
      () => {
        let shouldRender = true

        const renderScene = () => {
          const time = parseInt(
            typeof performance !== "undefined"
              ? performance.now()
              : (0.0).toString()
          )

          reflectionMapFramebuffer.forEach((framebuffer, i) => {
            webGlRef.renderToCubeMapFramebuffer(framebuffer, () => {
              webGlRef.renderScene(({ gl }) => {
                if (!shouldRender) {
                  return
                }

                const depthProjectionMatrix = mat4.create()
                mat4.perspective(
                  depthProjectionMatrix,
                  (90 * Math.PI) / 180,
                  1.0,
                  0.1,
                  50.0
                )

                gl.clearColor(0.0, 0.0, 0.0, 1.0)
                gl.clearDepth(1.0)
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

                const modelReflectionViewMatrix = mat4.create()
                mat4.lookAt(
                  modelReflectionViewMatrix,
                  modelReflectionPosition,
                  modelReflectionFaces[i].center,
                  modelReflectionFaces[i].up
                )

                {
                  gl.useProgram(skyboxShaderProgram)

                  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxBuffer.vertices)
                  gl.vertexAttribPointer(
                    skyboxShaderInfo.vertex.attributeLocations.vertexPosition,
                    3,
                    gl.FLOAT,
                    false,
                    0,
                    0
                  )
                  gl.enableVertexAttribArray(
                    skyboxShaderInfo.vertex.attributeLocations.vertexPosition
                  )

                  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, skyboxBuffer.indices)

                  gl.uniformMatrix4fv(
                    skyboxShaderInfo.vertex.uniformLocations.projectionMatrix,
                    false,
                    depthProjectionMatrix
                  )
                  gl.uniformMatrix4fv(
                    skyboxShaderInfo.vertex.uniformLocations.viewMatrix,
                    false,
                    modelReflectionViewMatrix
                  )
                  gl.uniformMatrix4fv(
                    skyboxShaderInfo.vertex.uniformLocations.modelMatrix,
                    false,
                    mat4.create()
                  )

                  gl.activeTexture(gl.TEXTURE0)
                  gl.bindTexture(gl.TEXTURE_CUBE_MAP, skyboxBuffer.texture)
                  gl.uniform1i(
                    skyboxShaderInfo.fragment.uniformLocations.skyboxSampler,
                    0
                  )

                  gl.drawElements(
                    gl.TRIANGLES,
                    skybox.indices.length * skybox.indices[0].length,
                    gl.UNSIGNED_SHORT,
                    0
                  )
                }

                {
                  const rotatedModelMatrix = mat4.create()
                  const rotationAngle =
                    (((time / 30) % (360 * 6)) * Math.PI) / 180
                  mat4.rotateZ(
                    rotatedModelMatrix,
                    rotatedModelMatrix,
                    rotationAngle
                  )
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

                  gl.useProgram(blobsShaderProgram)

                  gl.bindBuffer(gl.ARRAY_BUFFER, blobsBuffer.vertices)
                  gl.vertexAttribPointer(
                    blobsShaderInfo.vertex.attributeLocations.vertexPosition,
                    3,
                    gl.FLOAT,
                    false,
                    0,
                    0
                  )
                  gl.enableVertexAttribArray(
                    blobsShaderInfo.vertex.attributeLocations.vertexPosition
                  )

                  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, blobsBuffer.indices)

                  gl.uniformMatrix4fv(
                    blobsShaderInfo.vertex.uniformLocations.projectionMatrix,
                    false,
                    depthProjectionMatrix
                  )
                  gl.uniformMatrix4fv(
                    blobsShaderInfo.vertex.uniformLocations.viewMatrix,
                    false,
                    modelReflectionViewMatrix
                  )
                  gl.uniformMatrix4fv(
                    blobsShaderInfo.vertex.uniformLocations.modelMatrix,
                    false,
                    rotatedModelMatrix
                  )

                  gl.drawElements(
                    gl.TRIANGLES,
                    blobs.indices.length,
                    gl.UNSIGNED_SHORT,
                    0
                  )
                }
              })
            })
          })

          webGlRef.renderScene(({ gl }) => {
            if (!shouldRender) {
              return
            }

            const depthProjectionMatrix = mat4.create()
            mat4.perspective(
              depthProjectionMatrix,
              (100 * Math.PI) / 180,
              1.0,
              0.1,
              50.0
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

            const cameraPosition = vec4.fromValues(0.0, 0.0, 3.5, 1.0)
            vec4.transformMat4(
              cameraPosition,
              cameraPosition,
              rotatedCameraMatrix
            )
            const upVector = vec4.fromValues(0.0, 1.0, 0.0, 1.0)
            vec4.transformMat4(upVector, upVector, rotatedCameraMatrix)

            const viewMatrix = mat4.create()
            mat4.lookAt(
              viewMatrix,
              [cameraPosition[0], cameraPosition[1], cameraPosition[2]],
              [0.0, 0.0, 0.0],
              [upVector[0], upVector[1], upVector[2]]
            )

            gl.clearColor(0.0, 0.0, 0.0, 1.0)
            gl.clearDepth(1.0)
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

            {
              gl.useProgram(skyboxShaderProgram)

              gl.bindBuffer(gl.ARRAY_BUFFER, skyboxBuffer.vertices)
              gl.vertexAttribPointer(
                skyboxShaderInfo.vertex.attributeLocations.vertexPosition,
                3,
                gl.FLOAT,
                false,
                0,
                0
              )
              gl.enableVertexAttribArray(
                skyboxShaderInfo.vertex.attributeLocations.vertexPosition
              )

              gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, skyboxBuffer.indices)

              gl.uniformMatrix4fv(
                skyboxShaderInfo.vertex.uniformLocations.projectionMatrix,
                false,
                depthProjectionMatrix
              )
              gl.uniformMatrix4fv(
                skyboxShaderInfo.vertex.uniformLocations.viewMatrix,
                false,
                viewMatrix
              )
              gl.uniformMatrix4fv(
                skyboxShaderInfo.vertex.uniformLocations.modelMatrix,
                false,
                mat4.create()
              )

              gl.activeTexture(gl.TEXTURE0)
              gl.bindTexture(gl.TEXTURE_CUBE_MAP, skyboxBuffer.texture)
              gl.uniform1i(
                skyboxShaderInfo.fragment.uniformLocations.skyboxSampler,
                0
              )

              gl.drawElements(
                gl.TRIANGLES,
                skybox.indices.length * skybox.indices[0].length,
                gl.UNSIGNED_SHORT,
                0
              )
            }

            {
              const rotatedModelMatrix = mat4.create()
              const rotationAngle = (((time / 30) % (360 * 6)) * Math.PI) / 180
              mat4.rotateZ(
                rotatedModelMatrix,
                rotatedModelMatrix,
                rotationAngle
              )
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

              gl.useProgram(blobsShaderProgram)

              gl.bindBuffer(gl.ARRAY_BUFFER, blobsBuffer.vertices)
              gl.vertexAttribPointer(
                blobsShaderInfo.vertex.attributeLocations.vertexPosition,
                3,
                gl.FLOAT,
                false,
                0,
                0
              )
              gl.enableVertexAttribArray(
                blobsShaderInfo.vertex.attributeLocations.vertexPosition
              )

              gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, blobsBuffer.indices)

              gl.uniformMatrix4fv(
                blobsShaderInfo.vertex.uniformLocations.projectionMatrix,
                false,
                depthProjectionMatrix
              )
              gl.uniformMatrix4fv(
                blobsShaderInfo.vertex.uniformLocations.viewMatrix,
                false,
                viewMatrix
              )
              gl.uniformMatrix4fv(
                blobsShaderInfo.vertex.uniformLocations.modelMatrix,
                false,
                rotatedModelMatrix
              )

              gl.drawElements(
                gl.TRIANGLES,
                blobs.indices.length,
                gl.UNSIGNED_SHORT,
                0
              )
            }

            {
              gl.useProgram(cubeShaderProgram)

              gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer.vertices)
              gl.vertexAttribPointer(
                cubeShaderInfo.vertex.attributeLocations.vertexPosition,
                3,
                gl.FLOAT,
                false,
                0,
                0
              )
              gl.enableVertexAttribArray(
                cubeShaderInfo.vertex.attributeLocations.vertexPosition
              )

              gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer.normals)
              gl.vertexAttribPointer(
                cubeShaderInfo.vertex.attributeLocations.vertexNormal,
                3,
                gl.FLOAT,
                false,
                0,
                0
              )
              gl.enableVertexAttribArray(
                cubeShaderInfo.vertex.attributeLocations.vertexNormal
              )

              gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeBuffer.indices)

              gl.uniformMatrix4fv(
                cubeShaderInfo.vertex.uniformLocations.projectionMatrix,
                false,
                depthProjectionMatrix
              )
              gl.uniformMatrix4fv(
                cubeShaderInfo.vertex.uniformLocations.viewMatrix,
                false,
                viewMatrix
              )
              gl.uniformMatrix4fv(
                cubeShaderInfo.vertex.uniformLocations.modelMatrix,
                false,
                mat4.create()
              )

              gl.uniform4fv(
                cubeShaderInfo.fragment.uniformLocations
                  .modelPosition_worldSpace,
                cubeModelPosition
              )
              gl.uniform4fv(
                cubeShaderInfo.fragment.uniformLocations
                  .cameraPosition_worldSpace,
                cameraPosition
              )

              gl.activeTexture(gl.TEXTURE0)
              gl.bindTexture(gl.TEXTURE_CUBE_MAP, reflectionMapTexture)
              gl.uniform1i(
                cubeShaderInfo.fragment.uniformLocations.cubeMapTextureSampler,
                0
              )

              gl.drawElements(
                gl.TRIANGLES,
                cube.indices.length * cube.indices[0].length,
                gl.UNSIGNED_SHORT,
                0
              )
            }
          })

          requestAnimationFrame(renderScene)
        }
        requestAnimationFrame(renderScene)

        return () => {
          shouldRender = false
        }
      }
    ),
    [reflectionMapFramebuffer]
  )

  return (
    <div className="util text-center" style={{ padding: "1rem" }}>
      <canvas width="640" height="480" ref={canvasRef}>
        Cannot run WebGL examples (not supported)
      </canvas>
    </div>
  )
}

export default wrapExample(ReflectionExample)
