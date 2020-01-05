varying highp vec2 uv;
varying highp vec3 diffuseLight;

uniform sampler2D colorTextureSampler;

void main() {
  highp vec4 surfaceColor = texture2D(colorTextureSampler, uv);

  gl_FragColor.rgb = surfaceColor.rgb * diffuseLight;
  gl_FragColor.a = surfaceColor.a;
}