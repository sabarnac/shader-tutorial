import { glsl } from "../../util"

export const firstVertexShaderSource = glsl`
attribute vec4 vertexPosition;

uniform mat4 mvpMatrix;

void main() {
  gl_Position = mvpMatrix * vertexPosition;
}
`

export const firstFragmentShaderSource = glsl`
void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`
