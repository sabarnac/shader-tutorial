varying highp vec3 color;

uniform highp float time;

void main() {
  highp float colorShift = cos(time / 500.0);
  gl_FragColor = vec4(clamp(color - colorShift, 0.0, 1.0), 1.0);
}