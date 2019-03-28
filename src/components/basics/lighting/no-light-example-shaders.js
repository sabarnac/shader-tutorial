import { glsl } from "../../util"

export const noLightVertexShaderSource = glsl`
attribute vec4 vertexPosition;
attribute vec2 vertexUv;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

varying highp vec2 uv;

void main() {
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vertexPosition;
  uv = vertexUv;
}
`

export const noLightFragmentShaderSource = glsl`
varying highp vec2 uv;

uniform sampler2D textureSampler;

void main() {
  gl_FragColor = texture2D(textureSampler, uv);
  gl_FragColor.rgb = gl_FragColor.rgb * 0.0;
}
`
