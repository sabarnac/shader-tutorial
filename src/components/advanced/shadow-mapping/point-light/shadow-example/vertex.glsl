attribute vec4 vertexPosition;
attribute vec3 vertexNormal;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform vec4 lightPosition_worldSpace;
uniform vec3 lightColor;
uniform float lightIntensity;

varying highp vec4 fragmentPosition_worldSpace;
varying highp vec3 fragmentNormal_viewSpace;
varying highp vec3 lightDirection_viewSpace;

void main() {
  highp vec4 vertexPosition_worldSpace = modelMatrix * vertexPosition;
  highp vec4 vertexPosition_viewSpace = viewMatrix * vertexPosition_worldSpace;
  
  gl_Position = projectionMatrix * vertexPosition_viewSpace;
  
  fragmentPosition_worldSpace = vertexPosition_worldSpace;

  highp vec4 lightPosition_viewSpace = viewMatrix * lightPosition_worldSpace;
  fragmentNormal_viewSpace = (viewMatrix * modelMatrix * vec4(vertexNormal, 0.0)).xyz;
  lightDirection_viewSpace = normalize((lightPosition_viewSpace - vertexPosition_viewSpace).xyz);
}