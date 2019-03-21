import { glsl } from "../../util"

export const thirdVertexShaderSource = glsl`
attribute vec4 vertexPosition;
attribute vec3 vertexColor;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

varying highp vec3 color;

void main() {
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vertexPosition;
  color = vertexColor;
}
`

export const thirdFragmentShaderSource = glsl`
varying highp vec3 color;

uniform highp float colorShift;

void main() {
  gl_FragColor = vec4(clamp(color - colorShift, 0.0, 1.0), 1.0);
}
`
