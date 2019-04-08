import { glsl } from "../../util"

export const secondVertexShaderSource = glsl`
attribute vec4 vertexPosition;
attribute vec2 vertexUv;

uniform mat4 mvpMatrix;

varying highp vec2 uv;

void main() {
  gl_Position = mvpMatrix * vertexPosition;
  uv = vertexUv;
}
`

export const secondFragmentShaderSource = glsl`
varying highp vec2 uv;

uniform highp float time;
uniform sampler2D textureSampler;

highp float getColorShiftFactor(highp vec3 color) {
  return clamp(ceil(3.0 - (color.r + color.g + color.b)), 0.0, 1.0);
}

void main() {
  highp float colorShift = cos(time / 500.0);
  highp vec4 textureColor = texture2D(textureSampler, uv);
  highp float finalColorShift = getColorShiftFactor(textureColor.rgb) * colorShift;
  gl_FragColor = vec4(clamp(textureColor.rgb - finalColorShift, 0.0, 1.0), textureColor.a);
}
`
