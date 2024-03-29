import { mat4 } from "gl-matrix"
import React, { useEffect, useRef, useState } from "react"

import { runOnPredicate } from "../../util"
import wrapExample from "../../webgl-example-view"
import WebGlWrapper from "../../webgl-wrapper"
import { fragmentShaderSource, vertexShaderSource } from "./common-shaders"

const shaderProgramInfo = {
  vertex: {
    attributeLocations: {
      vertexPosition: "vec4",
      vertexColor: "vec3",
    },
    uniformLocations: {
      mvpMatrix: "mat4",
    },
  },
};

const cubeModelPosition = mat4.create();

const TransparencyFirstExample = () => {
  const cube = {
    vertices: [
      // Green Face
      [1.5, 1.5, -1.0],
      [1.5, -1.0, -1.0],
      [-1.0, 1.5, -1.0],
      [1.5, -1.0, -1.0],
      [-1.0, 1.5, -1.0],
      [-1.0, -1.0, -1.0],
      // Red Face
      [-1.5, -1.5, 1.0],
      [-1.5, 1.0, 1.0],
      [1.0, -1.5, 1.0],
      [-1.5, 1.0, 1.0],
      [1.0, -1.5, 1.0],
      [1.0, 1.0, 1.0],
    ],
    colors: [
      // Green Face
      [0.0, 1.0, 0.0],
      [0.0, 1.0, 0.0],
      [0.0, 1.0, 0.0],
      [0.0, 1.0, 0.0],
      [0.0, 1.0, 0.0],
      [0.0, 1.0, 0.0],
      // Red Face
      [1.0, 0.0, 0.0],
      [1.0, 0.0, 0.0],
      [1.0, 0.0, 0.0],
      [1.0, 0.0, 0.0],
      [1.0, 0.0, 0.0],
      [1.0, 0.0, 0.0],
    ],
    indices: [
      [0, 1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10, 11],
    ],
  };
  const [webGlRef, updateWebGlRef] = useState(null);
  const [shaderProgram, updateShaderProgram] = useState(null);
  const [shaderInfo, updateShaderInfo] = useState(null);
  const [cubeBuffer, updateCubeBuffer] = useState({
    vertices: null,
    colors: null,
    indices: null,
  });

  const canvasRef = useRef();
  useEffect(() => {
    if (canvasRef.current !== null) {
      const newWebGlRef = new WebGlWrapper(
        canvasRef.current,
        cubeModelPosition,
        true,
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
        webGlRef.createShaderProgram(vertexShaderSource, fragmentShaderSource),
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
        colors: webGlRef.createStaticDrawArrayBuffer(
          cube.colors.flat(),
          cubeBuffer.colors,
        ),
        indices: webGlRef.createElementArrayBuffer(
          cube.indices.flat(),
          cubeBuffer.indices,
        ),
      });
    }),
    [shaderInfo],
  );

  useEffect(
    runOnPredicate(cubeBuffer.vertices !== null, () => {
      let shouldRender = true;

      const renderScene = () => {
        webGlRef.renderSceneOrtho(
          ({ gl, orthoMatrix, viewMatrix, modelMatrix }) => {
            if (!shouldRender) {
              return;
            }

            const mvpMatrix = mat4.create();
            mat4.multiply(mvpMatrix, viewMatrix, modelMatrix);
            mat4.multiply(mvpMatrix, orthoMatrix, mvpMatrix);

            gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer.vertices);
            gl.vertexAttribPointer(
              shaderInfo.vertex.attributeLocations.vertexPosition.reverse,
              3,
              gl.FLOAT,
              false,
              0,
              0,
            );
            gl.enableVertexAttribArray(
              shaderInfo.vertex.attributeLocations.vertexPosition,
            );

            gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer.colors);
            gl.vertexAttribPointer(
              shaderInfo.vertex.attributeLocations.vertexColor,
              3,
              gl.FLOAT,
              false,
              0,
              0,
            );
            gl.enableVertexAttribArray(
              shaderInfo.vertex.attributeLocations.vertexColor,
            );

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeBuffer.indices);

            gl.useProgram(shaderProgram);

            gl.uniformMatrix4fv(
              shaderInfo.vertex.uniformLocations.mvpMatrix,
              false,
              mvpMatrix,
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
Order of Faces:
    Depth-wise:
        Red Square (Front)
        Green Square (Back)
    Passed to GPU:
        Green Square (First)
        Red Square (Second)
`.trim()}
      </pre>
    </div>
  );
};

export default wrapExample(TransparencyFirstExample);
