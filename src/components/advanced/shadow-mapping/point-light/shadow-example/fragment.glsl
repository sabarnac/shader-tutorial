varying highp vec4 vertexPosition_worldSpace;
varying highp vec3 vertexNormal_viewSpace;
varying highp vec3 lightDirection_viewSpace;

uniform highp mat4 viewMatrix;

uniform highp vec3 lightColor;
uniform highp float lightIntensity;
uniform highp vec4 lightPosition_worldSpace;

uniform highp float ambientFactor;
uniform highp float farPlane;

uniform samplerCube shadowMapTextureSampler;

const highp float acneBias = 0.02;

highp float getAverageVisibility(highp vec3 vertexDirection_worldSpace) {
  highp float currentDepth = length(vertexDirection_worldSpace) / farPlane;

  highp float visibility = 0.0;
  for (int xi = -1; xi <= 1; xi++) {
    for (int yi = -1; yi <= 1; yi++) {
      for (int zi = -1; zi <= 1; zi++) {
        highp float closestDepth = textureCube(shadowMapTextureSampler, vertexDirection_worldSpace + (vec3(xi, yi, zi) * 0.05)).z;
        visibility += currentDepth - acneBias > closestDepth ? 0.0 : 1.0;
      }
    }
  }
  return visibility / 27.0;
}

highp vec3 getDiffuseLighting() {
  highp vec3 lightColorIntensity = lightColor * lightIntensity;
  highp float distanceFromLight = distance(vertexPosition_worldSpace, lightPosition_worldSpace);

  highp float diffuseStrength = clamp(dot(vertexNormal_viewSpace, lightDirection_viewSpace), 0.0, 1.0);
  return (lightColorIntensity * diffuseStrength) / (distanceFromLight * distanceFromLight);
}

void main() {
  highp vec4 surfaceColor = vec4(1.0);
  highp vec4 ambientColor = vec4(surfaceColor);

  highp vec3 diffuseLight = getDiffuseLighting();

  highp vec3 vertexDirection_worldSpace = (vertexPosition_worldSpace - lightPosition_worldSpace).xyz;
  highp float fragmentVisibility = getAverageVisibility(vertexDirection_worldSpace);

  gl_FragColor.rgb = (ambientColor.rgb * ambientFactor) + (fragmentVisibility * surfaceColor.rgb * diffuseLight);
  gl_FragColor.a = surfaceColor.a;
}