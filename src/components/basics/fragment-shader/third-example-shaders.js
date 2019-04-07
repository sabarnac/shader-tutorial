import { glsl } from "../../util"

export const thirdVertexShaderSource = glsl`
attribute vec4 vertexPosition;
attribute vec3 vertexColor;

uniform mat4 mvpMatrix;

varying highp vec3 color;

void main() {
  gl_Position = mvpMatrix * vertexPosition;
  color = vertexColor;
}
`

export const thirdFragmentShaderSource = glsl`
varying highp vec3 color;

uniform highp float time;

void main() {
  highp float colorShift = cos(time / 500.0);
  gl_FragColor = vec4(clamp(color - colorShift, 0.0, 1.0), 1.0);
}
`
