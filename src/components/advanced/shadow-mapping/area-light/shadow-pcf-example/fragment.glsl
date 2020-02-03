varying highp vec4 depthCoord;
varying highp vec3 diffuseLight;

uniform highp vec2 texelSize;
uniform highp vec3 lightColor;
uniform highp float lightIntensity;
uniform highp vec4 lightPosition_worldSpace;
uniform highp float ambientFactor;
uniform sampler2D shadowTextureSampler;

const highp float acneBias = 0.005;

highp float getAverageVisibility(highp vec2 depthMapCoords, highp float currentDepth) {
  highp float visibility = 0.0;
  for (int x = -1; x <= 1; x++) {
    for (int y = -1; y <= 1; y++) {
      highp float closestDepth = texture2D(shadowTextureSampler, depthMapCoords.xy + (vec2(x, y) * texelSize)).z;
      visibility += currentDepth - acneBias > closestDepth ? 0.0 : 1.0;
    }
  }
  return visibility / 9.0;
}

void main() {
  highp vec4 surfaceColor = vec4(1.0);
  highp vec4 ambientColor = vec4(surfaceColor);

  highp vec3 depthMapCoords = (depthCoord.xyz / depthCoord.w) * 0.5 + 0.5;

  highp float currentDepth = depthMapCoords.z;
  highp float fragmentVisibility = getAverageVisibility(depthMapCoords.xy, currentDepth);

  gl_FragColor.rgb = (ambientColor.rgb * ambientFactor) + (fragmentVisibility * surfaceColor.rgb * diffuseLight);
  gl_FragColor.a = surfaceColor.a;
}