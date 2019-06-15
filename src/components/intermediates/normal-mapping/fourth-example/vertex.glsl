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

  tbnMatrix_tangentSpace = transpose(mat3(
    (viewMatrix * modelMatrix * vec4(normalize(vertexTangent), 0.0)).xyz,
    (viewMatrix * modelMatrix * vec4(normalize(vertexBiTangent), 0.0)).xyz,
    (viewMatrix * modelMatrix * vec4(normalize(vertexNormal), 0.0)).xyz
  ));

  vertexPosition_tangentSpace = tbnMatrix_tangentSpace * (viewMatrix * vertexPosition_worldSpace).xyz;
  distanceFromLight = distance(vertexPosition_worldSpace, lightPosition_worldSpace);
  lightDirection_tangentSpace = tbnMatrix_tangentSpace * normalize(((viewMatrix * lightPosition_worldSpace) - vertexPosition_viewSpace).xyz);
}