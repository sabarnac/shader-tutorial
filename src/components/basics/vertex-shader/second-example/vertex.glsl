attribute vec4 vertexPosition;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform float time;

const float PI = 3.1415926535897932384626433832795;

mat4 rotateZ(float angle) {
  mat4 rotationMatrix;
  rotationMatrix[0] = vec4(cos(angle), sin(angle), 0, 0);
  rotationMatrix[1] = vec4(-sin(angle), cos(angle), 0, 0);
  rotationMatrix[2] = vec4(0, 0, 1, 0);
  rotationMatrix[3] = vec4(0, 0, 0, 1);
  return rotationMatrix;
}

void main() {
  float angleRadians = (time / 30.0) * PI / 180.0;
  mat4 rotatedModelMatrix = rotateZ(angleRadians) * modelMatrix;
  gl_Position = projectionMatrix * viewMatrix * rotatedModelMatrix * vertexPosition;
}