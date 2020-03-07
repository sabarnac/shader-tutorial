attribute vec4 vertexPosition;
attribute vec3 vertexNormal;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform vec4 lightPosition_worldSpace;
uniform vec3 lightColor;
uniform float lightIntensity;

varying highp vec3 vertexPosition_worldSpace;
varying highp vec3 diffuseLight;

void main() {
  vertexPosition_worldSpace = (modelMatrix * vertexPosition).xyz;
  highp vec4 vertexPosition_viewSpace = viewMatrix * modelMatrix * vertexPosition;
  
  gl_Position = projectionMatrix * vertexPosition_viewSpace;

  highp vec3 lightColorIntensity = lightColor * lightIntensity;
  highp float distanceFromLight = distance((modelMatrix * vertexPosition), lightPosition_worldSpace);
  highp vec3 normal_viewSpace = normalize((viewMatrix * modelMatrix * vec4(vertexNormal, 0.0)).xyz);
  highp vec3 lightDirection_viewSpace = normalize(((viewMatrix * lightPosition_worldSpace) - vertexPosition_viewSpace).xyz);

  highp float diffuseStrength = clamp(dot(normalize(normal_viewSpace), normalize(lightDirection_viewSpace)), 0.0, 1.0);
  diffuseLight = (lightColorIntensity * diffuseStrength) / (distanceFromLight * distanceFromLight);
}