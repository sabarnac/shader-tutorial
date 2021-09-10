varying highp vec4 fragmentPositionFromLight;

varying highp vec4 fragmentPosition_worldSpace;
varying highp vec3 fragmentNormal_viewSpace;
varying highp vec3 lightDirection_viewSpace;

uniform highp vec3 lightColor;
uniform highp float lightIntensity;
uniform highp vec4 lightDirection_worldSpace;
uniform highp float ambientFactor;
uniform sampler2D shadowMapTextureSampler;

highp vec3 getDiffuseLighting() {
  highp vec3 lightColorIntensity = lightColor * lightIntensity;
  highp float diffuseStrength = clamp(dot(fragmentNormal_viewSpace, lightDirection_viewSpace), 0.0, 1.0);
  
  // highp float distanceFromLight = distance(fragmentPosition_worldSpace, lightPosition_worldSpace);
  return (lightColorIntensity * diffuseStrength) /* / (distanceFromLight * distanceFromLight) */;
}

void main() {
  highp vec4 surfaceColor = vec4(1.0);
  highp vec4 ambientColor = vec4(surfaceColor);

  highp vec3 diffuseLight = getDiffuseLighting();

  highp vec3 shadowMapCoords = (fragmentPositionFromLight.xyz / fragmentPositionFromLight.w) * 0.5 + 0.5;
  highp float closestDepth = texture2D(shadowMapTextureSampler, shadowMapCoords.xy).z;

  highp float acneBias = 0.00575;
  highp float currentDepth = shadowMapCoords.z;
  highp float fragmentVisibility = (currentDepth - acneBias) > closestDepth ? 0.0 : 1.0;

  gl_FragColor.rgb = (ambientColor.rgb * ambientFactor) + (fragmentVisibility * surfaceColor.rgb * diffuseLight);
  gl_FragColor.a = surfaceColor.a;
}