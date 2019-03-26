import { glsl } from "../../util"

export const firstVertexShaderSource = glsl`
attribute vec4 vertexPosition;
attribute vec2 vertexUv;

uniform mat4 mvpMatrix;

varying highp vec2 uv;

void main() {
  gl_Position = mvpMatrix * vertexPosition;
  uv = vertexUv;
}
`

export const firstFragmentShaderSource = glsl`
varying highp vec2 uv;

uniform sampler2D textureSampler;

void main() {
  gl_FragColor = texture2D(textureSampler, uv);
}
`
