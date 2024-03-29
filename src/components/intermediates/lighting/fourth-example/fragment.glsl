varying highp vec2 uv;
varying highp vec4 fragmentPosition_viewSpace;
varying highp vec3 fragmentNormal_viewSpace;

uniform highp mat4 viewMatrix;
uniform highp vec4 lightPosition_worldSpace;

uniform highp vec3 lightColor;
uniform highp float lightIntensity;

uniform highp float ambientFactor;

uniform highp float specularLobeFactor;
uniform highp float specularReflectivity;

uniform sampler2D colorTextureSampler;

void main() {
  highp vec4 surfaceColor = texture2D(colorTextureSampler, uv);
  highp vec4 ambientColor = vec4(surfaceColor);
  highp vec4 specularColor = vec4(1.0);

  highp vec4 lightPosition_viewSpace = viewMatrix * lightPosition_worldSpace;
  highp vec3 lightDirection_viewSpace = normalize((lightPosition_viewSpace - fragmentPosition_viewSpace).xyz);
  highp vec3 viewDirection_viewSpace = normalize(fragmentPosition_viewSpace.xyz - vec3(0.0, 0.0, 0.0));

  highp vec3 lightColorIntensity = lightColor * lightIntensity;
  highp float distanceFromLight = distance(fragmentPosition_viewSpace, lightPosition_viewSpace);

  highp float diffuseStrength = clamp(dot(fragmentNormal_viewSpace, lightDirection_viewSpace), 0.0, 1.0);
  highp vec3 diffuseLight =  (lightColorIntensity * diffuseStrength) / (distanceFromLight * distanceFromLight);

  highp vec3 lightReflection_viewSpace = reflect(lightDirection_viewSpace, fragmentNormal_viewSpace);

  highp float specularStrength = clamp(dot(viewDirection_viewSpace, lightReflection_viewSpace), 0.0, 1.0);
  highp vec3 specularLight = (lightColorIntensity * pow(specularStrength, specularLobeFactor)) / (distanceFromLight * distanceFromLight);

  gl_FragColor.rgb = (ambientColor.rgb * ambientFactor) + (surfaceColor.rgb * diffuseLight) + (specularColor.rgb * specularReflectivity * specularLight);
  gl_FragColor.a = surfaceColor.a;
}