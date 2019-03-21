import { glsl } from "../../util"

export const secondVertexShaderSource = glsl`
attribute vec4 vertexPosition;

uniform mat4 mvpMatrix;

void main() {
  gl_Position = mvpMatrix * vertexPosition;
}
`

export const secondFragmentShaderSource = glsl`
void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`
