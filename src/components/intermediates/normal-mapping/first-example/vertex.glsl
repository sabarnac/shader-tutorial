attribute vec4 vertexPosition;
attribute vec2 vertexUv;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

varying highp vec2 uv;

void main() {
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vertexPosition;

  uv = vertexUv;
}