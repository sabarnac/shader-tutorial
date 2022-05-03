import { mat4, vec4 } from "gl-matrix";
import React, { useEffect, useRef, useState } from "react";

import skyboxFaceNegativeX from "../../../images/advanced/skybox-face-negative-x.png";
import skyboxFaceNegativeY from "../../../images/advanced/skybox-face-negative-y.png";
import skyboxFaceNegativeZ from "../../../images/advanced/skybox-face-negative-z.png";
import skyboxFacePositiveX from "../../../images/advanced/skybox-face-positive-x.png";
import skyboxFacePositiveY from "../../../images/advanced/skybox-face-positive-y.png";
import skyboxFacePositiveZ from "../../../images/advanced/skybox-face-positive-z.png";
import { coordArrToString, runOnPredicate } from "../../util";
import wrapExample from "../../webgl-example-view";
import WebGlWrapper from "../../webgl-wrapper";
import {
  blobFragmentShaderSource,
  blobVertexShaderSource,
} from "./blob-example-shaders";
import { blobsIndices, blobsVertices } from "./model-blobs";
import {
  skyboxFragmentShaderSource,
  skyboxVertexShaderSource,
} from "./skybox-example-shaders";

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
};

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
};

const modelReflectionRefractionPosition = vec4.fromValues(0.0, 0.0, 0.0, 1.0);
const modelReflectionRefractionFaces = [
  {
    name: "+X-Axis Face",
    id: "POSITIVE_X",
    center: [
      modelReflectionRefractionPosition[0] + 1.0,
      modelReflectionRefractionPosition[1],
      modelReflectionRefractionPosition[2],
    ],
    up: [0.0, 1.0, 0.0],
  },
  {
    name: "-X-Axis Face",
    id: "NEGATIVE_X",
    center: [
      modelReflectionRefractionPosition[0] - 1.0,
      modelReflectionRefractionPosition[1],
      modelReflectionRefractionPosition[2],
    ],
    up: [0.0, 1.0, 0.0],
  },
  {
    name: "+Y-Axis Face",
    id: "POSITIVE_Y",
    center: [
      modelReflectionRefractionPosition[0],
      modelReflectionRefractionPosition[1] + 1.0,
      modelReflectionRefractionPosition[2],
    ],
    up: [0.0, 0.0, -1.0],
  },
  {
    name: "-Y-Axis Face",
    id: "NEGATIVE_Y",
    center: [
      modelReflectionRefractionPosition[0],
      modelReflectionRefractionPosition[1] - 1.0,
      modelReflectionRefractionPosition[2],
    ],
    up: [0.0, 0.0, 1.0],
  },
  {
    name: "+Z-Axis Face",
    id: "POSITIVE_Z",
    center: [
      modelReflectionRefractionPosition[0],
      modelReflectionRefractionPosition[1],
      modelReflectionRefractionPosition[2] + 1.0,
    ],
    up: [0.0, 1.0, 0.0],
  },
  {
    name: "-Z-Axis Face",
    id: "NEGATIVE_Z",
    center: [
      modelReflectionRefractionPosition[0],
      modelReflectionRefractionPosition[1],
      modelReflectionRefractionPosition[2] - 1.0,
    ],
    up: [0.0, 1.0, 0.0],
  },
];

