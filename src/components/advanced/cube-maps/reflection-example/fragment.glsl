varying highp vec4 fragmentPosition_worldSpace;
varying highp vec3 fragmentNormal_worldSpace;

uniform highp vec4 modelPosition_worldSpace;
uniform highp vec4 cameraPosition_worldSpace;

uniform samplerCube cubeMapTextureSampler;

void main() {
  highp vec3 cameraDirection = normalize(fragmentPosition_worldSpace.xyz - cameraPosition_worldSpace.xyz);
  highp vec3 reflectionDirection = reflect(cameraDirection, normalize(fragmentNormal_worldSpace));

  highp vec3 fragmentColor = textureCube(cubeMapTextureSampler, reflectionDirection).rgb;

  gl_FragColor = vec4(fragmentColor, 1.0);
}