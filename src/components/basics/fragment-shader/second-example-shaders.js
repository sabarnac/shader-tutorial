import { glsl } from "../../util"

export const secondVertexShaderSource = glsl`
attribute vec4 vertexPosition;
attribute vec3 vertexColor;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

varying lowp vec3 color;

void main() {
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vertexPosition;
  color = vertexColor;
}
`

export const secondFragmentShaderSource = glsl`
varying lowp vec3 color;

void main() {
  gl_FragColor = vec4(color, 1);
}
`
