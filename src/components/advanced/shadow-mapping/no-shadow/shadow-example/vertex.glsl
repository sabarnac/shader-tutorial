attribute vec4 vertexPosition;
attribute vec3 vertexNormal;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform mat4 lightModelMatrix;
uniform mat4 lightViewMatrix;
uniform mat4 lightProjectionMatrix;

uniform vec4 lightPosition_worldSpace;
uniform vec3 lightColor;
uniform float lightIntensity;

varying highp vec4 vertexPosition_worldSpace;
varying highp vec3 vertexNormal_viewSpace;
varying highp vec3 lightDirection_viewSpace;

void main() {
  vertexPosition_worldSpace = modelMatrix * vertexPosition;
  highp vec4 vertexPosition_viewSpace = viewMatrix * vertexPosition_worldSpace;
  
  gl_Position = projectionMatrix * vertexPosition_viewSpace;
  
  highp vec4 lightPosition_viewSpace = viewMatrix * lightPosition_worldSpace;
  vertexNormal_viewSpace = (viewMatrix * modelMatrix * vec4(vertexNormal, 0.0)).xyz;
  lightDirection_viewSpace = normalize((lightPosition_viewSpace - vertexPosition_viewSpace).xyz);
}