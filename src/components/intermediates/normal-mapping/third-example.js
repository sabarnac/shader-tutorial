import { mat4, vec2, vec3, vec4 } from "gl-matrix";
import React, { useCallback, useEffect, useState } from "react";

import normalTexture from "../../../images/intermediates/normal.png";
import texture from "../../../images/intermediates/texture-2.png";
import { coordArrToString, runOnPredicate } from "../../util";
import WebGlWrapper from "../../webgl-wrapper";
import { thirdFragmentShaderSource, thirdVertexShaderSource } from "./third-example-shaders";

const shaderProgramInfo = {
  vertex: {
    attributeLocations: {
      vertexPosition: "vec4",
      vertexUv: "vec2",
      vertexNormal: "vec3",
      vertexTangent: "vec3",
      vertexBiTangent: "vec3",
    },
    uniformLocations: {
      modelMatrix: "mat4",
      viewMatrix: "mat4",
      projectionMatrix: "mat4",

      lightPosition_worldSpace: "vec4",
      lightColor: "vec3",
      lightIntensity: "float",
      specularLobeFactor: "float",
    },
  },
  fragment: {
    attributeLocations: {},
    uniformLocations: {
      textureSampler: "sampler2D",
      normalTextureSampler: "sampler2D",
    },
  },
}

const lightModelPosition = vec4.fromValues(4.0, 0.0, 4.0, 1.0)
const lightColor = vec3.fromValues(1.0, 1.0, 1.0)
const lightIntensity = 50.0

const squareModelPosition = mat4.create()

