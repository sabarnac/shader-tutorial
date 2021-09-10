varying highp vec4 fragmentPositionFromLight;

varying highp vec4 fragmentPosition_worldSpace;
varying highp vec3 fragmentNormal_viewSpace;
varying highp vec3 lightDirection_viewSpace;

uniform highp vec2 texelSize;
uniform highp vec3 lightColor;
uniform highp float lightIntensity;
uniform highp vec4 lightPosition_worldSpace;
uniform highp float ambientFactor;
uniform sampler2D shadowMapTextureSampler;

const highp float acneBias = 0.025;

highp float getAverageVisibility(highp vec2 shadowMapCoords, highp float currentDepth) {
  highp float visibility = 0.0;
  for (int x = -2; x <= 2; x++) {
    for (int y = -2; y <= 2; y++) {
      highp float closestDepth = texture2D(shadowMapTextureSampler, shadowMapCoords.xy + (vec2(x, y) * texelSize)).z;
      visibility += currentDepth - acneBias > closestDepth ? 0.0 : 1.0;
    }
  }
  return visibility / 25.0;
}

highp vec3 getDiffuseLighting() {
  highp vec3 lightColorIntensity = lightColor * lightIntensity;
  highp float diffuseStrength = clamp(dot(fragmentNormal_viewSpace, lightDirection_viewSpace), 0.0, 1.0);

  highp float distanceFromLight = distance(fragmentPosition_worldSpace, lightPosition_worldSpace);
  return (lightColorIntensity * diffuseStrength) / (distanceFromLight * distanceFromLight);
}

void main() {
  highp vec4 surfaceColor = vec4(1.0);
  highp vec4 ambientColor = vec4(surfaceColor);

  highp vec3 diffuseLight = getDiffuseLighting();

  highp vec3 shadowMapCoords = (fragmentPositionFromLight.xyz / fragmentPositionFromLight.w) * 0.5 + 0.5;

  highp float currentDepth = shadowMapCoords.z;
  highp float fragmentVisibility = getAverageVisibility(shadowMapCoords.xy, currentDepth);

  gl_FragColor.rgb = (ambientColor.rgb * ambientFactor) + (fragmentVisibility * surfaceColor.rgb * diffuseLight);
  gl_FragColor.a = surfaceColor.a;
}