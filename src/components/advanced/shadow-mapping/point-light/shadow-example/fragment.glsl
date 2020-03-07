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
  for (int x = -1; x <= 1; x++) {
    for (int y = -1; y <= 1; y++) {
      for (int z = -1; z <= 1; z++) {
        highp float closestDepth = textureCube(shadowTextureSampler, vertexDirection_worldSpace.xyz + (vec3(x, y, z) * 0.05)).z;
        visibility += currentDepth - acneBias > closestDepth ? 0.0 : 1.0;
      }
    }
  }
  return visibility / 27.0;
}

void main() {
  highp vec4 surfaceColor = vec4(1.0);
  highp vec4 ambientColor = vec4(surfaceColor);

  highp float fragmentVisibility = getAverageVisibility();

  gl_FragColor.rgb = (ambientColor.rgb * ambientFactor) + (fragmentVisibility * surfaceColor.rgb * diffuseLight);
  gl_FragColor.a = surfaceColor.a;
}