const NormalMappingThirdExample = () => {
  const square = {
    vertices: [
      [-1.0, -1.0, 0.0],
      [-1.0, 1.0, 0.0],
      [1.0, -1.0, 0.0],
      [-1.0, 1.0, 0.0],
      [1.0, -1.0, 0.0],
      [1.0, 1.0, 0.0],
    ],
    uvs: [
      [0.0, 1.0],
      [0.0, 0.0],
      [1.0, 1.0],
      [0.0, 0.0],
      [1.0, 1.0],
      [1.0, 0.0],
    ],
    normals: [
      [0.0, 0.0, 1.0],
      [0.0, 0.0, 1.0],
      [0.0, 0.0, 1.0],
      [0.0, 0.0, 1.0],
      [0.0, 0.0, 1.0],
      [0.0, 0.0, 1.0],
    ],
    tangents: [],
    biTangents: [],
    indices: [[0, 1, 2, 3, 4, 5]],
    texture: texture,
    normalTexture: normalTexture,
    specularLobeFactor: 50.0,
  }
  for (let i = 0; i < square.vertices.length; i += 3) {
    const v0 = vec3.clone(square.vertices[i + 0])
    const v1 = vec3.clone(square.vertices[i + 1])
    const v2 = vec3.clone(square.vertices[i + 2])

    const uv0 = vec2.clone(square.uvs[i + 0])
    const uv1 = vec2.clone(square.uvs[i + 1])
    const uv2 = vec2.clone(square.uvs[i + 2])

    const deltaPos1 = vec3.subtract(vec3.create(), v1, v0)
    const deltaPos2 = vec3.subtract(vec3.create(), v2, v0)

    const deltaUv1 = vec2.subtract(vec2.create(), uv1, uv0)
    const deltaUv2 = vec2.subtract(vec2.create(), uv2, uv0)

    const r = 1.0 / (deltaUv1[0] * deltaUv2[1] - deltaUv1[1] * deltaUv2[0])
    const tangent = Array.from(
      vec3.multiply(
        vec3.create(),
        vec3.subtract(
          vec3.create(),
          vec3.multiply(vec3.create(), deltaPos1, [
            deltaUv2[1],
            deltaUv2[1],
            deltaUv2[1],
          ]),
          vec3.multiply(vec3.create(), deltaPos2, [
            deltaUv1[1],
            deltaUv1[1],
            deltaUv1[1],
          ])
        ),
        [r, r, r]
      )
    )
    const biTangent = Array.from(
      vec3.multiply(
        vec3.create(),
        vec3.subtract(
          vec3.create(),
          vec3.multiply(vec3.create(), deltaPos2, [
            deltaUv1[0],
            deltaUv1[0],
            deltaUv1[0],
          ]),
          vec3.multiply(vec3.create(), deltaPos1, [
            deltaUv2[0],
            deltaUv2[0],
            deltaUv2[0],
          ])
        ),
        [r, r, r]
      )
    )

    square.tangents.push(tangent, tangent, tangent)
    square.biTangents.push(biTangent, biTangent, biTangent)
  }
  const [webGlRef, updateWebGlRef] = useState(null)
  const [shaderProgram, updateShaderProgram] = useState(null)
  const [shaderInfo, updateShaderInfo] = useState(null)
  const [squareBuffer, updatesquareBuffer] = useState({
    vertices: null,
    uvs: null,
    normals: null,
    tangents: null,
    biTangents: null,
    indices: null,
    texture: null,
    normalTexture: null,
  })
  const [shouldRender, updateShouldRender] = useState(true)

  const canvasRef = useCallback(canvas => {
    if (canvas !== null) {
      updateWebGlRef(new WebGlWrapper(canvas, squareModelPosition))
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
      updatesquareBuffer({
        vertices: webGlRef.createStaticDrawArrayBuffer(
          square.vertices.flat(),
          squareBuffer.vertices
        ),
        uvs: webGlRef.createStaticDrawArrayBuffer(
          square.uvs.flat(),
          squareBuffer.uvs
        ),
        normals: webGlRef.createStaticDrawArrayBuffer(
          square.normals.flat(),
          squareBuffer.normals
        ),
        tangents: webGlRef.createStaticDrawArrayBuffer(
          square.tangents.flat(),
          squareBuffer.tangents
        ),
        biTangents: webGlRef.createStaticDrawArrayBuffer(
          square.biTangents.flat(),
          squareBuffer.biTangents
        ),
        indices: webGlRef.createElementArrayBuffer(
          square.indices.flat(),
          squareBuffer.indices
        ),
        texture: webGlRef.createImageTexture(
          square.texture,
          squareBuffer.texture
        ),
        normalTexture: webGlRef.createImageTexture(
          square.normalTexture,
          squareBuffer.normalTexture
        ),
      })
    }),
    [shaderInfo]
  )

  useEffect(
    runOnPredicate(squareBuffer.vertices !== null, () => {
      updateShouldRender(true)

      const renderScene = () => {
        webGlRef.renderScene(
          ({ gl, projectionMatrix, viewMatrix, modelMatrix }) => {
            if (!shouldRender) {
              return
            }

            const rotatedModelMatrix = mat4.create()
            const rotationAngle = (30 * Math.PI) / 180
            mat4.translate(rotatedModelMatrix, modelMatrix, [0.0, 0.0, 2.0])
            mat4.rotateY(rotatedModelMatrix, rotatedModelMatrix, rotationAngle)

            gl.bindBuffer(gl.ARRAY_BUFFER, squareBuffer.vertices)
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

            gl.bindBuffer(gl.ARRAY_BUFFER, squareBuffer.uvs)
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

            gl.bindBuffer(gl.ARRAY_BUFFER, squareBuffer.normals)
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

            gl.bindBuffer(gl.ARRAY_BUFFER, squareBuffer.tangents)
            gl.vertexAttribPointer(
              shaderInfo.vertex.attributeLocations.vertexTangent,
              3,
              gl.FLOAT,
              false,
              0,
              0
            )
            gl.enableVertexAttribArray(
              shaderInfo.vertex.attributeLocations.vertexTangent
            )

            gl.bindBuffer(gl.ARRAY_BUFFER, squareBuffer.biTangents)
            gl.vertexAttribPointer(
              shaderInfo.vertex.attributeLocations.vertexBiTangent,
              3,
              gl.FLOAT,
              false,
              0,
              0
            )
            gl.enableVertexAttribArray(
              shaderInfo.vertex.attributeLocations.vertexBiTangent
            )

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareBuffer.indices)

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
            gl.uniform1f(
              shaderInfo.vertex.uniformLocations.specularLobeFactor,
              square.specularLobeFactor
            )

            gl.activeTexture(gl.TEXTURE0)
            gl.bindTexture(gl.TEXTURE_2D, squareBuffer.texture)
            gl.uniform1i(shaderInfo.fragment.uniformLocations.textureSampler, 0)

            gl.activeTexture(gl.TEXTURE1)
            gl.bindTexture(gl.TEXTURE_2D, squareBuffer.normalTexture)
            gl.uniform1i(
              shaderInfo.fragment.uniformLocations.normalTextureSampler,
              1
            )

            gl.drawElements(
              gl.TRIANGLES,
              square.indices.length * square.indices[0].length,
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
    [squareBuffer]
  )

  const colorCoords = { x: "r", y: "g", z: "b" }

  return (
    <div className="util text-center" style={{ padding: "1rem" }}>
      <canvas width="640" height="480" ref={canvasRef}>
        Cannot run WebGL examples (not supported)
      </canvas>
      <pre className="util text-left">
        {`
Square:
    World Position: ${coordArrToString([0.0, 0.0, 0.0])}
    Lighting:
        Lobe Density: ${square.specularLobeFactor}
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

export default NormalMappingThirdExample
