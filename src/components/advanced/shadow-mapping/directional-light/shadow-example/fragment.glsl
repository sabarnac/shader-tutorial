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
  
  // Since we're rendering a directional light, the strength of the light doesn't drop with distance,
  // so leave out the distance calculation part.
  // highp float distanceFromLight = distance(fragmentPosition_worldSpace, lightPosition_worldSpace);
  // return (lightColorIntensity * diffuseStrength) / (distanceFromLight * distanceFromLight);
  return lightColorIntensity * diffuseStrength;
}

void main() {
  highp vec4 surfaceColor = vec4(1.0);
  highp vec4 ambientColor = vec4(surfaceColor);

  highp vec3 diffuseLight = getDiffuseLighting();

  highp vec3 shadowMapCoords = (fragmentPositionFromLight.xyz / fragmentPositionFromLight.w) * 0.5 + 0.5;
  highp float closestDepth = texture2D(shadowMapTextureSampler, shadowMapCoords.xy).z;

  highp float currentDepth = shadowMapCoords.z;
  highp float fragmentVisibility = currentDepth > closestDepth ? 0.0 : 1.0;

  gl_FragColor.rgb = (ambientColor.rgb * ambientFactor) + (fragmentVisibility * surfaceColor.rgb * diffuseLight);
  gl_FragColor.a = surfaceColor.a;
}