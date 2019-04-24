uniform highp vec2 resolution;

void main() {
  highp vec2 coordinates = gl_FragCoord.xy / resolution;

  highp float fragmentColor = mix(0.05, 0.35, 1.0 - coordinates.y);
  gl_FragColor = vec4(vec3(fragmentColor), 1.0);
}