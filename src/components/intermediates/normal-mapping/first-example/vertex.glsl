attribute vec4 vertexPosition;
attribute vec2 vertexUv;
attribute vec3 vertexNormal;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform vec4 lightPosition_worldSpace;

varying highp vec2 uv;
varying highp vec4 fragmentPosition_viewSpace;
varying highp vec3 fragmentNormal_viewSpace;

void main() {
  highp vec4 vertexPosition_worldSpace = modelMatrix * vertexPosition;
  highp vec4 vertexPosition_viewSpace = viewMatrix * vertexPosition_worldSpace;

  gl_Position = projectionMatrix * vertexPosition_viewSpace;
  
  fragmentPosition_viewSpace = vertexPosition_viewSpace;
  fragmentNormal_viewSpace = normalize((viewMatrix * modelMatrix * vec4(vertexNormal, 0.0)).xyz);
  uv = vertexUv;
}