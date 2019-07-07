attribute vec4 vertexPosition;
attribute vec2 vertexUv;
attribute vec3 vertexNormal;
attribute vec3 vertexTangent;
attribute vec3 vertexBiTangent;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform vec4 lightPosition_worldSpace;
uniform vec3 lightColor;
uniform float lightIntensity;
uniform vec3 specularColor;
uniform float surfaceReflectivity;

varying highp vec2 uv;
varying highp mat3 tbnMatrix_tangentSpace;
varying highp vec3 vertexPosition_tangentSpace;
varying highp vec3 lightDirection_tangentSpace;
varying highp float distanceFromLight;

mat3 transpose(mat3 m) {
  return mat3(m[0][0], m[1][0], m[2][0],
              m[0][1], m[1][1], m[2][1],
              m[0][2], m[1][2], m[2][2]);
}

void main() {
  highp vec4 vertexPosition_worldSpace = modelMatrix * vertexPosition;
  highp vec4 vertexPosition_viewSpace = viewMatrix * vertexPosition_worldSpace;
  gl_Position = projectionMatrix * vertexPosition_viewSpace;

  uv = vertexUv;

  highp mat3 modelViewMatrix_3x3 = mat3(viewMatrix * modelMatrix);
  highp vec3 vertexTangent_viewSpace = modelViewMatrix_3x3 * normalize(vertexTangent);
  highp vec3 vertexBiTangent_viewSpace = modelViewMatrix_3x3 * normalize(vertexBiTangent);
  highp vec3 vertexNormal_viewSpace = modelViewMatrix_3x3 * normalize(vertexNormal);

  tbnMatrix_tangentSpace = transpose(mat3(
    vertexTangent_viewSpace,
    vertexBiTangent_viewSpace,
    vertexNormal_viewSpace
  ));

  vertexPosition_tangentSpace = tbnMatrix_tangentSpace * (viewMatrix * vertexPosition_worldSpace).xyz;
  distanceFromLight = distance(vertexPosition_worldSpace, lightPosition_worldSpace);
  lightDirection_tangentSpace = tbnMatrix_tangentSpace * normalize(((viewMatrix * lightPosition_worldSpace) - vertexPosition_viewSpace).xyz);
}