import { glsl } from "../../util"

export const firstVertexShaderSource = glsl`
attribute vec4 vertexPosition;

void main() {
  gl_Position = vertexPosition;
}
`

export const firstFragmentShaderSource = glsl`
uniform highp vec2 resolution;

highp float random(vec2 coords) {
   return fract(sin(dot(coords.xy,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  gl_FragColor = vec4(vec3(random(gl_FragCoord.xy / resolution)), 1.0);
}
`
