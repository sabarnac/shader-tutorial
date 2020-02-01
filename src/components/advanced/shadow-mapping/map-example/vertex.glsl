attribute vec4 vertexPosition;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 orthoMatrix;

void main() {
  gl_Position = orthoMatrix * viewMatrix * modelMatrix * vertexPosition;
}