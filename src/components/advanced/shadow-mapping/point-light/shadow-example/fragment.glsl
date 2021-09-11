varying highp vec4 fragmentPosition_worldSpace;
varying highp vec3 fragmentNormal_viewSpace;
varying highp vec3 lightDirection_viewSpace;

uniform highp vec3 lightColor;
uniform highp float lightIntensity;
uniform highp vec4 lightPosition_worldSpace;

uniform highp float ambientFactor;
uniform highp float farPlane;

uniform samplerCube shadowMapTextureSampler;

const highp float acneBias = 0.02;

highp float getAverageVisibility(highp vec3 fragmentPosition_lightSpace) {
  highp float currentDepth = length(fragmentPosition_lightSpace) / farPlane;
  highp vec3 fragmentDirection_lightSpace = normalize(fragmentPosition_lightSpace);

  highp float visibility = 0.0;
  for (int xi = -2; xi <= 2; xi++) {
    for (int yi = -2; yi <= 2; yi++) {
      for (int zi = -2; zi <= 2; zi++) {
        highp float closestDepth = textureCube(shadowMapTextureSampler, fragmentDirection_lightSpace + (vec3(xi, yi, zi) * 0.02)).z;
        visibility += currentDepth - acneBias > closestDepth ? 0.0 : 1.0;
      }
    }
  }
  return visibility / 125.0;
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

  highp vec3 fragmentPosition_lightSpace = (fragmentPosition_worldSpace - lightPosition_worldSpace).xyz;
  highp float fragmentVisibility = getAverageVisibility(fragmentPosition_lightSpace);

  gl_FragColor.rgb = (ambientColor.rgb * ambientFactor) + (fragmentVisibility * surfaceColor.rgb * diffuseLight);
  gl_FragColor.a = surfaceColor.a;
}