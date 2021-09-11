varying highp vec4 fragmentPosition_worldSpace;

uniform highp vec4 modelPosition_worldSpace;

uniform samplerCube cubeMapTextureSampler;

void main() {
  highp vec3 fragmentDirection = normalize(fragmentPosition_worldSpace.xyz - modelPosition_worldSpace.xyz);
  highp vec3 fragmentColor = textureCube(cubeMapTextureSampler, fragmentDirection).rgb;

  gl_FragColor = vec4(fragmentColor, 1.0);
}