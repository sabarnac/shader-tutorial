attribute vec4 vertexPosition;

uniform mat4 mvpMatrix;

void main() {
  gl_Position = mvpMatrix * vertexPosition;
}