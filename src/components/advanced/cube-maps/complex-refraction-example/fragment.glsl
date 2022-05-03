varying highp vec4 fragmentPosition_worldSpace;
varying highp vec3 fragmentNormal_worldSpace;

uniform highp vec4 modelPosition_worldSpace;
uniform highp vec4 cameraPosition_worldSpace;

uniform samplerCube cubeMapTextureSampler;

const highp float VACUUM_REFRACTION_INDEX = 1.00;
const highp float GLASS_REFRACTION_INDEX = 1.52;

void main() {
  highp vec3 cameraDirection = normalize(fragmentPosition_worldSpace.xyz - cameraPosition_worldSpace.xyz);
  
  highp vec3 intermediateRefractionDirection = refract(cameraDirection, normalize(fragmentNormal_worldSpace), VACUUM_REFRACTION_INDEX / GLASS_REFRACTION_INDEX);
  highp vec3 finalRefractionDirection = refract(intermediateRefractionDirection, normalize(fragmentNormal_worldSpace), GLASS_REFRACTION_INDEX / VACUUM_REFRACTION_INDEX);

  highp vec3 fragmentColor = textureCube(cubeMapTextureSampler, finalRefractionDirection).rgb;

  gl_FragColor = vec4(fragmentColor, 1.0);
}