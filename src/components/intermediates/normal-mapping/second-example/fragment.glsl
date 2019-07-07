varying highp vec2 uv;

varying highp mat3 tbnMatrix_viewSpace;
varying highp vec4 vertexPosition_viewSpace;
varying highp vec3 lightDirection_viewSpace;
varying highp float distanceFromLight;

uniform highp mat4 modelMatrix;
uniform highp mat4 viewMatrix;

uniform highp vec3 lightColor;
uniform highp float lightIntensity;
uniform highp vec3 specularColor;
uniform highp float specularLobeFactor;

uniform sampler2D textureSampler;
uniform sampler2D normalTextureSampler;

void main() {
  highp vec3 lightColorIntensity = lightColor * lightIntensity;

  highp vec4 normalColor = texture2D(normalTextureSampler, uv);
  highp vec4 textureColor = texture2D(textureSampler, uv);

  highp vec3 normal_viewSpace = tbnMatrix_viewSpace * normalize((normalColor.xyz * 2.0) - 1.0);

  highp float diffuseStrength = clamp(dot(normal_viewSpace, lightDirection_viewSpace), 0.0, 1.0);
  highp vec3 diffuseLight = (lightColorIntensity * diffuseStrength) / (distanceFromLight * distanceFromLight);

  highp vec3 viewDirection_viewSpace = normalize(vertexPosition_viewSpace.xyz - vec3(0.0, 0.0, 0.0));
  highp vec3 lightReflection_viewSpace = reflect(lightDirection_viewSpace, normal_viewSpace);

  highp float specularStrength = clamp(dot(viewDirection_viewSpace, lightReflection_viewSpace), 0.0, 1.0);
  highp vec3 specularLight = (lightColorIntensity * pow(specularStrength, specularLobeFactor)) / (distanceFromLight * distanceFromLight);

  gl_FragColor.rgb = (textureColor.rgb * diffuseLight) + (specularLight);
  gl_FragColor.a = textureColor.a;
}