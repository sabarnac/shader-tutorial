varying highp vec2 uv;
varying highp vec3 diffuseLight;
varying highp vec3 specularLight;

uniform highp float ambientFactor;
uniform highp float specularReflectivity;
uniform sampler2D colorTextureSampler;

void main() {
  highp vec4 diffuseColor = texture2D(colorTextureSampler, uv);
  highp vec4 ambientColor = vec4(diffuseColor);
  
  gl_FragColor.rgb = (ambientColor.rgb * ambientFactor) + (diffuseColor.rgb * diffuseLight) + (specularReflectivity * specularLight);
  gl_FragColor.a = diffuseColor.a;
}