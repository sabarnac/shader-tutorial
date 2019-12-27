varying highp vec2 uv;

uniform sampler2D colorTextureSampler;

void main() {
  gl_FragColor = texture2D(colorTextureSampler, uv);
  gl_FragColor.rgb = gl_FragColor.rgb * 0.0;
}