attribute vec4 vertexPosition;
attribute vec2 vertexUv;
attribute vec3 vertexNormal;
attribute vec3 vertexTangent;
attribute vec3 vertexBiTangent;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

varying highp vec2 uv;
varying highp mat3 tbnMatrix_viewSpace;
varying highp vec4 fragmentPosition_viewSpace;

void main() {
  highp vec4 vertexPosition_worldSpace = modelMatrix * vertexPosition;
  highp vec4 vertexPosition_viewSpace = viewMatrix * vertexPosition_worldSpace;
  gl_Position = projectionMatrix * vertexPosition_viewSpace;

  fragmentPosition_viewSpace = vertexPosition_viewSpace;
  uv = vertexUv;

  highp mat3 modelViewMatrix_3x3 = mat3(viewMatrix * modelMatrix);
  highp vec3 vertexTangent = normalize(vertexTangent);
  highp vec3 vertexBiTangent = normalize(vertexBiTangent);
  highp vec3 vertexNormal = normalize(vertexNormal);

  tbnMatrix_viewSpace = modelViewMatrix_3x3 * mat3(
    vertexTangent,
    vertexBiTangent,
    vertexNormal
  );
}