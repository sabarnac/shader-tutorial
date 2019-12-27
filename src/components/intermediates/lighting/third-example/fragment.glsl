varying highp vec2 uv;
varying highp vec3 diffuseLight;
varying highp vec3 specularLight;

uniform highp float ambientFactor;
uniform sampler2D colorTextureSampler;

void main() {
  highp vec4 textureColor = texture2D(colorTextureSampler, uv);
  gl_FragColor.rgb = (textureColor.rgb * ambientFactor) + (textureColor.rgb * diffuseLight) + (specularLight);
  gl_FragColor.a = textureColor.a;
}