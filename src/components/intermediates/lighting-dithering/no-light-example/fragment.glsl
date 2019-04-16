varying highp vec2 uv;

uniform sampler2D textureSampler;

void main() {
  gl_FragColor = texture2D(textureSampler, uv);
  gl_FragColor.rgb = gl_FragColor.rgb * 0.0;
}