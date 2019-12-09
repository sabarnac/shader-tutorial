import React, { useCallback, useState, useEffect } from "react"
import WebGlWrapper from "../../webgl-wrapper"
import { runOnPredicate } from "../../util"
import {
  ninthVertexShaderSource,
  ninthFragmentShaderSource,
} from "./ninth-example-shaders"
import { mat4 } from "gl-matrix"

const shaderProgramInfo = {
  vertex: {
    attributeLocations: {
      vertexPosition: "vec4",
    },
    uniformLocations: {},
  },
  fragment: {
    attributeLocations: {},
    uniformLocations: {
      resolution: "vec2",
    },
  },
}

const screenModelPosition = mat4.create()

const RandomImageGenerationNinthExample = () => {
  const screen = {
    vertices: [
      [-1.0, -1.0, 0.0],
      [-1.0, 1.0, 0.0],
      [1.0, -1.0, 0.0],
      [1.0, 1.0, 0.0],
    ],
  }
  const [webGlRef, updateWebGlRef] = useState(null)
  const [shaderProgram, updateShaderProgram] = useState(null)
  const [shaderInfo, updateShaderInfo] = useState(null)
  const [screenBuffer, updateScreenBuffer] = useState({ vertices: null })
  const [shouldRender, updateShouldRender] = useState(true)

  const canvasRef = useCallback(
    canvas => {
      if (canvas !== null) {
        updateWebGlRef(new WebGlWrapper(canvas, screenModelPosition))
      }
    },
    []
  )

  useEffect(
    runOnPredicate(webGlRef !== null, () => {
      updateShaderProgram(
        webGlRef.createShaderProgram(
          ninthVertexShaderSource,
          ninthFragmentShaderSource
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
      updateScreenBuffer({
        vertices: webGlRef.createStaticDrawArrayBuffer(
          screen.vertices.flat(),
          screenBuffer.vertices
        ),
      })
    }),
    [shaderInfo]
  )

  useEffect(
    runOnPredicate(screenBuffer.vertices !== null, () => {
      updateShouldRender(true)

      const renderScene = () => {
        webGlRef.renderScene(({ gl, resolution }) => {
          if (!shouldRender) {
            return
          }

          gl.bindBuffer(gl.ARRAY_BUFFER, screenBuffer.vertices)
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

          gl.useProgram(shaderProgram)

          gl.uniform2fv(
            shaderInfo.fragment.uniformLocations.resolution,
            resolution
          )

          gl.drawArrays(gl.TRIANGLE_STRIP, 0, screen.vertices.length)

          requestAnimationFrame(renderScene)
        })
      }
      requestAnimationFrame(renderScene)

      return () => updateShouldRender(false)
    }),
    [screenBuffer]
  )

  return (
    <div className="util text-center" style={{ padding: "1rem" }}>
      <canvas width="640" hninth="480" ref={canvasRef}>
        Cannot run WebGL examples (not supported)
      </canvas>
    </div>
  )
}

export default RandomImageGenerationNinthExample
