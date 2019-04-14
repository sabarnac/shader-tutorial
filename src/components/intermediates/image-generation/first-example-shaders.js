import { glsl } from "../../util"

export const firstVertexShaderSource = glsl`
attribute vec4 vertexPosition;

void main() {
  gl_Position = vertexPosition;
}
`

export const firstFragmentShaderSource = glsl`
uniform highp vec2 resolution;

void main() {
  highp vec2 coordinates = gl_FragCoord.xy / resolution;
  gl_FragColor = vec4(vec3(coordinates.x * coordinates.y), 1.0);
}
`
