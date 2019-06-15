import React, { useCallback, useState, useEffect } from "react"
import WebGlWrapper from "../../webgl-wrapper"
import { runOnPredicate, coordArrToString } from "../../util"
import {
  firstVertexShaderSource,
  firstFragmentShaderSource,
} from "./first-example-shaders"
import { mat4 } from "gl-matrix"
import texture from "../../../images/intermediates/texture-2.png"

const shaderProgramInfo = {
  vertex: {
    attributeLocations: {
      vertexPosition: "vec4",
      vertexUv: "vec2",
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
      textureSampler: "sampler2D",
    },
  },
}

const squareModelPosition = mat4.create()

const NormalMappingFirstExample = () => {
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
      [0.0, 0.0],
      [0.0, 1.0],
      [1.0, 0.0],
      [0.0, 1.0],
      [1.0, 0.0],
      [1.0, 1.0],
    ],
    indices: [[0, 1, 2, 3, 4, 5]],
    texture: texture,
  }
  const [webGlRef, updateWebGlRef] = useState(null)
  const [shaderProgram, updateShaderProgram] = useState(null)
  const [shaderInfo, updateShaderInfo] = useState(null)
  const [squareBuffer, updatesquareBuffer] = useState({
    vertices: null,
    uvs: null,
    indices: null,
    texture: null,
  })
  const [shouldRender, updateShouldRender] = useState(true)

  const canvasRef = useCallback(
    canvas => {
      if (canvas !== null) {
        updateWebGlRef(new WebGlWrapper(canvas, squareModelPosition))
      }
    },
    [firstVertexShaderSource, firstFragmentShaderSource]
  )

  useEffect(
    runOnPredicate(webGlRef !== null, () => {
      updateShaderProgram(
        webGlRef.createShaderProgram(
          firstVertexShaderSource,
          firstFragmentShaderSource
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
        indices: webGlRef.createElementArrayBuffer(
          square.indices.flat(),
          squareBuffer.indices
        ),
        texture: webGlRef.createImageTexture(
          square.texture,
          squareBuffer.texture
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

            gl.activeTexture(gl.TEXTURE0)
            gl.bindTexture(gl.TEXTURE_2D, squareBuffer.texture)
            gl.uniform1i(shaderInfo.fragment.uniformLocations.textureSampler, 0)

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

  return (
    <div className="util text-center" style={{ padding: "1rem" }}>
      <canvas width="640" height="480" ref={canvasRef}>
        Cannot run WebGL examples (not supported)
      </canvas>
      <pre className="util text-left">
        {`
Square:
    World Position: ${coordArrToString([0.0, 0.0, 0.0])}
`.trim()}
      </pre>
    </div>
  )
}

export default NormalMappingFirstExample
