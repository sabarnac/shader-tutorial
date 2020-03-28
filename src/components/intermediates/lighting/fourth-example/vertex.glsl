attribute vec4 vertexPosition;
attribute vec2 vertexUv;
attribute vec3 vertexNormal;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

varying highp vec2 uv;
varying highp vec4 vertexPosition_viewSpace;
varying highp vec3 vertexNormal_viewSpace;

void main() {
  highp vec4 vertexPosition_worldSpace = modelMatrix * vertexPosition;

  vertexPosition_viewSpace = viewMatrix * vertexPosition_worldSpace;
  vertexNormal_viewSpace = normalize((viewMatrix * modelMatrix * vec4(vertexNormal, 0.0)).xyz);

  gl_Position = projectionMatrix * vertexPosition_viewSpace;

  uv = vertexUv;
}