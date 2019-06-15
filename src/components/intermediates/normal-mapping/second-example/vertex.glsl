attribute vec4 vertexPosition;
attribute vec2 vertexUv;
attribute vec3 vertexNormal;
attribute vec3 vertexTangent;
attribute vec3 vertexBiTangent;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform highp vec4 lightPosition_worldSpace;
uniform highp vec3 lightColor;
uniform highp float lightIntensity;
uniform highp vec3 specularColor;
uniform highp float surfaceReflectivity;

varying highp vec2 uv;
varying highp mat3 tbnMatrix;
varying highp vec4 vertexPosition_viewSpace;
varying highp vec3 lightDirection_viewSpace;
varying highp float distanceFromLight;

void main() {
  highp vec4 vertexPosition_worldSpace = modelMatrix * vertexPosition;
  vertexPosition_viewSpace = viewMatrix * vertexPosition_worldSpace;
  gl_Position = projectionMatrix * vertexPosition_viewSpace;

  uv = vertexUv;

  tbnMatrix = mat3(viewMatrix * modelMatrix * mat4(
    vec4(normalize(vertexTangent), 0.0),
    vec4(normalize(vertexBiTangent), 0.0),
    vec4(normalize(vertexNormal), 0.0),
    vec4(0.0)
  ));

  distanceFromLight = distance(vertexPosition_worldSpace, lightPosition_worldSpace);
  lightDirection_viewSpace = normalize(((viewMatrix * lightPosition_worldSpace) - vertexPosition_viewSpace).xyz);
}