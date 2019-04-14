import { glsl } from "../../util"

export const sixthVertexShaderSource = glsl`
attribute vec4 vertexPosition;

void main() {
  gl_Position = vertexPosition;
}
`

export const sixthFragmentShaderSource = glsl`
uniform highp vec2 resolution;

highp float random(vec2 coords) {
   return fract(sin(dot(coords.xy,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  highp vec2 coordinates = gl_FragCoord.xy / resolution;
  gl_FragColor = vec4(vec3(random(coordinates)), 1.0);
}
`
