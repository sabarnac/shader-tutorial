import { mat4 } from "gl-matrix"
import React, { useEffect, useRef, useState } from "react"

import texture from "../../../images/intermediates/texture.png"
import { coordArrToString, runOnPredicate, uvArrToString } from "../../util"
import wrapExample from "../../webgl-example-view"
import WebGlWrapper from "../../webgl-wrapper"
import { secondFragmentShaderSource, secondVertexShaderSource } from "./second-example-shaders"

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
      time: "float",
      colorTextureSampler: "sampler2D",
    },
  },
};

const cubeModelPosition = mat4.create();
const cubeFaceUvs = [
  [0.0, 0.0],
  [0.0, 1.0],
  [1.0, 0.0],
  [0.0, 1.0],
  [1.0, 0.0],
  [1.0, 1.0],
];

const ColorMappingSecondExample = () => {
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
      [-1.0, -1.0, -1.0],
      [-1.0, 1.0, -1.0],
      [-1.0, -1.0, 1.0],
      [-1.0, 1.0, -1.0],
      [-1.0, -1.0, 1.0],
      [-1.0, 1.0, 1.0],
      // Right vertices
      [1.0, -1.0, 1.0],
      [1.0, 1.0, 1.0],
      [1.0, -1.0, -1.0],
      [1.0, 1.0, 1.0],
      [1.0, -1.0, -1.0],
      [1.0, 1.0, -1.0],
      // Top vertices
      [-1.0, 1.0, 1.0],
      [-1.0, 1.0, -1.0],
      [1.0, 1.0, 1.0],
      [-1.0, 1.0, -1.0],
      [1.0, 1.0, 1.0],
      [1.0, 1.0, -1.0],
      // Bottom vertices
      [-1.0, -1.0, -1.0],
      [-1.0, -1.0, 1.0],
      [1.0, -1.0, -1.0],
      [-1.0, -1.0, 1.0],
      [1.0, -1.0, -1.0],
      [1.0, -1.0, 1.0],
      // Back vertices
      [1.0, -1.0, -1.0],
      [1.0, 1.0, -1.0],
      [-1.0, -1.0, -1.0],
      [1.0, 1.0, -1.0],
      [-1.0, -1.0, -1.0],
      [-1.0, 1.0, -1.0],
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
      [0, 1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10, 11],
      [12, 13, 14, 15, 16, 17],
      [18, 19, 20, 21, 22, 23],
      [24, 25, 26, 27, 28, 29],
      [30, 31, 32, 33, 34, 35],
    ],
    texture: texture,
  };
  const [webGlRef, updateWebGlRef] = useState(null);
  const [shaderProgram, updateShaderProgram] = useState(null);
  const [shaderInfo, updateShaderInfo] = useState(null);
  const [cubeBuffer, updateCubeBuffer] = useState({
    vertices: null,
    uvs: null,
    indices: null,
    texture: null,
  });

  const [time, updateTime] = useState(
    typeof performance !== "undefined" ? performance.now() : 0.0,
  );

  const canvasRef = useRef();
  useEffect(() => {
    if (canvasRef.current !== null) {
      const newWebGlRef = new WebGlWrapper(
        canvasRef.current,
        cubeModelPosition,
      );
      updateWebGlRef(newWebGlRef);

      return () => {
        updateWebGlRef(null);
        newWebGlRef.destroy();
      };
    }
  }, [canvasRef]);

  useEffect(
    runOnPredicate(webGlRef !== null, () => {
      updateShaderProgram(
        webGlRef.createShaderProgram(
          secondVertexShaderSource,
          secondFragmentShaderSource,
        ),
      );
    }),
    [webGlRef],
  );

  useEffect(
    runOnPredicate(shaderProgram !== null, () => {
      updateShaderInfo(
        webGlRef.getDataLocations(shaderProgram, shaderProgramInfo),
      );
    }),
    [shaderProgram],
  );

  useEffect(
    runOnPredicate(shaderInfo !== null, () => {
      updateCubeBuffer({
        vertices: webGlRef.createStaticDrawArrayBuffer(
          cube.vertices.flat(),
          cubeBuffer.vertices,
        ),
        uvs: webGlRef.createStaticDrawArrayBuffer(
          cube.uvs.flat(),
          cubeBuffer.uvs,
        ),
        indices: webGlRef.createElementArrayBuffer(
          cube.indices.flat(),
          cubeBuffer.indices,
        ),
        texture: webGlRef.createImageTexture(cube.texture, cubeBuffer.texture),
      });
    }),
    [shaderInfo],
  );

  useEffect(
    runOnPredicate(cubeBuffer.vertices !== null, () => {
      let shouldRender = true;
      let then = parseInt(
        typeof performance !== "undefined"
          ? performance.now()
          : (0.0).toString(),
      );

      const renderScene = () => {
        webGlRef.renderScene(
          ({ gl, projectionMatrix, viewMatrix, modelMatrix }) => {
            if (!shouldRender) {
              return;
            }

            const currentTime = parseInt(
              typeof performance !== "undefined"
                ? performance.now()
                : (0.0).toString(),
            );

            if (currentTime - then > 100) {
              then = currentTime;
              updateTime(currentTime);
            }

            const rotatedModelMatrix = mat4.create();
            const rotationAngle =
              (((currentTime / 30) % (360 * 6)) * Math.PI) / 180;
            mat4.rotateZ(rotatedModelMatrix, modelMatrix, rotationAngle);
            mat4.rotateX(
              rotatedModelMatrix,
              rotatedModelMatrix,
              rotationAngle / 2,
            );
            mat4.rotateY(
              rotatedModelMatrix,
              rotatedModelMatrix,
              rotationAngle / 3,
            );

            const mvpMatrix = mat4.create();
            mat4.multiply(mvpMatrix, viewMatrix, rotatedModelMatrix);
            mat4.multiply(mvpMatrix, projectionMatrix, mvpMatrix);

            gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer.vertices);
            gl.vertexAttribPointer(
              shaderInfo.vertex.attributeLocations.vertexPosition,
              3,
              gl.FLOAT,
              false,
              0,
              0,
            );
            gl.enableVertexAttribArray(
              shaderInfo.vertex.attributeLocations.vertexPosition,
            );

            gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer.uvs);
            gl.vertexAttribPointer(
              shaderInfo.vertex.attributeLocations.vertexUv,
              2,
              gl.FLOAT,
              false,
              0,
              0,
            );
            gl.enableVertexAttribArray(
              shaderInfo.vertex.attributeLocations.vertexUv,
            );

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeBuffer.indices);

            gl.useProgram(shaderProgram);

            gl.uniformMatrix4fv(
              shaderInfo.vertex.uniformLocations.mvpMatrix,
              false,
              mvpMatrix,
            );
            gl.uniform1f(
              shaderInfo.fragment.uniformLocations.time,
              currentTime,
            );

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, cubeBuffer.texture);
            gl.uniform1i(
              shaderInfo.fragment.uniformLocations.colorTextureSampler,
              0,
            );

            gl.drawElements(
              gl.TRIANGLES,
              cube.indices.length * cube.indices[0].length,
              gl.UNSIGNED_SHORT,
              0,
            );

            requestAnimationFrame(renderScene);
          },
        );
      };
      requestAnimationFrame(renderScene);

      return () => {
        shouldRender = false;
      };
    }),
    [cubeBuffer],
  );

  return (
    <div className="util text-center" style={{ padding: "1rem" }}>
      <canvas width="640" height="480" ref={canvasRef}>
        Cannot run WebGL examples (not supported)
      </canvas>
      <pre className="util text-left">
        {`
Cube:
    Vertices:
        Vertex 1: ${coordArrToString(cube.vertices[0])}
        Vertex 2: ${coordArrToString(cube.vertices[1])}
        Vertex 3: ${coordArrToString(cube.vertices[2])}
        Vertex 4: ${coordArrToString(cube.vertices[5])}
        Vertex 5: ${coordArrToString(cube.vertices[30])}
        Vertex 6: ${coordArrToString(cube.vertices[31])}
        Vertex 7: ${coordArrToString(cube.vertices[32])}
        Vertex 8: ${coordArrToString(cube.vertices[35])}
    Face UV:
        Vertex 1: ${uvArrToString(cubeFaceUvs[0])}
        Vertex 2: ${uvArrToString(cubeFaceUvs[1])}
        Vertex 3: ${uvArrToString(cubeFaceUvs[2])}
        Vertex 4: ${uvArrToString(cubeFaceUvs[3])}
`.trim()}
      </pre>
      <pre className="util text-left">Time: {time}</pre>
    </div>
  );
};

export default wrapExample(ColorMappingSecondExample);
