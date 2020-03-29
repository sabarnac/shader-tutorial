varying highp vec2 uv;
varying highp vec3 diffuseLight;
varying highp vec3 specularLight;

uniform highp float ambientFactor;
uniform highp float specularReflectivity;
uniform sampler2D colorTextureSampler;

void main() {
  highp vec4 surfaceColor = texture2D(colorTextureSampler, uv);
  highp vec4 ambientColor = vec4(surfaceColor);
  highp vec4 specularColor = vec4(1.0);
  
  gl_FragColor.rgb = (ambientColor.rgb * ambientFactor) + (surfaceColor.rgb * diffuseLight) + (specularColor.rgb * specularReflectivity * specularLight);
  gl_FragColor.a = surfaceColor.a;
}