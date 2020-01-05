varying highp vec2 uv;

varying highp vec4 vertexPosition_viewSpace;
varying highp vec3 normal_viewSpace;
varying highp vec3 lightDirection_viewSpace;
varying highp float distanceFromLight;

uniform highp vec3 lightColor;
uniform highp float lightIntensity;
uniform highp float specularReflectivity;
uniform highp float specularLobeFactor;

uniform sampler2D diffuseTextureSampler;

void main() {
  highp vec3 lightColorIntensity = lightColor * lightIntensity;

  highp float diffuseStrength = clamp(dot(normal_viewSpace, lightDirection_viewSpace), 0.0, 1.0);
  highp vec3 diffuseLight = (lightColorIntensity * diffuseStrength) / (distanceFromLight * distanceFromLight);

  highp vec3 viewDirection_viewSpace = normalize(vertexPosition_viewSpace.xyz - vec3(0.0, 0.0, 0.0));
  highp vec3 lightReflection_viewSpace = reflect(lightDirection_viewSpace, normal_viewSpace);

  highp float specularStrength = clamp(dot(viewDirection_viewSpace, lightReflection_viewSpace), 0.0, 1.0);
  highp vec3 specularLight = (lightColorIntensity * pow(specularStrength, specularLobeFactor)) / (distanceFromLight * distanceFromLight);

  highp vec4 diffuseColor = texture2D(diffuseTextureSampler, uv);
  
  gl_FragColor.rgb = (diffuseColor.rgb * diffuseLight) + (specularReflectivity * specularLight);
  gl_FragColor.a = diffuseColor.a;
}