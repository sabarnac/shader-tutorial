import { glsl } from "../../util"

export const secondVertexShaderSource = glsl`
attribute vec4 vertexPosition;

void main() {
  gl_Position = vertexPosition;
}
`

export const secondFragmentShaderSource = glsl`
uniform highp float time;
uniform highp vec2 resolution;

highp float random(vec2 coords) {
   return fract(sin(dot(coords.xy,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  highp vec2 coordinates = gl_FragCoord.xy / resolution;
  highp float steppedCoordinate = (floor(coordinates.y * 100.0) / 100.0);
  gl_FragColor = vec4(vec3(random(vec2(steppedCoordinate))), 1.0);
}
`
