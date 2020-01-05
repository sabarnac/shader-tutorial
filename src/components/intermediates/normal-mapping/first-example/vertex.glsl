attribute vec4 vertexPosition;
attribute vec2 vertexUv;
attribute vec3 vertexNormal;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform vec4 lightPosition_worldSpace;
uniform vec3 lightColor;
uniform float lightIntensity;
uniform float surfaceReflectivity;

varying highp vec2 uv;
varying highp vec4 vertexPosition_viewSpace;
varying highp vec3 normal_viewSpace;
varying highp vec3 lightDirection_viewSpace;
varying highp float distanceFromLight;

void main() {
  highp vec4 vertexPosition_worldSpace = modelMatrix * vertexPosition;
  vertexPosition_viewSpace = viewMatrix * vertexPosition_worldSpace;
  gl_Position = projectionMatrix * vertexPosition_viewSpace;

  uv = vertexUv;

  distanceFromLight = distance(vertexPosition_worldSpace, lightPosition_worldSpace);
  normal_viewSpace = normalize((viewMatrix * modelMatrix * vec4(vertexNormal, 0.0)).xyz);
  lightDirection_viewSpace = normalize(((viewMatrix * lightPosition_worldSpace) - vertexPosition_viewSpace).xyz);
}