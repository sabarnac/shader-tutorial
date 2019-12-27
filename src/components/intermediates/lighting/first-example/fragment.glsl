varying highp vec2 uv;
varying highp vec3 diffuseLight;

uniform sampler2D colorTextureSampler;

void main() {
  highp vec4 textureColor = texture2D(colorTextureSampler, uv);
  gl_FragColor.rgb = textureColor.rgb * diffuseLight;
  gl_FragColor.a = textureColor.a;
}