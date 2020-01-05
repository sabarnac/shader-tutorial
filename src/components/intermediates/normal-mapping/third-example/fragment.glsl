varying highp vec2 uv;

varying highp vec3 vertexPosition_tangentSpace;
varying highp vec3 lightDirection_tangentSpace;
varying highp float distanceFromLight;

uniform highp mat4 modelMatrix;
uniform highp mat4 viewMatrix;

uniform highp vec3 lightColor;
uniform highp float lightIntensity;
uniform highp float specularReflectivity;
uniform highp float specularLobeFactor;

uniform sampler2D diffuseTextureSampler;
uniform sampler2D normalTextureSampler;

void main() {
  highp vec3 lightColorIntensity = lightColor * lightIntensity;

  highp vec4 normalColor = texture2D(normalTextureSampler, uv);
  highp vec4 textureColor = texture2D(diffuseTextureSampler, uv);

  highp vec3 normal_tangentSpace = normalize((normalColor.xyz * 2.0) - 1.0);

  highp float diffuseStrength = clamp(dot(normal_tangentSpace, lightDirection_tangentSpace), 0.0, 1.0);
  highp vec3 diffuseLight = (lightColorIntensity * diffuseStrength) / (distanceFromLight * distanceFromLight);

  highp vec3 viewDirection_tangentSpace = normalize(vertexPosition_tangentSpace.xyz - vec3(0.0, 0.0, 0.0));
  highp vec3 lightReflection_tangentSpace = reflect(lightDirection_tangentSpace, normal_tangentSpace);

  highp float specularStrength = clamp(dot(viewDirection_tangentSpace, lightReflection_tangentSpace), 0.0, 1.0);
  highp vec3 specularLight = (lightColorIntensity * pow(specularStrength, specularLobeFactor)) / (distanceFromLight * distanceFromLight);

  highp vec4 diffuseColor = texture2D(diffuseTextureSampler, uv);
  
  gl_FragColor.rgb = (diffuseColor.rgb * diffuseLight) + (specularReflectivity * specularLight);
  gl_FragColor.a = diffuseColor.a;
}