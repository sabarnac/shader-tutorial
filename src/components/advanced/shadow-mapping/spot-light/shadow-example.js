import { mat4, vec2, vec3, vec4 } from "gl-matrix";
import React, { useEffect, useRef, useState } from "react";

import { coordArrToString, runOnPredicate } from "../../../util";
import wrapExample from "../../../webgl-example-view";
import WebGlWrapper from "../../../webgl-wrapper";
import {
  spotLightMapFragmentShaderSource,
  spotLightMapVertexShaderSource,
} from "./map-example-shaders";
import { modelIndices, modelNormals, modelVertices } from "./model";
import {
  spotLightShadowFragmentShaderSource,
  spotLightShadowVertexShaderSource,
} from "./shadow-example-shaders";

const shadowMapShaderProgramInfo = {
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

const shaderProgramInfo = {
  vertex: {
    attributeLocations: {
      vertexPosition: "vec4",
      vertexNormal: "vec4",
    },
    uniformLocations: {
      modelMatrix: "mat4",
      viewMatrix: "mat4",
      projectionMatrix: "mat4",

      lightModelMatrix: "mat4",
      lightViewMatrix: "mat4",
      lightProjectionMatrix: "mat4",

      lightPosition_worldSpace: "vec4",
      lightColor: "vec3",
      lightIntensity: "float",
    },
  },
  fragment: {
    attributeLocations: {},
    uniformLocations: {
      texelSize: "vec2",
      ambientFactor: "float",
      shadowMapTextureSampler: "sampler2D",
    },
  },
};

const lightModelPosition = vec4.fromValues(-3.0, 10.0, -6.0, 1.0);
const lightColor = vec3.fromValues(0.3, 0.3, 0.3);
const lightIntensity = 300.0;

const sceneModelPosition = mat4.create();

const ShadowMappingSpotLightShadowExample = () => {
  const scene = {
    vertices: modelVertices,
    normals: modelNormals,
    indices: modelIndices,
    ambientFactor: 0.1,
  };
  const [webGlRef, updateWebGlRef] = useState(null);
  const [shadowMapShaderProgram, updateShadowMapShaderProgram] = useState(null);
  const [shadowMapShaderInfo, updateShadowMapShaderInfo] = useState(null);
  const [shadowMapSceneBuffer, updateShadowMapSceneBuffer] = useState({
    vertices: null,
    indices: null,
    shadowMapTexture: null,
  });
  const [shaderProgram, updateShaderProgram] = useState(null);
  const [shaderInfo, updateShaderInfo] = useState(null);
  const [sceneBuffer, updateSceneBuffer] = useState({
    vertices: null,
    normals: null,
    indices: null,
  });
  const [shadowMapFramebuffer, updateShadowMapFramebuffer] = useState(null);
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
      updateShadowMapShaderProgram(
        webGlRef.createShaderProgram(
          spotLightMapVertexShaderSource,
          spotLightMapFragmentShaderSource,
        ),
      );
    }),
    [webGlRef],
  );

  useEffect(
    runOnPredicate(shadowMapShaderProgram !== null, () => {
      updateShadowMapShaderInfo(
        webGlRef.getDataLocations(
          shadowMapShaderProgram,
          shadowMapShaderProgramInfo,
        ),
      );
    }),
    [shadowMapShaderProgram],
  );

  useEffect(
    runOnPredicate(shadowMapShaderInfo !== null, () => {
      updateShadowMapSceneBuffer({
        vertices: webGlRef.createStaticDrawArrayBuffer(
          scene.vertices.flat(),
          shadowMapSceneBuffer.vertices,
        ),
        indices: webGlRef.createElementArrayBuffer(
          scene.indices.flat(),
          shadowMapSceneBuffer.indices,
        ),
        shadowMapTexture: webGlRef.createRenderTargetTexture(
          shadowMapSceneBuffer.shadowMapTexture,
        ),
      });
    }),
    [shadowMapShaderInfo],
  );

  useEffect(
    runOnPredicate(shadowMapSceneBuffer.shadowMapTexture !== null, () => {
      updateShadowMapFramebuffer(
        webGlRef.createTextureTargetFramebuffer(
          shadowMapSceneBuffer.shadowMapTexture,
          shadowMapFramebuffer,
          true,
        ),
      );
    }),
    [shadowMapSceneBuffer],
  );

  useEffect(
    runOnPredicate(shadowMapFramebuffer !== null, () => {
      updateShaderProgram(
        webGlRef.createShaderProgram(
          spotLightShadowVertexShaderSource,
          spotLightShadowFragmentShaderSource,
        ),
      );
    }),
    [shadowMapFramebuffer],
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
        normals: webGlRef.createStaticDrawArrayBuffer(
          scene.normals.flat(),
          sceneBuffer.normals,
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
        const texelSize = vec2.fromValues(
          1.0 / webGlRef.canvasDimensions.width,
          1.0 / webGlRef.canvasDimensions.height,
        );
        const lightModelMatrix = mat4.create();
        const lightViewMatrix = mat4.create();
        const lightProjectionMatrix = mat4.create();

        webGlRef.renderToFramebuffer(shadowMapFramebuffer, () => {
          webGlRef.renderScene(({ gl, modelMatrix }) => {
            if (!shouldRender) {
              return;
            }

            const { fov, aspect } = webGlRef.canvasDimensions;
            mat4.perspective(lightProjectionMatrix, fov, aspect, 5.0, 1000.0);

            gl.clearColor(1.0, 1.0, 1.0, 1.0);
            gl.clearDepth(1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            mat4.lookAt(
              lightViewMatrix,
              [
                lightModelPosition[0],
                lightModelPosition[1],
                lightModelPosition[2],
              ],
              [1.0, -0.75, -0.5],
              [0.0, 1.0, 0.0],
            );

            mat4.scale(lightModelMatrix, modelMatrix, [1.3, 1.3, 1.3]);

            gl.bindBuffer(gl.ARRAY_BUFFER, shadowMapSceneBuffer.vertices);
            gl.vertexAttribPointer(
              shadowMapShaderInfo.vertex.attributeLocations.vertexPosition,
              3,
              gl.FLOAT,
              false,
              0,
              0,
            );
            gl.enableVertexAttribArray(
              shadowMapShaderInfo.vertex.attributeLocations.vertexPosition,
            );

            gl.bindBuffer(
              gl.ELEMENT_ARRAY_BUFFER,
              shadowMapSceneBuffer.indices,
            );

            gl.useProgram(shadowMapShaderProgram);

            gl.uniformMatrix4fv(
              shadowMapShaderInfo.vertex.uniformLocations.projectionMatrix,
              false,
              lightProjectionMatrix,
            );
            gl.uniformMatrix4fv(
              shadowMapShaderInfo.vertex.uniformLocations.viewMatrix,
              false,
              lightViewMatrix,
            );
            gl.uniformMatrix4fv(
              shadowMapShaderInfo.vertex.uniformLocations.modelMatrix,
              false,
              lightModelMatrix,
            );

            gl.drawElements(
              gl.TRIANGLES,
              scene.indices.length,
              gl.UNSIGNED_SHORT,
              0,
            );
          });
        });

        webGlRef.renderScene(({ gl, projectionMatrix, _, modelMatrix }) => {
          if (!shouldRender) {
            return;
          }

          const viewMatrix = mat4.create();
          mat4.lookAt(
            viewMatrix,
            [-9.0, 6.0, -0.5],
            [0.0, 1.0, 0.0],
            [0.0, 1.0, 0.0],
          );

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

          gl.bindBuffer(gl.ARRAY_BUFFER, sceneBuffer.normals);
          gl.vertexAttribPointer(
            shaderInfo.vertex.attributeLocations.vertexNormal,
            3,
            gl.FLOAT,
            false,
            0,
            0,
          );
          gl.enableVertexAttribArray(
            shaderInfo.vertex.attributeLocations.vertexNormal,
          );

          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sceneBuffer.indices);

          gl.useProgram(shaderProgram);

          gl.uniformMatrix4fv(
            shaderInfo.vertex.uniformLocations.projectionMatrix,
            false,
            projectionMatrix,
          );
          gl.uniformMatrix4fv(
            shaderInfo.vertex.uniformLocations.viewMatrix,
            false,
            viewMatrix,
          );
          gl.uniformMatrix4fv(
            shaderInfo.vertex.uniformLocations.modelMatrix,
            false,
            modelMatrix,
          );

          gl.uniformMatrix4fv(
            shaderInfo.vertex.uniformLocations.lightModelMatrix,
            false,
            lightModelMatrix,
          );
          gl.uniformMatrix4fv(
            shaderInfo.vertex.uniformLocations.lightViewMatrix,
            false,
            lightViewMatrix,
          );
          gl.uniformMatrix4fv(
            shaderInfo.vertex.uniformLocations.lightProjectionMatrix,
            false,
            lightProjectionMatrix,
          );

          gl.uniform2fv(
            shaderInfo.fragment.uniformLocations.texelSize,
            texelSize,
          );
          gl.uniform4fv(
            shaderInfo.vertex.uniformLocations.lightPosition_worldSpace,
            lightModelPosition,
          );
          gl.uniform3fv(
            shaderInfo.vertex.uniformLocations.lightColor,
            lightColor,
          );
          gl.uniform1f(
            shaderInfo.vertex.uniformLocations.lightIntensity,
            lightIntensity,
          );

          gl.uniform1f(
            shaderInfo.fragment.uniformLocations.ambientFactor,
            scene.ambientFactor,
          );

          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, shadowMapSceneBuffer.shadowMapTexture);
          gl.uniform1i(
            shaderInfo.fragment.uniformLocations.shadowMapTextureSampler,
            0,
          );

          gl.drawElements(
            gl.TRIANGLES,
            scene.indices.length,
            gl.UNSIGNED_SHORT,
            0,
          );
        });

        requestAnimationFrame(renderScene);
      };
      requestAnimationFrame(renderScene);

      return () => updateShouldRender(false);
    }),
    [sceneBuffer],
  );

  const colorCoords = { x: "r", y: "g", z: "b" };

  return (
    <div className="util text-center" style={{ padding: "1rem" }}>
      <canvas width="640" height="480" ref={canvasRef}>
        Cannot run WebGL examples (not supported)
      </canvas>
      <pre className="util text-left">
        {`
Scene:
    World Position: ${coordArrToString([0.0, 0.0, 0.0])}
    Lighting:
        Ambient Factor: ${scene.ambientFactor}
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
  );
};

export default wrapExample(ShadowMappingSpotLightShadowExample);
