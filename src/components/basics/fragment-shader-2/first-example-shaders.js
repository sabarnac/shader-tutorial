import { glsl } from "../../util"

export const firstVertexShaderSource = glsl`
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

export const firstFragmentShaderSource = glsl`
varying highp vec2 uv;

void main() {
  gl_FragColor = vec4(clamp(color - colorShift, 0.0, 1.0), 1.0);
}
`
