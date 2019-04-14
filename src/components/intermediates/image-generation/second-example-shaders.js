import { glsl } from "../../util"

export const secondVertexShaderSource = glsl`
attribute vec4 vertexPosition;

void main() {
  gl_Position = vertexPosition;
}
`

export const secondFragmentShaderSource = glsl`
uniform highp vec2 resolution;

void main() {
  highp vec2 tilingResolution = vec2(12.0, 9.0);
  highp vec2 coordinates = gl_FragCoord.xy / resolution;
  highp vec2 blockCoordinates = fract(coordinates * tilingResolution);
  gl_FragColor = vec4(vec3(blockCoordinates.x * blockCoordinates.y), 1.0);
}
`
