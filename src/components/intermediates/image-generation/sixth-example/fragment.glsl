uniform highp vec2 resolution;

highp float random(highp vec2 coords) {
   return fract(sin(dot(coords.xy, vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  highp vec2 coordinates = gl_FragCoord.xy / resolution;

  highp float fragmentColor = random(coordinates);
  gl_FragColor = vec4(vec3(fragmentColor), 1.0);
}