import { glsl } from "../../util"

export const fourthVertexShaderSource = glsl`
attribute vec4 vertexPosition;
attribute vec2 vertexUv;
attribute vec3 vertexNormal;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform highp vec4 lightPosition_worldSpace;
uniform highp vec3 lightColor;
uniform highp float lightIntensity;
uniform highp vec3 specularColor;
uniform highp float surfaceReflectivity;

varying highp vec2 uv;
varying highp vec3 diffuseFactor;
varying highp vec3 specularFactor;

void main() {
  highp vec4 vertexPosition_worldSpace = modelMatrix * vertexPosition;
  highp vec4 vertexPosition_viewSpace = viewMatrix * vertexPosition_worldSpace;
  gl_Position = projectionMatrix * vertexPosition_viewSpace;

  uv = vertexUv;

  highp vec3 lightColorIntensity = lightColor * lightIntensity;
  highp float distanceFromLight = distance(vertexPosition_worldSpace, lightPosition_worldSpace);
  highp vec3 normal_viewSpace = normalize((viewMatrix * modelMatrix * vec4(vertexNormal, 0.0)).xyz);
  highp vec3 viewDirection_viewSpace = normalize(vec3(0.0, 0.0, 0.0) - vertexPosition_viewSpace.xyz);
  highp vec3 lightDirection_viewSpace = normalize(((viewMatrix * lightPosition_worldSpace) - vertexPosition_viewSpace).xyz);

  highp float diffuseStrength = clamp(dot(normal_viewSpace, lightDirection_viewSpace), 0.0, 1.0);
  diffuseFactor = (lightColorIntensity * diffuseStrength) / (distanceFromLight * distanceFromLight);

  highp vec3 lightReflection_viewSpace = reflect(-lightDirection_viewSpace, normal_viewSpace);
  highp float specularStrength = clamp(dot(viewDirection_viewSpace, lightReflection_viewSpace), 0.0, 1.0);
  specularFactor = (lightColorIntensity * pow(specularStrength, surfaceReflectivity)) / (distanceFromLight * distanceFromLight);
}
`

export const fourthFragmentShaderSource = glsl`
varying highp vec2 uv;
varying highp vec3 diffuseFactor;
varying highp vec3 specularFactor;

uniform highp float noiseGranularity;
uniform highp float ambientFactor;
uniform sampler2D textureSampler;

highp float random(vec2 coords) {
   return fract(sin(dot(coords.xy,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  highp vec4 textureColor = texture2D(textureSampler, uv);
  gl_FragColor.rgb = (textureColor.rgb * ambientFactor) + (textureColor.rgb * diffuseFactor) + (specularFactor);
  gl_FragColor.rgb += mix(-noiseGranularity, noiseGranularity, random(gl_FragCoord.xy));
  gl_FragColor.a = textureColor.a;
}
`