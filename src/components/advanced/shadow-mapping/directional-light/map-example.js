import { mat4, vec4 } from "gl-matrix";
import React, { useEffect, useRef, useState } from "react";

import { coordArrToString, runOnPredicate } from "../../../util";
import wrapExample from "../../../webgl-example-view";
import WebGlWrapper from "../../../webgl-wrapper";
import {
  directionalLightMapFragmentShaderSource,
  directionalLightMapVertexShaderSource,
} from "./map-example-shaders";
import { modelIndices, modelVertices } from "./model";

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
    uniformLocations: {},
  },
};

const lightDirectionInverted = vec4.create();
vec4.normalize(lightDirectionInverted, vec4.fromValues(-9.0, 27.0, -18.0, 0.0));
const lightModelPosition = vec4.fromValues(-9.0, 27.0, -18.0, 1.0);

const sceneModelPosition = mat4.create();

const ShadowMappingDirectionalLightMapExample = () => {
  const scene = {
    vertices: modelVertices,
    indices: modelIndices,
  };
  const [webGlRef, updateWebGlRef] = useState(null);
  const [shaderProgram, updateShaderProgram] = useState(null);
  const [shaderInfo, updateShaderInfo] = useState(null);
  const [sceneBuffer, updateSceneBuffer] = useState({
    vertices: null,
    indices: null,
  });
  const [shouldRender, updateShouldRender] = useState(true);

  const canvasRef = useRef();
  useEffect(() => {
    if (canvasRef.current !== null) {
      const newWebGlRef = new WebGlWrapper(
        canvasRef.current,
        sceneModelPosition,
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
          directionalLightMapVertexShaderSource,
          directionalLightMapFragmentShaderSource,
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
      updateSceneBuffer({
        vertices: webGlRef.createStaticDrawArrayBuffer(
          scene.vertices.flat(),
          sceneBuffer.vertices,
        ),
        indices: webGlRef.createElementArrayBuffer(
          scene.indices.flat(),
          sceneBuffer.indices,
        ),
      });
    }),
    [shaderInfo],
  );

  useEffect(
    runOnPredicate(sceneBuffer.vertices !== null, () => {
      updateShouldRender(true);

      const renderScene = () => {
        webGlRef.renderSceneOrtho(({ gl, modelMatrix }) => {
          if (!shouldRender) {
            return;
          }

          const { aspect, zNear, zFar } = webGlRef.canvasDimensions;
          const depthProjectionMatrix = mat4.create();
          mat4.ortho(
            depthProjectionMatrix,
            -4 * aspect,
            4 * aspect,
            -4,
            4,
            zNear,
            zFar,
          );

          gl.clearColor(1.0, 1.0, 1.0, 1.0);
          gl.clearDepth(1.0);
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

          const lightViewMatrix = mat4.create();
          mat4.lookAt(
            lightViewMatrix,
            lightModelPosition,
            [0.0, 0.0, 0.0],
            [0.0, 1.0, 0.0],
          );

          const scaledModelMatrix = mat4.create();
          mat4.scale(scaledModelMatrix, modelMatrix, [1.75, 1.75, 1.75]);

          gl.bindBuffer(gl.ARRAY_BUFFER, sceneBuffer.vertices);
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

          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sceneBuffer.indices);

          gl.useProgram(shaderProgram);

          gl.uniformMatrix4fv(
            shaderInfo.vertex.uniformLocations.projectionMatrix,
            false,
            depthProjectionMatrix,
          );
          gl.uniformMatrix4fv(
            shaderInfo.vertex.uniformLocations.viewMatrix,
            false,
            lightViewMatrix,
          );
          gl.uniformMatrix4fv(
            shaderInfo.vertex.uniformLocations.modelMatrix,
            false,
            scaledModelMatrix,
          );

          gl.drawElements(
            gl.TRIANGLES,
            scene.indices.length,
            gl.UNSIGNED_SHORT,
            0,
          );

          requestAnimationFrame(renderScene);
        });
      };
      requestAnimationFrame(renderScene);

      return () => updateShouldRender(false);
    }),
    [sceneBuffer],
  );

  return (
    <div className="util text-center" style={{ padding: "1rem" }}>
      <canvas width="640" height="480" ref={canvasRef}>
        Cannot run WebGL examples (not supported)
      </canvas>
      <pre className="util text-left">
        {`
Scene:
    World Position: ${coordArrToString([0.0, 0.0, 0.0])}
`.trim()}
      </pre>
      <pre className="util text-left">
        {`
Light:
    Direction: ${coordArrToString(
      lightDirectionInverted.map((coord) => -1 * coord),
    )}
`.trim()}
      </pre>
    </div>
  );
};

export default wrapExample(ShadowMappingDirectionalLightMapExample);
