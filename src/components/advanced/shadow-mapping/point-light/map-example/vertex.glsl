attribute vec4 vertexPosition;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

varying highp vec3 vertexPosition_worldSpace;

void main() {
  vertexPosition_worldSpace = (modelMatrix * vertexPosition).xyz;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vertexPosition;
}