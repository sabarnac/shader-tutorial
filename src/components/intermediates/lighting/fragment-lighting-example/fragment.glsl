varying highp vec4 fragmentPosition_worldSpace;
varying highp vec3 fragmentNormal_viewSpace;
varying highp vec3 lightDirection_viewSpace;

uniform highp mat4 viewMatrix;

uniform highp vec3 lightColor;
uniform highp float lightIntensity;
uniform highp vec4 lightPosition_worldSpace;

void main() {
  highp vec3 surfaceColor = vec3(1.0);

  highp vec3 lightColorIntensity = lightColor * lightIntensity;
  highp float distanceFromLight = distance(fragmentPosition_worldSpace, lightPosition_worldSpace);

  highp float diffuseStrength = clamp(dot(fragmentNormal_viewSpace, lightDirection_viewSpace), 0.0, 1.0);
  highp vec3 diffuseLight =  (lightColorIntensity * diffuseStrength) / (distanceFromLight * distanceFromLight);

  gl_FragColor.rgb = surfaceColor.rgb * diffuseLight;
  gl_FragColor.a = 1.0;
}