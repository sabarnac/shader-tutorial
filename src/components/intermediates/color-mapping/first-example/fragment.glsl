varying highp vec2 uv;

uniform sampler2D colorTextureSampler;

void main() {
  gl_FragColor = texture2D(colorTextureSampler, uv);
}