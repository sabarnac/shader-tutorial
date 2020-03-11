varying highp vec3 vertexPosition_worldSpace;
varying highp vec3 diffuseLight;

uniform highp vec3 lightColor;
uniform highp float lightIntensity;
uniform highp vec4 lightPosition_worldSpace;
uniform highp float ambientFactor;
uniform highp float farPlane;
uniform samplerCube shadowTextureSampler;

const highp float acneBias = 0.02;

highp float getAverageVisibility() {
  highp vec3 vertexDirection_worldSpace = vertexPosition_worldSpace - lightPosition_worldSpace.xyz;
  highp float currentDepth = length(vertexDirection_worldSpace) / farPlane;

  highp float visibility = 0.0;
  for (int i = -1; i <= 1; i++) {
    highp float closestDepthXBias = textureCube(shadowTextureSampler, vertexDirection_worldSpace.xyz + (vec3(i, 0, 0) * 0.05)).z;
    highp float closestDepthYBias = textureCube(shadowTextureSampler, vertexDirection_worldSpace.xyz + (vec3(0, i, 0) * 0.05)).z;
    highp float closestDepthZBias = textureCube(shadowTextureSampler, vertexDirection_worldSpace.xyz + (vec3(0, 0, i) * 0.05)).z;
    visibility += currentDepth - acneBias > closestDepthXBias ? 0.0 : 1.0;
    visibility += currentDepth - acneBias > closestDepthYBias ? 0.0 : 1.0;
    visibility += currentDepth - acneBias > closestDepthZBias ? 0.0 : 1.0;
  }
  return visibility / 9.0;
}

void main() {
  highp vec4 surfaceColor = vec4(1.0);
  highp vec4 ambientColor = vec4(surfaceColor);

  highp float fragmentVisibility = getAverageVisibility();

  gl_FragColor.rgb = (ambientColor.rgb * ambientFactor) + (fragmentVisibility * surfaceColor.rgb * diffuseLight);
  gl_FragColor.a = surfaceColor.a;
}