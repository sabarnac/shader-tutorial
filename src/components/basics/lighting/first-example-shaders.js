import { glsl } from "../../util"

export const firstVertexShaderSource = glsl`
attribute vec4 vertexPosition;
attribute vec2 vertexUv;
attribute vec4 vertexNormal;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform highp vec4 lightPosition_worldSpace;
uniform highp vec3 lightColor;
uniform highp float lightIntensity;

varying highp vec2 uv;
varying highp vec4 diffuseFactor;
varying highp vec4 specularFactor;

void main() {
  highp vec4 vertexPosition_worldSpace = modelMatrix * vertexPosition;
  highp vec4 vertexPosition_viewSpace = viewMatrix * vertexPosition_worldSpace;
  gl_Position = projectionMatrix * vertexPosition_viewSpace;

  uv = vertexUv;

  highp vec3 lightColorIntensity = lightColor * lightIntensity;
  highp float distanceFromLight = distance(vertexPosition_worldSpace, lightPosition_worldSpace);
  highp vec3 normal_viewSpace = (viewMatrix * modelMatrix * vertexNormal).xyz;
  highp vec3 viewDirection_viewSpace = vec3(0.0, 0.0, 0.0) - vertexPosition_viewSpace.xyz;
  highp vec3 lightDirection_viewSpace = viewDirection_viewSpace + (viewMatrix * lightPosition_worldSpace).xyz;

  highp float diffuseStrength = clamp(dot(normalize(lightDirection_viewSpace), normalize(normal_viewSpace)), 0.0, 1.0);
  diffuseFactor = vec4((lightColorIntensity * diffuseStrength) / (distanceFromLight * distanceFromLight), 1.0);

  highp vec3 lightReflection_viewSpace = reflect(-lightDirection_viewSpace, normal_viewSpace);
  highp float specularStrength = clamp(dot(normalize(viewDirection_viewSpace), normalize(lightReflection_viewSpace)), 0.0, 1.0);
  specularFactor = vec4((lightColorIntensity * specularStrength) / (distanceFromLight * distanceFromLight), 1.0);
}
`

export const firstFragmentShaderSource = glsl`
varying highp vec2 uv;
varying highp vec4 diffuseFactor;
varying highp vec4 specularFactor;

uniform highp float ambientFactor;
uniform sampler2D textureSampler;

void main() {
  highp vec4 textureColor = texture2D(textureSampler, uv);
  gl_FragColor = (textureColor * ambientFactor) + (textureColor * diffuseFactor) + (specularFactor);
}
`
