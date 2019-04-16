attribute vec4 vertexPosition;
attribute vec2 vertexUv;

uniform mat4 mvpMatrix;

varying highp vec2 uv;

void main() {
  gl_Position = mvpMatrix * vertexPosition;
  uv = vertexUv;
}