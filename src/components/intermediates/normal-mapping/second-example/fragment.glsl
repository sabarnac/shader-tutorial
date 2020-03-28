varying highp vec2 uv;
varying highp mat3 tbnMatrix_viewSpace;
varying highp vec4 vertexPosition_viewSpace;

uniform highp mat4 viewMatrix;
uniform highp vec4 lightPosition_worldSpace;

uniform highp vec3 lightColor;
uniform highp float lightIntensity;

uniform highp float specularLobeFactor;
uniform highp float specularReflectivity;

uniform sampler2D diffuseTextureSampler;
uniform sampler2D normalTextureSampler;

void main() {
  highp vec4 diffuseColor = texture2D(diffuseTextureSampler, uv);
  highp vec4 normalColor = texture2D(normalTextureSampler, uv);

  highp vec3 normal_viewSpace = tbnMatrix_viewSpace * normalize((normalColor.xyz * 2.0) - 1.0);

  highp vec4 lightPosition_viewSpace = viewMatrix * lightPosition_worldSpace;
  highp vec3 lightDirection_viewSpace = normalize((lightPosition_viewSpace - vertexPosition_viewSpace).xyz);
  highp vec3 viewDirection_viewSpace = normalize(vertexPosition_viewSpace.xyz - vec3(0.0, 0.0, 0.0));

  highp vec3 lightColorIntensity = lightColor * lightIntensity;
  highp float distanceFromLight = distance(vertexPosition_viewSpace, lightPosition_viewSpace);

  highp float diffuseStrength = clamp(dot(normal_viewSpace, lightDirection_viewSpace), 0.0, 1.0);
  highp vec3 diffuseLight = (lightColorIntensity * diffuseStrength) / (distanceFromLight * distanceFromLight);

  highp vec3 lightReflection_viewSpace = reflect(lightDirection_viewSpace, normal_viewSpace);

  highp float specularStrength = clamp(dot(viewDirection_viewSpace, lightReflection_viewSpace), 0.0, 1.0);
  highp vec3 specularLight = (lightColorIntensity * pow(specularStrength, specularLobeFactor)) / (distanceFromLight * distanceFromLight);

  gl_FragColor.rgb = (diffuseColor.rgb * diffuseLight) + (specularReflectivity * specularLight);
  gl_FragColor.a = diffuseColor.a;
}