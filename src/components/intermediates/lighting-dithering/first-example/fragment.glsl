varying highp vec2 uv;
varying highp vec3 diffuseFactor;
varying highp vec3 specularFactor;

uniform sampler2D textureSampler;

void main() {
  highp vec4 textureColor = texture2D(textureSampler, uv);
  gl_FragColor.rgb = textureColor.rgb * diffuseFactor;
  gl_FragColor.a = textureColor.a;
}