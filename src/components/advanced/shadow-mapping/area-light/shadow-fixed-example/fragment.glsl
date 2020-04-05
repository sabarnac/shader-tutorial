varying highp vec4 depthCoord;

varying highp vec4 vertexPosition_worldSpace;
varying highp vec3 vertexNormal_viewSpace;
varying highp vec3 lightDirection_viewSpace;

uniform highp vec3 lightColor;
uniform highp float lightIntensity;
uniform highp vec4 lightPlanePosition_worldSpace;
uniform highp vec4 lightDirection_worldSpace;
uniform highp float ambientFactor;
uniform sampler2D shadowTextureSampler;

highp vec4 getLightPosition_wrt_vertexPosition() {
  // https://en.wikipedia.org/wiki/Line%E2%80%93plane_intersection#Algebraic_form

  highp vec4 lightPlaneDirectionFromVertex = (lightPlanePosition_worldSpace - vertexPosition_worldSpace);
  highp float shortestDistanceOfLightFromVertex = dot(lightPlaneDirectionFromVertex, lightDirection_worldSpace) / dot(lightDirection_worldSpace, lightDirection_worldSpace);
  return vertexPosition_worldSpace + (lightDirection_worldSpace * shortestDistanceOfLightFromVertex);
}

highp vec3 getDiffuseLighting() {
  highp vec3 lightColorIntensity = lightColor * lightIntensity;
  highp vec4 lightPosition_worldSpace = getLightPosition_wrt_vertexPosition();
  highp float distanceFromLight = distance(vertexPosition_worldSpace, lightPosition_worldSpace);

  highp float diffuseStrength = clamp(dot(vertexNormal_viewSpace, lightDirection_viewSpace), 0.0, 1.0);
  return (lightColorIntensity * diffuseStrength) / (distanceFromLight * distanceFromLight);
}

void main() {
  highp vec4 surfaceColor = vec4(1.0);
  highp vec4 ambientColor = vec4(surfaceColor);

  highp vec3 diffuseLight = getDiffuseLighting();

  highp vec3 depthMapCoords = (depthCoord.xyz / depthCoord.w) * 0.5 + 0.5;
  highp float closestDepth = texture2D(shadowTextureSampler, depthMapCoords.xy).z;

  highp float acneBias = 0.005;
  highp float currentDepth = depthMapCoords.z;
  highp float fragmentVisibility = (currentDepth - acneBias) > closestDepth ? 0.0 : 1.0;

  gl_FragColor.rgb = (ambientColor.rgb * ambientFactor) + (fragmentVisibility * surfaceColor.rgb * diffuseLight);
  gl_FragColor.a = surfaceColor.a;
}