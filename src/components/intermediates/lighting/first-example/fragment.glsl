varying highp vec2 uv;
varying highp vec3 diffuseLight;

uniform sampler2D colorTextureSampler;

void main() {
  highp vec4 diffuseColor = texture2D(colorTextureSampler, uv);

  gl_FragColor.rgb = diffuseColor.rgb * diffuseLight;
  gl_FragColor.a = diffuseColor.a;
}