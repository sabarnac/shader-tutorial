varying highp vec2 uv;

varying highp vec4 vertexPosition_viewSpace;
varying highp vec3 normal_viewSpace;
varying highp vec3 lightDirection_viewSpace;
varying highp float distanceFromLight;

uniform highp vec3 lightColor;
uniform highp float lightIntensity;
uniform highp vec3 specularColor;
uniform highp float surfaceReflectivity;

uniform sampler2D textureSampler;

void main() {
  highp vec3 lightColorIntensity = lightColor * lightIntensity;

  highp float diffuseStrength = clamp(dot(normal_viewSpace, lightDirection_viewSpace), 0.0, 1.0);
  highp vec3 diffuseFactor = (lightColorIntensity * diffuseStrength) / (distanceFromLight * distanceFromLight);

  highp vec3 viewDirection_viewSpace = normalize(vertexPosition_viewSpace.xyz - vec3(0.0, 0.0, 0.0));
  highp vec3 lightReflection_viewSpace = reflect(lightDirection_viewSpace, normal_viewSpace);

  highp float specularStrength = clamp(dot(viewDirection_viewSpace, lightReflection_viewSpace), 0.0, 1.0);
  highp vec3 specularFactor = (lightColorIntensity * pow(specularStrength, surfaceReflectivity)) / (distanceFromLight * distanceFromLight);

  highp vec4 textureColor = texture2D(textureSampler, uv);
  gl_FragColor.rgb = (textureColor.rgb * diffuseFactor) + (specularFactor);
  gl_FragColor.a = textureColor.a;
}