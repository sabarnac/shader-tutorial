attribute vec4 vertexPosition;
attribute vec2 vertexUv;
attribute vec3 vertexNormal;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform vec4 lightPosition_worldSpace;
uniform vec3 lightColor;
uniform float lightIntensity;
uniform vec3 specularColor;
uniform float specularLobeFactor;

varying highp vec2 uv;
varying highp vec3 diffuseLight;
varying highp vec3 specularLight;

void main() {
  highp vec4 vertexPosition_worldSpace = modelMatrix * vertexPosition;
  highp vec4 vertexPosition_viewSpace = viewMatrix * vertexPosition_worldSpace;
  gl_Position = projectionMatrix * vertexPosition_viewSpace;

  uv = vertexUv;

  highp vec3 lightColorIntensity = lightColor * lightIntensity;
  highp float distanceFromLight = distance(vertexPosition_worldSpace, lightPosition_worldSpace);
  highp vec3 normal_viewSpace = normalize((viewMatrix * modelMatrix * vec4(vertexNormal, 0.0)).xyz);
  highp vec3 lightDirection_viewSpace = normalize(((viewMatrix * lightPosition_worldSpace) - vertexPosition_viewSpace).xyz);

  highp float diffuseStrength = clamp(dot(normal_viewSpace, lightDirection_viewSpace), 0.0, 1.0);
  diffuseLight = (lightColorIntensity * diffuseStrength) / (distanceFromLight * distanceFromLight);

  highp vec3 viewDirection_viewSpace = normalize(vertexPosition_viewSpace.xyz - vec3(0.0, 0.0, 0.0));
  highp vec3 lightReflection_viewSpace = reflect(lightDirection_viewSpace, normal_viewSpace);

  highp float specularStrength = clamp(dot(viewDirection_viewSpace, lightReflection_viewSpace), 0.0, 1.0);
  specularLight = (lightColorIntensity * pow(specularStrength, specularLobeFactor)) / (distanceFromLight * distanceFromLight);
}