const ReflectionRefractionMapExample = () => {
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
  };

  const blobs = {
    vertices: blobsVertices,
    indices: blobsIndices,
    texture: null,
  };

  const [webGlRef, updateWebGlRef] = useState(null);
  const [currentFace, updateCurrentFace] = useState(0);

  const [skyboxShaderProgram, updateSkyboxShaderProgram] = useState(null);
  const [skyboxShaderInfo, updateSkyboxShaderInfo] = useState(null);

  const [blobsShaderProgram, updateBlobsShaderProgram] = useState(null);
  const [blobsShaderInfo, updateBlobsShaderInfo] = useState(null);

  const [skyboxBuffer, updateSkyboxBuffer] = useState({
    vertices: null,
    indices: null,
    texture: null,
  });

  const [blobsBuffer, updateBlobsBuffer] = useState({
    vertices: null,
    indices: null,
  });

  const canvasRef = useRef();
  useEffect(() => {
    if (canvasRef.current !== null) {
      const newWebGlRef = new WebGlWrapper(canvasRef.current, vec4.create());
      updateWebGlRef(newWebGlRef);

      return () => {
        newWebGlRef.destroy();
        updateWebGlRef(null);
      };
    }
  }, [canvasRef]);

  useEffect(
    runOnPredicate(webGlRef !== null, () => {
      updateSkyboxShaderProgram(
        webGlRef.createShaderProgram(
          skyboxVertexShaderSource,
          skyboxFragmentShaderSource,
        ),
      );
    }),
    [webGlRef],
  );

  useEffect(
    runOnPredicate(skyboxShaderProgram !== null, () => {
      updateSkyboxShaderInfo(
        webGlRef.getDataLocations(skyboxShaderProgram, skyboxShaderProgramInfo),
      );
    }),
    [skyboxShaderProgram],
  );

  useEffect(
    runOnPredicate(skyboxShaderInfo !== null, () => {
      updateBlobsShaderProgram(
        webGlRef.createShaderProgram(
          blobVertexShaderSource,
          blobFragmentShaderSource,
        ),
      );
    }),
    [skyboxShaderInfo],
  );

  useEffect(
    runOnPredicate(blobsShaderProgram !== null, () => {
      updateBlobsShaderInfo(
        webGlRef.getDataLocations(blobsShaderProgram, blobsShaderProgramInfo),
      );
    }),
    [blobsShaderProgram],
  );

  useEffect(
    runOnPredicate(blobsShaderInfo !== null, () => {
      updateSkyboxBuffer({
        vertices: webGlRef.createStaticDrawArrayBuffer(
          skybox.vertices.flat(),
          skyboxBuffer.vertices,
        ),
        indices: webGlRef.createElementArrayBuffer(
          skybox.indices.flat(),
          skyboxBuffer.indices,
        ),
        texture: webGlRef.createCubeMapTexture(
          skybox.textures,
          skyboxBuffer.texture,
        ),
      });
    }),
    [blobsShaderInfo],
  );

  useEffect(
    runOnPredicate(skyboxBuffer.vertices !== null, () => {
      updateBlobsBuffer({
        vertices: webGlRef.createStaticDrawArrayBuffer(
          blobs.vertices.flat(),
          blobsBuffer.vertices,
        ),
        indices: webGlRef.createElementArrayBuffer(
          blobs.indices.flat(),
          blobsBuffer.indices,
        ),
      });
    }),
    [skyboxBuffer],
  );

  useEffect(
    runOnPredicate(blobsBuffer.vertices !== null, () => {
      let shouldRender = true;

      const renderFace = currentFace;
      const renderScene = () => {
        webGlRef.renderScene(({ gl }) => {
          if (!shouldRender) {
            return;
          }

          const time = parseInt(
            typeof performance !== "undefined"
              ? performance.now()
              : (0.0).toString(),
          );

          const depthProjectionMatrix = mat4.create();
          mat4.perspective(
            depthProjectionMatrix,
            (90 * Math.PI) / 180,
            1.0,
            0.1,
            50.0,
          );

          gl.clearColor(0.0, 0.0, 0.0, 1.0);
          gl.clearDepth(1.0);
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

          const modelReflectionRefractionViewMatrix = mat4.create();
          mat4.lookAt(
            modelReflectionRefractionViewMatrix,
            modelReflectionRefractionPosition,
            modelReflectionRefractionFaces[renderFace].center,
            modelReflectionRefractionFaces[renderFace].up,
          );

          {
            gl.useProgram(skyboxShaderProgram);

            gl.bindBuffer(gl.ARRAY_BUFFER, skyboxBuffer.vertices);
            gl.vertexAttribPointer(
              skyboxShaderInfo.vertex.attributeLocations.vertexPosition,
              3,
              gl.FLOAT,
              false,
              0,
              0,
            );
            gl.enableVertexAttribArray(
              skyboxShaderInfo.vertex.attributeLocations.vertexPosition,
            );

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, skyboxBuffer.indices);

            gl.uniformMatrix4fv(
              skyboxShaderInfo.vertex.uniformLocations.projectionMatrix,
              false,
              depthProjectionMatrix,
            );
            gl.uniformMatrix4fv(
              skyboxShaderInfo.vertex.uniformLocations.viewMatrix,
              false,
              modelReflectionRefractionViewMatrix,
            );
            gl.uniformMatrix4fv(
              skyboxShaderInfo.vertex.uniformLocations.modelMatrix,
              false,
              mat4.create(),
            );

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, skyboxBuffer.texture);
            gl.uniform1i(
              skyboxShaderInfo.fragment.uniformLocations.skyboxSampler,
              0,
            );

            gl.drawElements(
              gl.TRIANGLES,
              skybox.indices.length * skybox.indices[0].length,
              gl.UNSIGNED_SHORT,
              0,
            );
          }

          {
            const rotatedModelMatrix = mat4.create();
            const rotationAngle = (((time / 30) % (360 * 6)) * Math.PI) / 180;
            mat4.rotateZ(rotatedModelMatrix, rotatedModelMatrix, rotationAngle);
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

            gl.useProgram(blobsShaderProgram);

            gl.bindBuffer(gl.ARRAY_BUFFER, blobsBuffer.vertices);
            gl.vertexAttribPointer(
              blobsShaderInfo.vertex.attributeLocations.vertexPosition,
              3,
              gl.FLOAT,
              false,
              0,
              0,
            );
            gl.enableVertexAttribArray(
              blobsShaderInfo.vertex.attributeLocations.vertexPosition,
            );

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, blobsBuffer.indices);

            gl.uniformMatrix4fv(
              blobsShaderInfo.vertex.uniformLocations.projectionMatrix,
              false,
              depthProjectionMatrix,
            );
            gl.uniformMatrix4fv(
              blobsShaderInfo.vertex.uniformLocations.viewMatrix,
              false,
              modelReflectionRefractionViewMatrix,
            );
            gl.uniformMatrix4fv(
              blobsShaderInfo.vertex.uniformLocations.modelMatrix,
              false,
              rotatedModelMatrix,
            );

            gl.drawElements(
              gl.TRIANGLES,
              blobs.indices.length,
              gl.UNSIGNED_SHORT,
              0,
            );
          }

          requestAnimationFrame(renderScene);
        });
      };
      requestAnimationFrame(renderScene);

      return () => {
        shouldRender = false;
      };
    }),
    [blobsBuffer, currentFace],
  );

  return (
    <div className="util text-center" style={{ padding: "1rem" }}>
      <canvas width="640" height="480" ref={canvasRef}>
        Cannot run WebGL examples (not supported)
      </canvas>
      <select
        value={currentFace}
        onChange={({ target: { value } }) => updateCurrentFace(value)}
        onBlur={({ target: { value } }) => updateCurrentFace(value)}
      >
        {modelReflectionRefractionFaces.map((face, i) => (
          <option key={i} value={i}>
            {face.name}
          </option>
        ))}
      </select>
      <pre className="util text-left">
        {`
Scene:
    World Position: ${coordArrToString([0.0, 0.0, 0.0])}
`.trim()}
      </pre>
      <pre className="util text-left">
        {`
Face:
    Center: ${coordArrToString(
      modelReflectionRefractionFaces[currentFace].center,
    )}
    Up: ${coordArrToString(modelReflectionRefractionFaces[currentFace].up)}
`.trim()}
      </pre>
    </div>
  );
};

export default wrapExample(ReflectionRefractionMapExample);
